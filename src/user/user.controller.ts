import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ResponseDto } from 'src/interface/response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<User>> {
    try {
      const dtoInstance = plainToInstance(CreateUserDto, createUserDto);

      await validateOrReject(dtoInstance);
      const user = await this.userService.create(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: error.message || error,
      });
    }
  }

  @Get()
  async findAll(): Promise<ResponseDto<User[]>> {
    try {
      const users = await this.userService.findAll();
      if (!users) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Users found successfully',
        data: users,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: error.message || error,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseDto<User>> {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'User found successfully',
        data: user,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: error.message || error,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<User>> {
    try {
      const dtoInstance = plainToInstance(UpdateUserDto, updateUserDto);
      await validateOrReject(dtoInstance);
      const data = await this.userService.update(id, dtoInstance);
      delete data.id; // Menghapus properti id
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: data,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: error.message || error,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const user = await this.userService.findOne(id);

      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }

      await this.userService.remove(id);

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
  }
}
