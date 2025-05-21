import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createAdminClient } from '@/lib/supabase/admin';

// GET: Fetch all services for debugging
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/debug/services - Start");

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

    // Check RLS policies
    const { data: policies, error: policiesError } = await serviceRoleClient.rpc('get_policies');
    
    if (policiesError) {
      console.error("Error fetching policies:", policiesError);
    }

    // Filter policies for services table
    const servicesPolicies = policies?.filter(p => p.tablename === 'services') || [];

    return NextResponse.json({
      success: true,
      count: services?.length || 0,
      services,
      policies: servicesPolicies
    });
  } catch (error) {
    console.error("Error in debug services route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Test inserting a service
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/debug/services - Start");

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

    // Create a test service
    const testService = {
      title: "Test Service " + new Date().toISOString(),
      description: "This is a test service created via the debug API.",
      icon: "Shield",
      image: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the test service
    const { data: newService, error } = await serviceRoleClient
      .from("services")
      .insert(testService)
      .select()
      .single();

    if (error) {
      console.error("Error inserting test service:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test service created successfully",
      service: newService
    });
  } catch (error) {
    console.error("Error in debug services route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
