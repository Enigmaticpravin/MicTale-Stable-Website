import { NextResponse } from "next/server";
import { createRouteSupabase } from "@/app/lib/supabase/server-route";

export async function POST(req) {
  try {

    const body = await req.json();

    const { feedback } = body;

    const supabase = await createRouteSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("feedbacks")
      .insert({
        feedback,
        user_id: user?.id || null,
        user_name:
          user?.user_metadata?.full_name ||
          user?.email ||
          "Anonymous",
      })
      .select();


    if (error) {


      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack:
          process.env.NODE_ENV === "development"
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}