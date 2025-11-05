import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  // we use private configSerice then we cannt use this.configservice inside super()
  // if we have to that variable elsewhere we can use private
  constructor(
    configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') ?? '',
    };

    super(options);
  }

  async validate(payload: any) {
    const user = await this.prismaService.user.findFirst({
      where: { id: payload.sub },
    });

    if (!user) return null;
    return payload;
  }
}
