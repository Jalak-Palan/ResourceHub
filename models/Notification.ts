import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotificationDocument extends Document {
  userId: string;
  title: string;
  message: string;
  type: 'approved' | 'rejected' | 'reminder' | 'overdue' | 'system' | 'new_request';
  isRead: boolean;
  bookingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['approved', 'rejected', 'reminder', 'overdue', 'system', 'new_request'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
    bookingId: { type: String },
  },
  { timestamps: true }
);

export const NotificationModel: Model<INotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model<INotificationDocument>('Notification', NotificationSchema);
