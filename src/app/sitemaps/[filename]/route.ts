import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Read the sitemap file from public/sitemaps directory
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemaps', filename);
    
    if (!fs.existsSync(sitemapPath)) {
      return new NextResponse('Sitemap not found', { status: 404 });
    }
    
    const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
    
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new NextResponse('Sitemap not found', { status: 404 });
  }
}
