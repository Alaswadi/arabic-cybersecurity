import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createAdminClient } from '@/lib/supabase/admin';

// GET: Fetch all services
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/services - Start");

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

    // Fetch all services
    const { data: services, error } = await serviceRoleClient
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      services
    });
  } catch (error) {
    console.error("Error in services route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new service
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/admin/services - Start");

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

    // Parse the request body
    const serviceData = await request.json();
    console.log("Service data:", serviceData);

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

    // Insert the service
    const { data: newService, error } = await serviceRoleClient
      .from("services")
      .insert({
        title: serviceData.title,
        description: serviceData.description,
        icon: serviceData.icon || "Shield",
        image: serviceData.image || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting service:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      service: newService
    });
  } catch (error) {
    console.error("Error in services route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Update a service
export async function PATCH(request: NextRequest) {
  try {
    console.log("PATCH /api/admin/services - Start");

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

    // Parse the request body
    const serviceData = await request.json();
    console.log("Service update data:", serviceData);

    if (!serviceData.id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
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

    // Update the service
    const { data: updatedService, error } = await serviceRoleClient
      .from("services")
      .update({
        title: serviceData.title,
        description: serviceData.description,
        icon: serviceData.icon || "Shield",
        image: serviceData.image || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serviceData.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating service:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      service: updatedService
    });
  } catch (error) {
    console.error("Error in services route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
