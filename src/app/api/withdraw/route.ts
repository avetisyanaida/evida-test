// app/api/withdraw/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/hooks/supabaseAdmin";

export async function POST(req: Request) {
    try {
        const { user_id, amount, method, card_id } = await req.json();
        const parsedAmount = Number(amount);

        if (!user_id || !parsedAmount || parsedAmount <= 0 || !method) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // 1️⃣ balance check
        const { data: user } = await supabaseAdmin
            .from("users")
            .select("balance")
            .eq("user_id", user_id)
            .single();

        if (!user || Number(user.balance) < parsedAmount) {
            return NextResponse.json(
                { error: "Insufficient balance" },
                { status: 400 }
            );
        }

        // 2️⃣ 🔥 balance ↓ (ՀԻՄԱ)
        await supabaseAdmin.rpc("decrement_balance", {
            p_user_id: user_id,
            p_amount: parsedAmount,
        });

        // 3️⃣ withdraw request
        const { data: withdraw } = await supabaseAdmin
            .from("withdraw_requests")
            .insert({
                user_id,
                amount: parsedAmount,
                method,
                card_id: method === "card" ? card_id : null,
                status: "pending",
            })
            .select()
            .single();

        // 4️⃣ transaction
        await supabaseAdmin.from("transactions").insert({
            user_id,
            type: "withdraw",
            amount: parsedAmount,
            status: "pending",
            method,
            reference_id: withdraw.id,
        });

        return NextResponse.json({ success: true, withdrawId: withdraw.id });
    } catch (err) {
        console.error("WITHDRAW ERROR:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
