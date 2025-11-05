import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: AuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  signup(@Body() signupDto: AuthDto) {
    return this.authService.signup(signupDto);
  }
}
