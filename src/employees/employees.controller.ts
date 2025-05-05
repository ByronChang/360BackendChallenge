import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo empleado',
    description: 'Registra un nuevo empleado en el sistema',
  })
  @ApiBody({
    type: CreateEmployeeDto,
    examples: {
      ejemplo1: {
        value: {
          name: 'Ana López',
          department: 'Desarrollo',
          user: 's89eikdas8e8asijdfi2se...',
          position: 'Frontend Developer',
          isRemote: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Empleado creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @Roles('admin', 'manager')
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar empleado',
    description: 'Actualiza empleado en el sistema',
  })
  @ApiBody({
    type: UpdateEmployeeDto,
    examples: {
      ejemplo1: {
        value: {
          name: 'Ana López',
          department: 'Desarrollo',
          user: 's89eikdas8e8asijdfi2se...',
          position: 'Frontend Developer',
          isRemote: true,
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID del empleado' })
  @ApiResponse({ status: 200, description: 'Empleado actualizado' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  @Roles('admin', 'manager')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }
}
