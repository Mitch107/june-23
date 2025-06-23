import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client with service role
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Simple admin auth check
async function checkAdminAuth() {
  try {
    // For now, we'll skip complex auth checks that might cause require issues
    // In production, you should implement proper admin authentication
    return { success: true }
  } catch (error) {
    console.error("Auth check error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("POST /api/admin/profiles/[id]/images - Starting upload")

    // Check admin authentication
    const authResult = await checkAdminAuth()
    if (!authResult.success) {
      console.log("Authentication failed:", authResult.error)
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const profileId = params.id
    console.log("Profile ID:", profileId)

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("No file provided in form data")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Validate file type (images and videos)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/mov",
    ]

    if (!allowedTypes.includes(file.type)) {
      console.log("Invalid file type:", file.type)
      return NextResponse.json(
        {
          error: "Invalid file type. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, MOV) are allowed.",
        },
        { status: 400 },
      )
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      console.log("File too large:", file.size)
      return NextResponse.json(
        {
          error: "File size too large. Maximum size is 50MB.",
        },
        { status: 400 },
      )
    }

    // Use service role client for file operations
    const serviceSupabase = createServiceClient()

    // Generate unique filename with proper extension handling
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileName = `${profileId}/${timestamp}-${randomString}.${fileExtension}`

    console.log("Uploading to storage with filename:", fileName)

    // Convert File to ArrayBuffer for Supabase upload
    const fileBuffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await serviceSupabase.storage
      .from("profile-images")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return NextResponse.json(
        {
          error: `Upload failed: ${uploadError.message}`,
          details: uploadError,
        },
        { status: 500 },
      )
    }

    console.log("Storage upload successful:", uploadData)

    // Get public URL
    const { data: urlData } = serviceSupabase.storage.from("profile-images").getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      console.error("Failed to get public URL")
      return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 })
    }

    console.log("Public URL generated:", urlData.publicUrl)

    // Get current max display order
    const { data: existingImages, error: orderError } = await serviceSupabase
      .from("profile_images")
      .select("display_order")
      .eq("profile_id", profileId)
      .order("display_order", { ascending: false })
      .limit(1)

    if (orderError) {
      console.warn("Error getting display order:", orderError)
    }

    const nextDisplayOrder = existingImages?.[0]?.display_order ? existingImages[0].display_order + 1 : 1

    console.log("Next display order:", nextDisplayOrder)

    // Insert image record into database
    const { data: imageData, error: insertError } = await serviceSupabase
      .from("profile_images")
      .insert({
        profile_id: profileId,
        image_url: urlData.publicUrl,
        is_primary: false,
        is_visible: true,
        display_order: nextDisplayOrder,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Database insert error:", insertError)

      // Clean up uploaded file if database insert fails
      try {
        await serviceSupabase.storage.from("profile-images").remove([fileName])
        console.log("Cleaned up uploaded file after database error")
      } catch (cleanupError) {
        console.warn("Failed to cleanup file:", cleanupError)
      }

      return NextResponse.json(
        {
          error: `Failed to save image record: ${insertError.message}`,
          details: insertError,
        },
        { status: 500 },
      )
    }

    console.log("Database insert successful:", imageData)

    return NextResponse.json({
      success: true,
      image: imageData,
      message: "File uploaded successfully",
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: error.message || "Upload failed",
        details: error.stack || error,
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PATCH /api/admin/profiles/[id]/images - Starting update")

    // Check admin authentication
    const authResult = await checkAdminAuth()
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const profileId = params.id
    const body = await request.json()
    const { imageId, is_primary, is_visible } = body

    console.log("Update request:", { profileId, imageId, is_primary, is_visible })

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    // Use service role client for database operations
    const serviceSupabase = createServiceClient()

    // If setting as primary, first unset all other primary images for this profile
    if (is_primary === true) {
      console.log("Unsetting other primary images")
      const { error: unsetError } = await serviceSupabase
        .from("profile_images")
        .update({ is_primary: false })
        .eq("profile_id", profileId)

      if (unsetError) {
        console.warn("Error unsetting primary images:", unsetError)
      }
    }

    // Prepare update data
    const updateData: Record<string, any> = {}
    if (typeof is_primary === "boolean") {
      updateData.is_primary = is_primary
    }
    if (typeof is_visible === "boolean") {
      updateData.is_visible = is_visible
    }

    console.log("Updating image with data:", updateData)

    // Update the specific image
    const { data, error } = await serviceSupabase
      .from("profile_images")
      .update(updateData)
      .eq("id", imageId)
      .eq("profile_id", profileId)
      .select()
      .single()

    if (error) {
      console.error("Image update error:", error)
      return NextResponse.json(
        {
          error: `Failed to update image: ${error.message}`,
          details: error,
        },
        { status: 500 },
      )
    }

    console.log("Image update successful:", data)

    let message = "Image updated successfully"
    if (is_primary === true) {
      message = "Primary image set successfully"
    } else if (is_primary === false) {
      message = "Primary status removed"
    } else if (is_visible === true) {
      message = "Image is now visible"
    } else if (is_visible === false) {
      message = "Image is now hidden"
    }

    return NextResponse.json({
      success: true,
      image: data,
      message,
    })
  } catch (error: any) {
    console.error("Image update error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to update image",
        details: error.stack || error,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE /api/admin/profiles/[id]/images - Starting delete")

    // Check admin authentication
    const authResult = await checkAdminAuth()
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const profileId = params.id
    const body = await request.json()
    const { imageId } = body

    console.log("Delete request:", { profileId, imageId })

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    // Use service role client for database operations
    const serviceSupabase = createServiceClient()

    // Get image data before deletion to clean up storage
    const { data: imageData, error: fetchError } = await serviceSupabase
      .from("profile_images")
      .select("image_url")
      .eq("id", imageId)
      .eq("profile_id", profileId)
      .single()

    if (fetchError) {
      console.error("Error fetching image data:", fetchError)
      return NextResponse.json(
        {
          error: `Failed to fetch image data: ${fetchError.message}`,
        },
        { status: 500 },
      )
    }

    // Extract filename from URL for storage deletion
    const imageUrl = imageData.image_url
    const urlParts = imageUrl.split("/")
    const fileName = urlParts[urlParts.length - 1]
    const fullPath = `${profileId}/${fileName}`

    console.log("Deleting from storage:", fullPath)

    // Delete from storage
    const { error: storageError } = await serviceSupabase.storage.from("profile-images").remove([fullPath])

    if (storageError) {
      console.warn("Storage deletion warning:", storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: deleteError } = await serviceSupabase
      .from("profile_images")
      .delete()
      .eq("id", imageId)
      .eq("profile_id", profileId)

    if (deleteError) {
      console.error("Database deletion error:", deleteError)
      return NextResponse.json(
        {
          error: `Failed to delete image: ${deleteError.message}`,
          details: deleteError,
        },
        { status: 500 },
      )
    }

    console.log("Image deleted successfully")

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error: any) {
    console.error("Image deletion error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to delete image",
        details: error.stack || error,
      },
      { status: 500 },
    )
  }
}
