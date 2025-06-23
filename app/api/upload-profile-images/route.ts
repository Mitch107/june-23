import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const formData = await request.formData()
    const profileId = formData.get("profileId") as string
    const mediaFiles = formData.getAll("media") as File[]

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 })
    }

    const uploadedImages = []
    const uploadErrors = []

    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i]

      if (!file || file.size === 0) {
        continue
      }

      try {
        // Generate unique filename
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
        const fileName = `${profileId}/${Date.now()}-${i}.${fileExt}`

        // Convert file to Uint8Array
        const fileBuffer = new Uint8Array(await file.arrayBuffer())

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from("profile-images")
          .upload(fileName, fileBuffer, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          console.error("Upload error:", uploadError)
          uploadErrors.push(`Failed to upload ${file.name}`)
          continue
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabaseAdmin.storage.from("profile-images").getPublicUrl(fileName)

        // Update the placeholder image record
        const { data: imageData, error: imageError } = await supabaseAdmin
          .from("profile_images")
          .update({
            image_url: publicUrl,
          })
          .eq("profile_id", profileId)
          .eq("display_order", i)
          .select()
          .single()

        if (!imageError) {
          uploadedImages.push(imageData)
        }
      } catch (error) {
        console.error("Error processing file:", error)
        uploadErrors.push(`Error processing ${file.name}`)
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedImages.length,
      errors: uploadErrors,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
