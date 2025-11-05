import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: AuthDto) {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findFirst({ where: { email } });

    if (!user) {
      throw new ForbiddenException('User not found.');
    }

    // compare password
    const passMatch = await argon.verify(user.hash, password);

    if (!passMatch) {
      throw new ForbiddenException('Incorrect password.');
    }

    const accessToken = await this.signToken(user.id, user.email);

    return { accessToken };
  }

  async signup(signupDto: AuthDto) {
    const { email, password } = signupDto;

    // check if same email exists
    const findUser = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (findUser) {
      throw new BadRequestException('Email already exists.');
    }
    const hash = await argon.hash(password);

    const user = await this.prismaService.user.create({
      data: {
        email,
        hash,
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const data = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(data, {
      expiresIn: '1h',
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
