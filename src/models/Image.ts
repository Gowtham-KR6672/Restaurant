import { Schema, Document, Model } from 'mongoose';
import { getDb } from '@/lib/db';

export interface IImage extends Document {
  filename: string;
  data: Buffer;
  contentType: string;
}

const ImageSchema = new Schema<IImage>({
  filename: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true }
}, { timestamps: true });

const imageDb1 = getDb('images1');
export const ImageNode1: Model<IImage> = imageDb1.models.Image || imageDb1.model<IImage>('Image', ImageSchema);

const imageDb2 = getDb('images2');
export const ImageNode2: Model<IImage> = imageDb2.models.Image || imageDb2.model<IImage>('Image', ImageSchema);

const imageDb3 = getDb('images3');
export const ImageNode3: Model<IImage> = imageDb3.models.Image || imageDb3.model<IImage>('Image', ImageSchema);
