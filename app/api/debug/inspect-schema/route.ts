import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const supabase = createServerClient()

    const results: any = {}

    // 1. Check user_profiles table structure
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable, column_default")
        .eq("table_name", "user_profiles")
        .eq("table_schema", "public")
        .order("ordinal_position")

      if (!schemaError) {
        results.userProfilesSchema = schemaData
      }
    } catch (error) {
      console.log("Schema check failed:", error)
    }

    // 2. Check available tables
    try {
      const { data: tablesData, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .or("table_name.like.%user%,table_name.like.%profile%,table_name.like.%admin%")
        .order("table_name")

      if (!tablesError) {
        results.availableTables = tablesData
      }
    } catch (error) {
      console.log("Tables check failed:", error)
    }

    // 3. Check if user exists in auth
    try {
      const { data: authData, error: authError } = await supabase
        .from("auth.users")
        .select("id, email, created_at, email_confirmed_at")
        .eq("email", email)

      if (!authError) {
        results.authUser = authData
      }
    } catch (error) {
      console.log("Auth check failed:", error)
    }

    // 4. Check if profile exists (try different approaches)
    let profileExists = false
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle()

      if (!profileError && profileData) {
        profileExists = true
      }
    } catch (error) {
      console.log("Profile check failed:", error)
    }

    results.profileCheck = profileExists

    // 5. Generate recommended SQL based on findings
    if (results.authUser && results.authUser.length > 0 && !profileExists) {
      const user = results.authUser[0]
      const columns = results.userProfilesSchema || []

      // Build SQL based on actual schema
      let sql = `-- Create user profile\nINSERT INTO user_profiles (`
      let values = `VALUES (`

      const columnMappings = []

      // Check for common column patterns
      if (columns.find((c: any) => c.column_name === "id")) {
        columnMappings.push({ col: "id", val: `'${user.id}'` })
      }
      if (columns.find((c: any) => c.column_name === "user_id")) {
        columnMappings.push({ col: "user_id", val: `'${user.id}'` })
      }
      if (columns.find((c: any) => c.column_name === "email")) {
        columnMappings.push({ col: "email", val: `'${email}'` })
      }
      if (columns.find((c: any) => c.column_name === "full_name")) {
        columnMappings.push({ col: "full_name", val: `'User'` })
      }
      if (columns.find((c: any) => c.column_name === "role")) {
        columnMappings.push({ col: "role", val: `'user'` })
      }

      if (columnMappings.length > 0) {
        sql += columnMappings.map((m) => m.col).join(", ")
        sql += `)\n`
        values += columnMappings.map((m) => m.val).join(", ")
        values += `);\n\n`

        sql += values

        // Add admin grant
        if (columns.find((c: any) => c.column_name === "role")) {
          sql += `-- Grant admin access\nUPDATE user_profiles SET role = 'admin' WHERE email = '${email}';`
        }

        results.recommendedSQL = sql
      }
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Schema inspection error:", error)
    return NextResponse.json(
      {
        error: "Failed to inspect schema",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
