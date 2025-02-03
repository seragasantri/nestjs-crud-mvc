import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { Category } from './category/entities/category.entity';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'127.0.0.1',
      port:5432,
      username:'postgres',
      password:'',
      database:'nestjs_latihan',
      entities:[User, Category],
      synchronize:true
    }),
    TypeOrmModule.forFeature([User, Category]),
    PostModule,
  ],
  controllers: [UserController, CategoryController],
  providers: [UserService, CategoryService],
})
export class AppModule {}
