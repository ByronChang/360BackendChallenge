import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Department } from '../../departments/schemas/department.schema';

@Schema()
export class Employee extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  })
  department: Department;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: User;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true, default: false })
  isRemote: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
