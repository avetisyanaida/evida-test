export async function GET(req: Request) {
    console.log("🚨 CALLBACK HIT", req.url);
    return new Response("STOP CALLBACK");
}
