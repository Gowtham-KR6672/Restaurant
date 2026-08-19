import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ImageNode1, ImageNode2, ImageNode3 } from '@/models/Image';

export async function GET(req: Request, { params }: { params: Promise<{ node: string, id: string }> }) {
  try {
    await dbConnect();
    const { node, id } = await params;
    
    let ImageModel;
    if (node === '1') ImageModel = ImageNode1;
    else if (node === '2') ImageModel = ImageNode2;
    else if (node === '3') ImageModel = ImageNode3;
    else return new NextResponse('Invalid node', { status: 400 });
    
    const image = await ImageModel.findById(id);
    if (!image) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    return new NextResponse(image.data, {
      status: 200,
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
