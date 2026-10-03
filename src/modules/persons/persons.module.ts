import { Module } from '@nestjs/common';
import { PersonService } from './persons.service';
import { PersonsController } from './persons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './persons.entity';
import { UsersModule } from '../users/users.module';
import { PersonRepository } from './persons.repository';
import { jwtModule } from '../jwts/jwts.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), UsersModule, jwtModule, SessionsModule],
  providers: [PersonService, PersonRepository],
  controllers: [PersonsController],
  exports: [PersonService, PersonRepository]
})
export class PersonsModule {}
