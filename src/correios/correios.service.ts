import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Client } from 'nestjs-soap';
import { CityService } from 'src/city/city.service';
import { CityEntity } from 'src/city/entities/city.entity';
import { ResponseDeliveryPrice } from './dtos/response-delivery-price';
import { ReturnCorreiosAddressDto } from './dtos/return-correios-address.dto';
import { ReturnExternalAddressDto } from './dtos/return-external-address.dto';

@Injectable()
export class CorreiosService {

  URL_CORREIOS = process.env.URL_CEP_CORREIOS;

  constructor(private readonly httpService: HttpService,
    private readonly cityService: CityService,
    @Inject('SOAP_CORREIOS') private readonly soapClient: Client
  ) {}

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

  async findDeliveryPrice(): Promise<ResponseDeliveryPrice> {
    return new Promise((resolve) => {
      this.soapClient.CalcPrecoPrazo({
        nCdServico: '40010',
        sCepOrigem: '52041210',
        sCepDestino: '52041211',
        nVlPeso: 2,
        nCdFormato: 1,
        nVlComprimento: 30,
        nVlAltura: 30,
        nVlLargura: 30,
        nVlDiametro: 30,
        nCdEmpresa: '',
        sDsSenha: '',
        sCdMaoPropria: 'N',
        nVlValorDeclarado: 0,
        sCdAvisoRecebimento: 'N',
      },
        (err, res: ResponseDeliveryPrice) => {
          if (res) {
            resolve(res);
          } else {
            throw new BadRequestException('Soap ERROR');
          }
        },
      );
    });
  }
}
