import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, currencyCode: string = 'EUR'): string {
    if (value == null) return '';

    const formattedValue = value
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedValue} ${currencyCode}`;
  }
}
