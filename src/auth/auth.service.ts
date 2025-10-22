import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  login() {
    return { status: true, msg: 'Login successfull' };
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
}
