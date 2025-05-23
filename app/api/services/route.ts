import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch services for public display
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/services - Start");

    // Get URL parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "6");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    
    // Create a Supabase client
    const supabase = createClient();
    
    // Fetch services with pagination
    const { data: services, error, count } = await supabase
      .from("services")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching services:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Format the services for the frontend
    const formattedServices = services.map(service => ({
      id: service.id,
      title: service.title,
      description: service.short_description || (service.description ? service.description.substring(0, 150) + "..." : ""),
      image: service.image || "/placeholder-service.jpg",
      slug: service.slug,
    }));

    // Create response with proper cache control headers
    const response = NextResponse.json({
      success: true,
      services: formattedServices,
      total: count || formattedServices.length,
      hasMore: count ? offset + limit < count : false
    });
    
    // Set cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
  } catch (error) {
    console.error("Error in services route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
