import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnExternalAddressDto } from './dtos/return-external-address.dto';

@Controller('correios')
export class CorreiosController {

  constructor(private readonly correiosService: CorreiosService) {}

  @Get('/:cep')
  async findAddressByCep(@Param('cep') cep: string): Promise<ReturnExternalAddressDto> {
    return await this.correiosService.findAddressByCep(cep);
  }
}
