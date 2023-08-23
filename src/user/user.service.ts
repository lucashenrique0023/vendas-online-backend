import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './enum/userType.enum';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdateUserPasswordDto } from './dtos/update-pasword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDto.email).catch(
      () => undefined,
    );

    if (user) {
      throw new ConflictException(
        `Email: ${createUserDto.email} already exists.`,
      );
    }

    return this.userRepository.save({
      ...createUserDto,
      typeUser: UserType.User,
      password: await this.hashPassword(createUserDto.password),
    });
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    }).then(user => {
      if (!user) {
        throw new NotFoundException(`UserId: ${userId} not found.`);
      }
      return user;
    });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(`Email: ${email} not found.`);
    }

    return user;
  }

  async updateUserPassword(passwordDto: UpdateUserPasswordDto, userId: number): Promise<ReturnUserDto> {
    const user: UserEntity = await this.findUserById(userId);
    await this.validateUpdatePassword(passwordDto, user)

    return this.userRepository.save({
      ...user,
      password: await this.hashPassword(passwordDto.newPassword)
    })

  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await hash(password, saltOrRounds);
  }

  async validateUpdatePassword(passwordDto: UpdateUserPasswordDto, user: UserEntity) {
    await this.comparePassword(passwordDto.oldPassword, user.password);
  }

  async comparePassword(literalPassword: string, dbHashedPassword: string) {
    const passwordMatches: boolean = await compare(literalPassword, dbHashedPassword);

    if (!passwordMatches) {
      throw new BadRequestException(`The provided password does not match the current password.`)
    };
  }


}
