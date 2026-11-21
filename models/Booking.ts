import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookingDocument extends Document {
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole?: string;
  resourceId: string;
  resourceName: string;
  resourceImage: string;
  resourceCategory: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  issueDate?: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  isOverdue?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userRole: { type: String, default: 'student' },
    resourceId: { type: String, required: true },
    resourceName: { type: String, required: true },
    resourceImage: { type: String, required: true },
    resourceCategory: { type: String, required: true },
    bookingDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    purpose: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    issueDate: { type: String },
    expectedReturnDate: { type: String },
    actualReturnDate: { type: String },
    isOverdue: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BookingModel: Model<IBookingDocument> =
  mongoose.models.Booking || mongoose.model<IBookingDocument>('Booking', BookingSchema);
