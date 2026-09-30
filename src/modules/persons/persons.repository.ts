import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from '../../utils/database.utils';
import { Repository } from 'typeorm';
import { Person } from './persons.entity';

@Injectable()
export class PersonRepository extends RepositoryUtils<Person> {
    constructor(@InjectRepository(Person) private PersonRepository: Repository<Person>) {
        super(PersonRepository);
    }
}