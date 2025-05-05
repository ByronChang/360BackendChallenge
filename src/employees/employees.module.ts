import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  Department,
  DepartmentSchema,
} from '../departments/schemas/department.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService], // Para usar el servicio en otros módulos
})
export class EmployeesModule {}
