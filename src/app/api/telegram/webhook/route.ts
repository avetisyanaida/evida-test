import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("📩 TELEGRAM UPDATE:", JSON.stringify(body, null, 2));


        if (!body.callback_query) {
            return NextResponse.json({ ok: true });
        }

        const callback = body.callback_query;

        console.log("🆔 CHAT ID FROM TG:", callback.message?.chat?.id);


        const chatId = callback.message?.chat?.id?.toString();
        if (chatId !== process.env.TELEGRAM_ADMIN_CHAT_ID) {
            return NextResponse.json({ ok: true });
        }

        const data = callback.data;
        if (!data || !data.includes(":")) {
            return NextResponse.json({ ok: true });
        }

        const [action, withdrawId] = data.split(":");

        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/withdraw-action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: withdrawId,
                status: action === "approve" ? "approved" : "rejected",
                comment: "Telegram action",
            }),
        });

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
