import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString({ message: 'Name harus berupa string' })
  @IsNotEmpty({ message: 'Name tidak boleh kosong' })
  name: string;

  @IsString({ message: 'Email harus berupa string' })
  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email?: string;
}
