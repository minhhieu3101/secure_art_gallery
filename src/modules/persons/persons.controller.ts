import { Body, Controller, Post } from '@nestjs/common';
import { PersonService } from './persons.service';
import { CreatePersonDto } from './dto/createPerson.dto';

@Controller('persons')
export class PersonsController {
    constructor(private readonly personService: PersonService){}

    @Post('createPerson')
    async createPerson(@Body() person: CreatePersonDto): Promise<any> {
        return await this.personService.createPerson(person.name, person.email);
    }
}
