import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { jwtModule } from '../jwts/jwts.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';

@Module({
    providers: [AuditService],
    exports: [AuditService],
})
export class AuditModule {}
