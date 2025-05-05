import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class EvaluationRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Evaluation', required: true })
  evaluation: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  evaluatedUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  evaluator: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;

  @Prop({
    type: [
      {
        competency: { type: String, required: true },
        responses: { type: [Number], required: true },
        average: { type: Number, required: true },
      },
    ],
    required: true,
  })
  results: {
    competency: string;
    responses: number[];
    average: number;
  }[];

  @Prop({ type: Number, required: false })
  overallAverage: number;

  @Prop({ type: String, default: '' })
  comments: string;

  @Prop({ type: Boolean, default: false })
  completed: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EvaluationRecordSchema =
  SchemaFactory.createForClass(EvaluationRecord);
