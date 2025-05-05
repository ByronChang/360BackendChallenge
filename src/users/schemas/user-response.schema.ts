import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Employee } from 'src/employees/schemas/employee.schema';

@Schema()
export class UserResponse extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false,
  })
  employee?: Employee;

  @Prop({ enum: ['admin', 'manager', 'employee'], default: 'employee' })
  role: string;
}

export const UserResponseSchema = SchemaFactory.createForClass(UserResponse);
