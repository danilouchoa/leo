// app/api/health/route.ts (ou qualquer endpoint)
import clientPromise from '@/lib/db/mongodb';

export async function GET() {
  await clientPromise;
  return new Response('OK');
}
