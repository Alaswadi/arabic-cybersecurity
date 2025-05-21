import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createAdminClient } from '@/lib/supabase/admin';

// GET: Fetch a specific service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("GET /api/admin/services/[id] - Start");
    console.log("Service ID:", params.id);

    // Check authentication
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ 
      cookies: () => cookieStore 
    });
    
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create a service role client to bypass RLS
    let serviceRoleClient;
    try {
      serviceRoleClient = createAdminClient();
      console.log("Successfully created service role client");
    } catch (error) {
      console.error("Error creating service role client:", error);
      
      // Fallback to regular client
      serviceRoleClient = createClient();
      console.log("Falling back to regular client");
    }

    // Fetch the service
    const { data: service, error } = await serviceRoleClient
      .from("services")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching service:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service
    });
  } catch (error) {
    console.error("Error in services route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a service by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("DELETE /api/admin/services/[id] - Start");
    console.log("Service ID to delete:", params.id);

    // Check authentication
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ 
      cookies: () => cookieStore 
    });
    
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create a service role client to bypass RLS
    let serviceRoleClient;
    try {
      serviceRoleClient = createAdminClient();
      console.log("Successfully created service role client");
    } catch (error) {
      console.error("Error creating service role client:", error);
      
      // Fallback to regular client
      serviceRoleClient = createClient();
      console.log("Falling back to regular client");
    }

    // Delete the service
    const { error } = await serviceRoleClient
      .from("services")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting service:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error) {
    console.error("Error in services route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
