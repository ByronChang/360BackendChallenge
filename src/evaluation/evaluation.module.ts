import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { Evaluation, EvaluationSchema } from './schemas/evaluation.schema';
import {
  EvaluationRecord,
  EvaluationRecordSchema,
} from '../evaluation-record/schemas/evaluation-record.schema';
import { EvaluationRecordController } from '../evaluation-record/evaluation-record.controller';
import { EvaluationRecordService } from '../evaluation-record/evaluation-record.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import {
  Department,
  DepartmentSchema,
} from 'src/departments/schemas/department.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  Employee,
  EmployeeSchema,
} from 'src/employees/schemas/employee.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
      { name: EvaluationRecord.name, schema: EvaluationRecordSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: User.name, schema: UserSchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    UsersModule,
  ],
  controllers: [EvaluationController, EvaluationRecordController],
  providers: [EvaluationService, EvaluationRecordService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
