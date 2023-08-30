import { ResponseDeliveryPrice } from "src/correios/dtos/response-delivery-price";

interface ReturnDelivery {
  deliveryTime: number;
  deliveryPrice: number;
  deliveryType: number;
}

export class ReturnProductDeliveryPriceDto {
  delivery: ReturnDelivery[]

  constructor(responseDeliveryPrice: ResponseDeliveryPrice[]) {
    this.delivery = responseDeliveryPrice
      .filter((response) => response.CalcPrecoPrazoResult?.Servicos?.cServico[0]?.Erro === '0')
      .map((response) => ({
        deliveryPrice: Number(response.CalcPrecoPrazoResult?.Servicos?.cServico[0]?.Valor.replace(',', '.')),
        deliveryTime: Number(response.CalcPrecoPrazoResult?.Servicos?.cServico[0]?.PrazoEntrega),
        deliveryType: response.CalcPrecoPrazoResult?.Servicos?.cServico[0]?.Codigo
      }))
  }
}