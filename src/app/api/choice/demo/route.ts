export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";

function formatTime(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function buildDataString(data: {
    gameMode: string;
    gameId: string;
    lang: string;
    playerId: string;
    country: string;
    ip: string;
}) {
    return JSON.stringify({
        gameMode: data.gameMode,
        gameId: data.gameId,
        lang: data.lang,
        playerId: data.playerId,
        country: data.country,
        ip: data.ip,
    });
}

export async function POST() {
    const privateKey = process.env.CHOICE_PRIVATE_KEY;

    if (!privateKey) {
        return NextResponse.json(
            { error: "CHOICE_PRIVATE_KEY missing" },
            { status: 500 }
        );
    }

    const time = formatTime(new Date());

    const data = {
        gameMode: "fun",
        gameId: "1",
        lang: "en",
        playerId: "demo_user_1",
        country: "AM",
        ip: "127.0.0.1",
    };

    const dataString = buildDataString(data);

    const hash = crypto
        .createHash("sha256")
        .update(privateKey + time + dataString)
        .digest("hex");

    const response = await fetch("https://stg.otkgaming.com/serviceApi.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            action: "getLauncherURL",
            platform: 8,
            partnerId: 1,
            time,
            hash,
            data,
        }),
        cache: "no-store",
    });

    const json = await response.json();
    return NextResponse.json(json);
}
