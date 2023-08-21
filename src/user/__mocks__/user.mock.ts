import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/userType.enum';

export const userEntityMock: UserEntity = {
  cpf: '39485994873',
  createdAt: new Date(),
  email: 'emailteste@email.com',
  id: 1232,
  name: 'Name Mock',
  password: 'password123',
  phone: '992839485',
  typeUser: UserType.User,
  updatedAt: new Date(),
};
