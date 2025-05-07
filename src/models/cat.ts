import { Schema, model, Document, models } from 'mongoose';

export interface ICat {
  // Template properties (from dummyCats)
  avatar: string;
  name: string;
  description?: string;
  // Dynamic properties
  happiness: number;
  hunger: number;
  owned: boolean;
  // Additional properties from Landing.tsx
  x: string;
  y: string;
  type: number;
  taskState: number;
  userId: string;
}

export interface ICatDocument extends ICat, Document {}

const catSchema = new Schema<ICatDocument>({
  // Template properties are not stored in DB
  avatar: { type: String, required: true, select: false },
  name: { type: String, required: true, select: false },
  description: { type: String, select: false },
  // Dynamic properties
  happiness: { type: Number, required: true, default: 0.5 },
  hunger: { type: Number, required: true, default: 0.5 },
  owned: { type: Boolean, required: true, default: false },
  x: { type: String, required: true },
  y: { type: String, required: true },
  type: { type: Number, required: true },
  taskState: { type: Number, required: true },
  userId: { type: String, required: true }
});

// Prevent model recompilation error
export const Cat = models.Cat || model<ICatDocument>('Cat', catSchema); 