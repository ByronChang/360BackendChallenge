import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Departments')
@ApiBearerAuth('JWT-auth')
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo departamento',
    description: '[Solo ADMIN] Crea un nuevo departamento asignando un manager',
  })
  @ApiBody({
    type: CreateDepartmentDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo creación',
        value: {
          name: 'Desarrollo Frontend',
          manager: '507f1f77bcf86cd799439011',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Departamento creado exitosamente',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        name: 'Desarrollo Frontend',
        manager: {
          _id: '507f1f77bcf86cd799439011',
          email: 'manager@empresa.com',
          role: 'manager',
        },
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    schema: {
      example: {
        message: 'Validation failed',
        details: [
          'name must be a string',
          'manager must be a valid MongoDB ID',
        ],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado (requiere rol admin)',
  })
  @Roles('admin')
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar departamentos',
    description: 'Obtiene todos los departamentos con sus managers',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de departamentos',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Desarrollo Frontend',
          manager: {
            _id: '507f1f77bcf86cd799439011',
            email: 'manager@empresa.com',
          },
          isActive: true,
        },
      ],
    },
  })
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener departamento por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del departamento',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 200,
    description: 'Departamento encontrado',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        name: 'Desarrollo Frontend',
        manager: {
          _id: '507f1f77bcf86cd799439011',
          email: 'manager@empresa.com',
          role: 'manager',
        },
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Departamento no encontrado',
    schema: {
      example: {
        message: 'Department not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Actualizar departamento',
    description: '[Solo ADMIN] Actualiza un departamento existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del departamento a actualizar',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiBody({
    type: UpdateDepartmentDto,
    examples: {
      ejemplo1: {
        summary: 'Actualizar nombre',
        value: {
          name: 'Desarrollo Frontend Avanzado',
        },
      },
      ejemplo2: {
        summary: 'Cambiar manager',
        value: {
          manager: '5f8d04b3ab35de3b342bcd22',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Departamento actualizado',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        name: 'Desarrollo Frontend Avanzado',
        manager: {
          _id: '5f8d04b3ab35de3b342bcd22',
          email: 'nuevo.manager@empresa.com',
        },
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Departamento no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }
}
