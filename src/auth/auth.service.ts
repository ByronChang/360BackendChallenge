import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import {
  ConflictException,
  UnauthorizedException,
} from 'src/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role: string) {
    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword, role });
    await user.save();
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }
}
