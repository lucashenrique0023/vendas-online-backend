import { ReturnCorreiosAddressDto } from "./return-correios-address.dto";

export class ReturnExternalAddressDto {
  zipCode: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  uf: string;
  areaCode: string;
  cityId?: number;
  stateId?: number;

  constructor(address: ReturnCorreiosAddressDto,
    cityId?: number, stateId?: number) {
    this.zipCode = address.cep;
    this.street = address.logradouro;
    this.complement = address.complemento;
    this.district = address.bairro;
    this.city = address.localidade;
    this.uf = address.uf;
    this.areaCode = address.ddd;
    this.cityId = cityId;
    this.stateId = stateId;

  }
}