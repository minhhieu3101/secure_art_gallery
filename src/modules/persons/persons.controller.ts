import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PersonService } from './persons.service';
import { CreatePersonDto } from './dto/createPerson.dto';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../../commons/enum/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('persons')
export class PersonsController {
    constructor(private readonly personService: PersonService){}

    @Post('person/createPerson')
    async createPerson(@Body() person: CreatePersonDto): Promise<any> {
        try {
            return await this.personService.createPerson(person.name, person.email);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Get('person/:id')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'personId',
        format: 'uuid',
        type: 'string',
    })
    @ApiBearerAuth()
    async getPerson(@Param() id: string): Promise<any> {
        try {
            return await this.personService.getPerson(id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Get('person')
    @Roles(Role.admin, Role.employee)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    async getAllPerson(): Promise<any> {
        try {
            return await this.personService.getAllPerson();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
