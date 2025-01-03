export async function GET(req: Request) {
    const ip = req.headers.get('X-Forwarded-For')?.split(',')[0] || req.headers.get('x-client-ip')
    return new Response(ip)
}