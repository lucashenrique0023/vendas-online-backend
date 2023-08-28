import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdateUserPasswordDto } from './dtos/update-pasword.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from './enum/userType.enum';
import { UserId } from 'src/decorators/userId.decorator';

@Controller('user')
@Roles(UserType.Admin)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUserDto);
  }

  @Get('/all')
  async getAllUser(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUser()).map(
      (userEntity) => new ReturnUserDto(userEntity),
    );
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }

  @Patch()
  @Roles(UserType.Admin, UserType.User)
  @UsePipes(ValidationPipe)
  async updateUserPassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @UserId() userId: number): Promise<ReturnUserDto> {
    return await this.userService.updateUserPassword(updateUserPasswordDto, userId);
  }

  @Roles(UserType.Admin, UserType.User)
  @Get()
  async getUserInfo(@UserId() userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.userService.getUserByIdUsingRelations(userId));
  }
}
