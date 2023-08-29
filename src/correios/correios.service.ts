import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class CorreiosService {

  URL_CORREIOS = process.env.URL_CEP_CORREIOS;

  constructor(private readonly httpService: HttpService) {}

  async findAddressByCep(cep: string): Promise<AxiosResponse<any[]>> {
    return this.httpService.axiosRef.get(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        console.log('result', result)
        if (result.data.erro === true) {
          throw new NotFoundException(`CEP not found: ${cep}`)
        }
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(`Something went wrong: ${error.message}`)
      });
  }
}
