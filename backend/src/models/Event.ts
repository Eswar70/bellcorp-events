import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  organizer: string;
  location: string;
  date: Date;
  description: string;
  capacity: number;
  availableSeats: number;
  tags: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    organizer: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    tags: [{ type: String }],
    image: { type: String, default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000' },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
eventSchema.index({ name: 'text', description: 'text', location: 'text' });

export default mongoose.model<IEvent>('Event', eventSchema);
