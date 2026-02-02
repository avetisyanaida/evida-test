import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        console.log("📨 TELEGRAM WEBHOOK HIT");

        const body = await req.json();
        console.log("📦 TELEGRAM BODY:", JSON.stringify(body));

        console.log("SITE_URL:", process.env.SITE_URL);

        console.log("SITE_URL:", process.env.SITE_URL);


        if (!body.callback_query) {
            return NextResponse.json({ ok: true });
        }

        const callback = body.callback_query;

        const chatId = callback.message?.chat?.id?.toString();
        if (chatId !== process.env.TELEGRAM_ADMIN_CHAT_ID) {
            return NextResponse.json({ ok: true });
        }

        const data = callback.data;
        if (!data || !data.includes(":")) {
            return NextResponse.json({ ok: true });
        }

        const [action, withdrawId] = data.split(":");

        console.log("➡️ TELEGRAM ACTION:", action, "WITHDRAW:", withdrawId);


       const res = await fetch(`${process.env.SITE_URL}/api/admin/withdraw-action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: withdrawId,
                status: action === "approve" ? "approved" : "rejected",
                comment: "Telegram action",
            }),
        });

        console.log("⬅️ ADMIN ACTION STATUS:", res.status);




        await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: callback.message.chat.id,
                    message_id: callback.message.message_id,
                    text:
                        action === "approve"
                            ? `✅ Հաստատված\n\n${callback.message.text}`
                            : `❌ Մերժված\n\n${callback.message.text}`,
                    reply_markup: { inline_keyboard: [] },
                }),
            }
        );

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("❌ TELEGRAM WEBHOOK ERROR:", err);
        return NextResponse.json({ ok: true });
    }
}
