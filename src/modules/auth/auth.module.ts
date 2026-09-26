import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { jwtModule } from '../jwts/jwts.module';
import { ConfigModule } from '@nestjs/config';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [UsersModule, jwtModule, ConfigModule, SessionsModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
