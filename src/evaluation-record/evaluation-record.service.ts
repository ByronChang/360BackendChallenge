import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EvaluationRecord } from './schemas/evaluation-record.schema';
import { CreateEvaluationRecordDto } from './dto/create-evaluation-record.dto';
import { Evaluation } from '../evaluation/schemas/evaluation.schema';
import { User } from '../users/schemas/user.schema';
import { Employee } from 'src/employees/schemas/employee.schema';

@Injectable()
export class EvaluationRecordService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(EvaluationRecord.name)
    private recordModel: Model<EvaluationRecord>,
    @InjectModel(Evaluation.name) private evaluationModel: Model<Evaluation>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(
    createEvaluationRecordDto: CreateEvaluationRecordDto,
  ): Promise<EvaluationRecord> {
    const evaluation = await this.evaluationModel
      .findById(createEvaluationRecordDto.evaluation)
      .exec();
    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }

    if (!evaluation.published) {
      throw new ForbiddenException('Esta evaluación no está publicada');
    }

    const evaluatedUser = await this.userModel
      .findById(createEvaluationRecordDto.evaluatedUser)
      .exec();
    if (!evaluatedUser) {
      throw new NotFoundException('Usuario evaluado no encontrado');
    }

    const existingRecord = await this.recordModel.findOne({
      evaluation: evaluation._id,
      evaluatedUser: evaluatedUser._id,
    });

    if (existingRecord) {
      throw new ForbiddenException('Ya has completado esta evaluación');
    }

    const results = createEvaluationRecordDto.responses.map((response) => {
      const sum = response.responses.reduce((a, b) => a + b, 0);
      const average = sum / response.responses.length;
      return {
        competency: response.competency,
        responses: response.responses,
        average: parseFloat(average.toFixed(2)),
      };
    });

    const overallAverage =
      results.reduce((sum, result) => sum + result.average, 0) / results.length;

    const createdRecord = new this.recordModel({
      evaluation: evaluation._id,
      evaluatedUser: evaluatedUser._id,
      evaluator: createEvaluationRecordDto.evaluator,
      department: evaluation.department,
      results,
      overallAverage: parseFloat(overallAverage.toFixed(2)),
      comments: createEvaluationRecordDto.comments || '',
      completed: true,
    });

    return createdRecord.save();
  }

  async findByEvaluation(evaluationId: string): Promise<EvaluationRecord[]> {
    const evaluation = await this.evaluationModel.findById(evaluationId).exec();
    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    const evalRecord = await this.recordModel
      .find({ evaluation: evaluation._id })
      .exec();

    return evalRecord;
  }

  async getDepartmentEvaluations(
    departmentId: string,
  ): Promise<EvaluationRecord[]> {
    return this.recordModel.find({ department: departmentId }).exec();
  }
}
