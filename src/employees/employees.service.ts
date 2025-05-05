/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './schemas/employee.schema';
import { User } from '../users/schemas/user.schema';
import { Department } from '../departments/schemas/department.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { NotFoundException, ValidationException } from 'src/common/exceptions';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Department.name) private departmentModel: Model<Department>,
  ) {}

  /**
   * Crea un nuevo empleado
   * @param createEmployeeDto Datos del empleado a crear
   * @returns Empleado creado
   */
  async create(createEmployeeDto: CreateEmployeeDto) {
    // Verificar existencia del usuario y departamento
    const [user, department] = await Promise.all([
      this.userModel.findById(createEmployeeDto.user),
      this.departmentModel.findById(createEmployeeDto.department),
    ]);

    if (!user) throw new NotFoundException('Usuario');
    if (user.role !== 'employee')
      throw new ValidationException('El usuario debe tener rol employee');
    if (!department) throw new NotFoundException('Departamento');

    // Crear empleado
    const employee = await this.employeeModel.create(createEmployeeDto);

    // Actualizar referencia en User
    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { employee: employee._id },
    });

    return employee;
  }

  /**
   * Obtiene todos los empleados
   * @returns Lista de todos los empleados
   */
  async findAll(): Promise<Employee[]> {
    try {
      return await this.employeeModel.find().exec();
    } catch (error) {
      throw new Error(`Error al obtener empleados: ${error.message}`);
    }
  }

  /**
   * Obtiene un empleado por su ID
   * @param id ID del empleado
   * @returns Empleado encontrado
   * @throws NotFoundException si el empleado no existe
   */
  async findOne(id: string): Promise<Employee> {
    try {
      const employee = await this.employeeModel.findById(id).exec();
      if (!employee) {
        throw new Error(`Empleado con ID ${id} no encontrado`);
      }
      return employee;
    } catch (error) {
      throw new Error(`Error al buscar empleado: ${error.message}`);
    }
  }

  /**
   * Actualiza un empleado existente
   * @param id ID del empleado a actualizar
   * @param updateEmployeeDto Datos actualizados
   * @returns Empleado actualizado
   * @throws NotFoundException si el empleado no existe
   */
  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      const updatedEmployee = await this.employeeModel
        .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
        .exec();

      if (!updatedEmployee) {
        throw new Error(`Empleado con ID ${id} no encontrado`);
      }

      return updatedEmployee;
    } catch (error) {
      throw new Error(`Error al actualizar empleado: ${error.message}`);
    }
  }

  /**
   * Elimina un empleado
   * @param id ID del empleado a eliminar
   * @returns Empleado eliminado
   * @throws NotFoundException si el empleado no existe
   */
  async remove(id: string): Promise<Employee> {
    try {
      const deletedEmployee = await this.employeeModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedEmployee) {
        throw new Error(`Empleado con ID ${id} no encontrado`);
      }
      return deletedEmployee;
    } catch (error) {
      throw new Error(`Error al eliminar empleado: ${error.message}`);
    }
  }
}
