import { cityMock } from '../../city/__mocks__/city.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AddressEntity } from '../entities/address.entity';

export const addressMock: AddressEntity = {
  cep: '37475545',
  cityId: cityMock.id,
  complement: 'complement',
  createdAt: new Date(),
  id: 1212,
  numberAddress: 345,
  updatedAt: new Date(),
  userId: userEntityMock.id,
};
