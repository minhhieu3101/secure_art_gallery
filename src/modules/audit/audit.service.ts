import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

const auditCpp = require(path.resolve(process.cwd(), 'src/cpp_core/build/audit.node'));

@Injectable()
export class AuditService {
    constructor(private configService: ConfigService) {}

    async appendLog(userId: string, action: string) {
        const connectionString = this.configService.get<string>('DATABASE_URL');

        return auditCpp.appendLog(connectionString, userId, action);
    }

    async readLog(userId: string) {
        const connectionString = this.configService.get<string>('DATABASE_URL');

        return auditCpp.readLog(connectionString, userId);
    }

    async readAllLogs() {
        const connectionString = this.configService.get<string>('DATABASE_URL');
        return auditCpp.readAllLogs(connectionString);
    }
}
