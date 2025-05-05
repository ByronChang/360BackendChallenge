import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evaluation } from './schemas/evaluation.schema';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { EvaluationRecord } from '../evaluation-record/schemas/evaluation-record.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { NotFoundException } from 'src/common/exceptions/not-found/not-found.exception';
import { ValidationException } from 'src/common/exceptions/validation/validation.exception';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name) private evaluationModel: Model<Evaluation>,
    @InjectModel(EvaluationRecord.name)
    private recordModel: Model<EvaluationRecord>,
    @InjectModel(Department.name) private departmentModel: Model<Department>,
  ) {}

  async create(createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
    const department = await this.departmentModel
      .findById(createEvaluationDto.department)
      .exec();
    if (!department) {
      throw new NotFoundException('Departamento no encontrado');
    }

    for (const competency of createEvaluationDto.competencies) {
      if (competency.questions.length < 3 || competency.questions.length > 5) {
        throw new ValidationException(
          'Cada competencia debe tener entre 3 y 5 preguntas',
        );
      }
    }

    if (
      !['self', 'peer', 'manager'].includes(createEvaluationDto.evaluationType)
    ) {
      throw new ValidationException('Tipo de evaluación inválido');
    }

    const createdEvaluation = new this.evaluationModel(createEvaluationDto);
    return createdEvaluation.save();
  }

  async findAll(): Promise<Evaluation[]> {
    try {
      return this.evaluationModel.find().exec();
    } catch (error) {
      throw new Error(`Error al obtener las evaluaciones: ${error}`);
    }
  }

  async findOne(id: string): Promise<Evaluation> {
    try {
      const evaluation = await this.evaluationModel.findById(id).exec();
      if (!evaluation) {
        throw new Error(`Evaluación con ID ${id} no encontrada`);
      }
      return evaluation;
    } catch (error) {
      throw new Error(`Error al buscar evaluacion: ${error}`);
    }
  }

  async update(
    id: string,
    updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<Evaluation> {
    try {
      const updatedEvaluation = await this.evaluationModel
        .findByIdAndUpdate(id, updateEvaluationDto, { new: true })
        .exec();

      if (!updatedEvaluation) {
        throw new Error(`Evaluación con ID ${id} no encontrada`);
      }

      return updatedEvaluation;
    } catch (error) {
      throw new Error(`Error al actualizar evaluación: ${error}`);
    }
  }

  async findByDepartment(departmentId: string): Promise<Evaluation[]> {
    try {
      const evaluation = await this.evaluationModel
        .find({ department: departmentId })
        .exec();
      if (!evaluation) {
        throw new Error(
          `Evaluación con ID de departamento: ${departmentId}, no encontrada`,
        );
      }
      return evaluation;
    } catch (error) {
      throw new Error(`Error al buscar evaluación: ${error}`);
    }
  }

  async findByEmployee(employeeId: string): Promise<EvaluationRecord[]> {
    try {
      const evaluation = await this.recordModel
        .find({ evaluatedUser: employeeId })
        .exec();
      if (!evaluation) {
        throw new Error(
          `Evaluación con ID de empleado: ${employeeId}, no encontrada`,
        );
      }
      return evaluation;
    } catch (error) {
      throw new Error(`Error al buscar evaluación: ${error}`);
    }
  }
}
