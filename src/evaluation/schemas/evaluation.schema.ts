import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Evaluation extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;

  @Prop({
    type: [
      {
        competency: { type: String, required: true },
        questions: { type: [String], required: true },
      },
    ],
    required: true,
    validate: {
      validator: (competencies: any[]) => competencies.length > 0,
      message: 'Debe haber al menos una competencia',
    },
  })
  competencies: {
    competency: string;
    questions: string[];
  }[];

  @Prop({ type: Boolean, default: false })
  published: boolean;

  @Prop({ type: Date, default: null })
  dueDate: Date | null;

  @Prop({ type: String, enum: ['self', 'peer', 'manager'], required: true })
  evaluationType: string;

  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // createdBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);
