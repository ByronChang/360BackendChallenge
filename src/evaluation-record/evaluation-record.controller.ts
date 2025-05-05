import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EvaluationRecordService } from './evaluation-record.service';
import { CreateEvaluationRecordDto } from './dto/create-evaluation-record.dto';
import { EvaluationRecord } from './schemas/evaluation-record.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('EvaluationRecords')
@ApiBearerAuth('JWT-auth')
@Controller('evaluation-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationRecordController {
  constructor(private readonly recordService: EvaluationRecordService) {}

  @Post()
  @Roles('admin', 'manager', 'employee')
  @ApiOperation({ summary: 'Crear un registro de evaluación' })
  @ApiBody({
    type: CreateEvaluationRecordDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo creación',
        value: {
          evaluation: '507f1f77bcf86cd799439012',
          evaluatedUser: '507f1f77bcf86cd799439013',
          evaluator: '507ds54sdfa2dfd23er9e0sd',
          department: '508ve92iwsj48ae2s3ds3f8i',
          responses: [
            {
              competency: 'comunicación',
              responses: [4, 5, 4],
            },
            {
              competency: 'trabajo en equipo',
              responses: [5, 4, 4],
            },
          ],
          comments: 'Excelente desempeño en el equipo',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Registro de evaluación creado',
    type: EvaluationRecord,
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado o evaluación ya completada',
  })
  async create(@Body() createEvaluationRecordDto: CreateEvaluationRecordDto) {
    console.log(createEvaluationRecordDto);
    return this.recordService.create(createEvaluationRecordDto);
  }

  @Roles('admin', 'manager', 'employee')
  @Get('evaluation/:id')
  @ApiOperation({ summary: 'Obtener registros por evaluación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de la evaluación',
    type: [EvaluationRecord],
  })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async findByEvaluation(@Param('id') id: string) {
    return this.recordService.findByEvaluation(id);
  }

  @Roles('admin', 'manager', 'employee')
  @Get('department/:id')
  @ApiOperation({ summary: 'Obtener evaluaciones por departamento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones del departamento',
    type: [EvaluationRecord],
  })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async getDepartmentEvaluations(@Param('id') id: string) {
    return this.recordService.getDepartmentEvaluations(id);
  }
}
