import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { CityService } from 'src/city/city.service';
import { CityEntity } from 'src/city/entities/city.entity';
import { ReturnCorreiosAddressDto } from './dtos/return-correios-address.dto';
import { ReturnExternalAddressDto } from './dtos/return-external-address.dto';

@Injectable()
export class CorreiosService {

  URL_CORREIOS = process.env.URL_CEP_CORREIOS;

  constructor(private readonly httpService: HttpService,
    private readonly cityService: CityService) {}

  async findAddressByCep(cep: string): Promise<ReturnExternalAddressDto> {
    const address = await this.httpService.axiosRef
      .get<ReturnCorreiosAddressDto>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === true) {
          throw new NotFoundException(`CEP not found: ${cep}`)
        }
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(`Something went wrong: ${error.message}`)
      });

    const city: CityEntity | undefined = await this.cityService
      .findCityByName(address.localidade, address.uf)
      .catch(() => undefined);

    return new ReturnExternalAddressDto(address, city?.id, city?.state?.id);
  }
}
