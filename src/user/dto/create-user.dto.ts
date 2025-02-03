import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString({ message: 'Name harus berupa string' })
    @IsNotEmpty({ message: 'Name tidak boleh kosong' })
    name: string;

    @IsString({message: 'Email harus berupa string'})
    @IsEmail({},{message: 'Email tidak valid'})
    @IsNotEmpty({ message: 'Email tidak boleh kosong' })
    email: string;
}
