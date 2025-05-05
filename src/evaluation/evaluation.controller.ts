import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { Evaluation } from './schemas/evaluation.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Evaluations')
@ApiBearerAuth('JWT-auth')
@Controller('evaluations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({
    summary: 'Crear una nueva evaluación',
    description: '[Solo ADMIN y MANAGER]',
  })
  @ApiBody({
    type: CreateEvaluationDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo creación',
        value: {
          name: 'Evaluación de desempeño Q1 2023',
          department: '507f1f77bcf86cd799439011',
          evaluationType: 'peer',
          competencies: [
            {
              competency: 'COMMUNICATION',
              questions: [
                'Se expresa claramente en reuniones',
                'Escucha activamente a sus compañeros',
              ],
            },
            {
              competency: 'TEAMWORK',
              questions: [
                'Colabora efectivamente con su equipo',
                'Contribuye a un ambiente de trabajo positivo',
              ],
            },
          ],
          dueDate: '2023-06-30T23:59:59.999Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada exitosamente',
    type: Evaluation,
  })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async create(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationService.create(createEvaluationDto);
  }

  @Get()
  @Roles('admin', 'manager', 'employee')
  @ApiOperation({ summary: 'Obtener todas las evaluaciones (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones',
    type: [Evaluation],
  })
  async findAll() {
    return this.evaluationService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Obtener detalles de una evaluación' })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la evaluación',
    type: Evaluation,
  })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async findOne(@Param('id') id: string) {
    return this.evaluationService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Actualizar una evaluación' })
  @ApiResponse({
    status: 200,
    description: 'Evaluación actualizada',
    type: Evaluation,
  })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  @ApiResponse({
    status: 403,
    description: 'No autorizado o evaluación con respuestas',
  })
  async update(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ) {
    return this.evaluationService.update(id, updateEvaluationDto);
  }

  @Get('department/:id')
  @Roles('admin', 'manager', 'employee')
  @ApiOperation({ summary: 'Obtener evaluaciones por departamento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones del departamento',
    type: [Evaluation],
  })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  async findByDepartment(@Param('id') id: string) {
    return this.evaluationService.findByDepartment(id);
  }
}
