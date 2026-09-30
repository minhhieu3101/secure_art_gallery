import { Injectable } from '@nestjs/common';
import { PersonRepository } from './persons.repository';
import { UserService } from '../users/users.service';

@Injectable()
export class PersonService {
    constructor(
        private readonly personRepository: PersonRepository,
        private readonly userService: UserService,
    ) {}

    async createPerson(name: string, email: string) {
        const user = await this.userService.getbyEmail(email)
        if (user) {
            return await this.personRepository.save({
                name: name,
                email: email,
                user: user,
            });
        } else {
            return await this.personRepository.save({
                name: name,
                email: email
            });
        }
    }

    async getPerson(id: string) {
        return await this.personRepository.getById(id);
    }
}
