import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
    console.log("🚨 AUTH CALLBACK HIT", req.url);

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const type = url.searchParams.get("type");

    const supabase = createRouteHandlerClient({ cookies });

    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
    }

    if (type === "recovery") {
        return NextResponse.redirect("/reset" + url.search);
    }

    return NextResponse.redirect("/");
}


