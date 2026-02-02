// app/api/admin/withdraw-action/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/hooks/supabaseAdmin";

export async function POST(req: Request) {
    try {
        const { id, status, comment } = await req.json();

        console.log("🔥 ADMIN REJECT / APPROVE HIT 🔥", status, id);


        const { data: withdraw } = await supabaseAdmin
            .from("withdraw_requests")
            .select("*")
            .eq("id", id)
            .single();

        if (!withdraw || withdraw.status !== "pending") {
            return NextResponse.json({ ok: false });
        }

        // ❌ APPROVE → balance չի փոխվում
        if (status === "rejected") {
            // ✅ refund
            await supabaseAdmin.rpc("increment_balance", {
                p_user_id: withdraw.user_id,
                p_amount: withdraw.amount,
            });
        }

        // update withdraw
        await supabaseAdmin
            .from("withdraw_requests")
            .update({
                status,
                admin_comment: comment ?? null,
            })
            .eq("id", id);

        // update transaction
        await supabaseAdmin
            .from("transactions")
            .update({
                status,
                admin_comment: comment ?? null,
            })
            .eq("reference_id", withdraw.id);

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("ADMIN WITHDRAW ERROR", err);
        return NextResponse.json({ ok: false });
    }
}
