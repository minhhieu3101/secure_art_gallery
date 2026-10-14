import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './rooms.entity';
import { RoomRepository } from './rooms.repository';
import { jwtModule } from '../jwts/jwts.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { AuditModule } from '../audit/audit.module';

@Module({
    imports: [TypeOrmModule.forFeature([Room]), jwtModule, UsersModule, SessionsModule, AuditModule],
    controllers: [RoomsController],
    providers: [RoomService, RoomRepository],
    exports: [RoomService, RoomRepository],
})
export class RoomsModule {}
