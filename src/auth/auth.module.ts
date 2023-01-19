import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [forwardRef(() => UsersModule), PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret, signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy,JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {
}
