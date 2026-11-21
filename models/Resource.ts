import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResourceDocument extends Document {
  name: string;
  description: string;
  category: string;
  image: string;
  specifications: string[];
  totalQuantity: number;
  availableQuantity: number;
  location: string;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResourceDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Laptops', 'Projectors', 'Cameras', 'Lab Equip.', 'Meeting Rooms', 'Others'],
    },
    image: { type: String, required: true },
    specifications: [{ type: String }],
    totalQuantity: { type: Number, required: true, default: 1 },
    availableQuantity: { type: Number, required: true, default: 1 },
    location: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ResourceModel: Model<IResourceDocument> =
  mongoose.models.Resource || mongoose.model<IResourceDocument>('Resource', ResourceSchema);
