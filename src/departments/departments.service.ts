import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { User } from '../users/schemas/user.schema';
import { UserResponse } from 'src/users/schemas/user-response.schema';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(User.name) private userModel: Model<UserResponse>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const manager = await this.userModel.findById(createDepartmentDto.manager);
    if (!manager || manager.role !== 'manager') {
      throw new Error(
        'El manager asignado no existe o no tiene el rol adecuado',
      );
    }

    const created = new this.departmentModel(createDepartmentDto);
    return created.save();
  }

  async findAll(onlyActive = true): Promise<Department[]> {
    const filter = onlyActive ? { isActive: true } : {};
    return this.departmentModel.find(filter).populate('manager').exec();
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentModel
      .findById(id)
      .populate('manager', 'email role')
      .exec();

    if (!department) {
      throw new Error(`Department with id ${id} not found`);
    }

    return department;
  }

  async update(
    id: string,
    updateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    if (updateDto.manager) {
      const manager = await this.userModel.findById(updateDto.manager);
      if (!manager || manager.role !== 'manager') {
        throw new Error('Manager inválido');
      }
    }
    const updatedDepartment = await this.departmentModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('manager')
      .exec();

    if (!updatedDepartment) {
      throw new Error(`Department with id ${id} not found`);
    }
    return updatedDepartment;
  }
}
