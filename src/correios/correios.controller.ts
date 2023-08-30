import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnExternalAddressDto } from './dtos/return-external-address.dto';
import { ResponseDeliveryPrice } from './dtos/response-delivery-price';

@Controller('correios')
export class CorreiosController {

  constructor(private readonly correiosService: CorreiosService) {}

  @Get('/delivery-price')
  async findDeliveryPrice(): Promise<ResponseDeliveryPrice> {
    return await this.correiosService.findDeliveryPrice();
  }

  @Get('/:cep')
  async findAddressByCep(@Param('cep') cep: string): Promise<ReturnExternalAddressDto> {
    return await this.correiosService.findAddressByCep(cep);
  }
}
