import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
//import { User } from '../../users/schemas/user.schema';
import { UserResponse } from 'src/users/schemas/user-response.schema';

@Schema({ timestamps: true })
export class Department extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  manager: UserResponse;

  @Prop({ default: true })
  isActive: boolean;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
