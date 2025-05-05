import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Employee } from 'src/employees/schemas/employee.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false,
  })
  employee?: Employee;

  @Prop({ enum: ['admin', 'manager', 'employee'], default: 'employee' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
