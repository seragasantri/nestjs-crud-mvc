import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { time } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto): Promise<User> {
    const validate = this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (validate) {
      throw new BadRequestException('Email is already in use');
    }
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    if (updateUserDto.email) {
      // Cari pengguna dengan email yang baru
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      // Cek jika email sudah digunakan oleh pengguna lain dan id-nya tidak sama
      if (existingUser && existingUser.id !== Number(id)) {
        console.log('Email ditemukan dan ID tidak cocok:', existingUser.id, id);
        throw new BadRequestException(
          'Email is already in use by another user',
        );
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
