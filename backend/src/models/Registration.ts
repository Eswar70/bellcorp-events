import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistration extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  registrationDate: Date;
}

const registrationSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    registrationDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model<IRegistration>('Registration', registrationSchema);
