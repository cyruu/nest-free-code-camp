import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Getuser } from 'src/auth/decorator';
import { JWTGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(JWTGuard)
  @Get('me')
  getMe() {
    return 'mee';
  }
}
