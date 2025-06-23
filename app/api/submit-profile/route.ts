import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    // Use service role client to bypass RLS for profile submissions
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Parse the form data
    const formData = await request.formData()

    // Calculate age from birth date
    const birthDateStr = formData.get("age") as string
    const birthDate = new Date(birthDateStr)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    // Parse JSON fields safely
    const parseJsonField = (field: string): any[] => {
      try {
        const value = formData.get(field) as string
        return value ? JSON.parse(value) : []
      } catch {
        return []
      }
    }

    // Extract contact methods - store as individual fields
    const contactMethods = {
      whatsapp: (formData.get("whatsapp") as string) || "",
      instagram: (formData.get("instagram") as string) || "",
      tiktok: (formData.get("tiktok") as string) || "",
      facebook: (formData.get("facebook") as string) || "",
      telegram: (formData.get("telegram") as string) || "",
      email: (formData.get("email") as string) || "",
    }

    // Extract profile data using only existing database columns
    const profileData = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
      age: age,
      birth_date: birthDateStr, // Store the birth date
      location: formData.get("location") as string,
      gender: formData.get("gender") as string, // Store gender
      height: formData.get("height") as string,
      education: formData.get("education") as string,
      profession: (formData.get("actualOccupation") as string) || parseJsonField("occupation").join(", "),
      languages: parseJsonField("languages"),
      interests: parseJsonField("interests"),
      relationship_status: formData.get("relationship") as string,
      children: formData.get("children") as string,
      smoking: formData.get("smoking") as string,
      drinking: formData.get("drinking") as string,
      body_type: formData.get("bodyType") as string,
      appearance: formData.get("appearance") as string,
      looking_for: parseJsonField("lookingFor"),
      description: formData.get("description") as string,
      contact_email: contactMethods.email,
      contact_phone: "", // Not used anymore
      contact_whatsapp: contactMethods.whatsapp,
      contact_instagram: contactMethods.instagram,
      contact_tiktok: contactMethods.tiktok,
      contact_facebook: contactMethods.facebook,
      contact_telegram: contactMethods.telegram,
      status: "pending",
      price: 25, // Default price
      featured: false,
      verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Attempting to insert profile:", profileData)

    // Insert profile into database using service role (bypasses RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      console.error("Profile insertion error:", profileError)
      return NextResponse.json(
        {
          error: "Failed to create profile",
          details: profileError.message,
          code: profileError.code,
        },
        { status: 500 },
      )
    }

    console.log("Profile created successfully:", profile.id)

    // Handle media file uploads (both images and videos)
    const mediaFiles = formData.getAll("media") as File[]
    console.log(`Processing ${mediaFiles.length} media files`)

    const uploadedImages = []
    const uploadErrors = []

    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i]

      if (!file || file.size === 0) {
        continue
      }

      try {
        // Check if file is image or video
        const isVideo = file.type.startsWith("video/")
        const isImage = file.type.startsWith("image/")

        if (!isImage && !isVideo) {
          uploadErrors.push(`${file.name} is not a valid image or video file`)
          continue
        }

        // Generate unique filename with proper extension
        const fileExt = file.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "jpg")
        const fileName = `${profile.id}/${Date.now()}-${i}.${fileExt}`

        // Convert file to Uint8Array
        const fileBuffer = new Uint8Array(await file.arrayBuffer())

        // Upload to Supabase Storage with proper content type
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from("profile-images")
          .upload(fileName, fileBuffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          })

        if (uploadError) {
          console.error("Upload error for file", i, ":", uploadError)
          uploadErrors.push(`Failed to upload ${file.name}: ${uploadError.message}`)
          continue
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabaseAdmin.storage.from("profile-images").getPublicUrl(fileName)

        // Insert image record into profile_images table
        const { data: imageData, error: imageError } = await supabaseAdmin
          .from("profile_images")
          .insert({
            profile_id: profile.id,
            image_url: publicUrl,
            is_primary: i === 0, // First file is primary
            display_order: i,
          })
          .select()
          .single()

        if (imageError) {
          console.error("Image record insertion error:", imageError)
          uploadErrors.push(
            `Failed to save ${isVideo ? "video" : "image"} record for ${file.name}: ${imageError.message}`,
          )
        } else {
          uploadedImages.push(imageData)
          console.log(`Successfully uploaded and saved ${isVideo ? "video" : "image"} ${i + 1}`)
        }
      } catch (error) {
        console.error("Error processing file", i, ":", error)
        uploadErrors.push(`Error processing ${file.name}`)
      }
    }

    console.log(
      `Profile submission complete. Profile ID: ${profile.id}, Files uploaded: ${uploadedImages.length}, Errors: ${uploadErrors.length}`,
    )

    return NextResponse.json({
      success: true,
      message: "Profile submitted successfully",
      profile: {
        id: profile.id,
        name: profile.name,
        status: profile.status,
      },
      images: {
        uploaded: uploadedImages.length,
        errors: uploadErrors,
      },
    })
  } catch (error) {
    console.error("Submit profile error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
