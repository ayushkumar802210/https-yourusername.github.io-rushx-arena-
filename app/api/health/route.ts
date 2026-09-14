export async function GET() {
  return Response.json({
    ok: true,
    service: 'rushxarena',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}
