import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/userType.enum';

export const userEntityMock: UserEntity = {
  cpf: '39485994873',
  createdAt: new Date(),
  email: 'henrique@email.com',
  id: 1232,
  name: 'Name Mock',
  password: '$2b$10$XdU05M8MWK4f9N23eMUrlOjinkG6q2zggk.l1dEjOA8BmL.dT4u6y',
  phone: '992839485',
  typeUser: UserType.User,
  updatedAt: new Date(),
};
