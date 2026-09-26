'00.000.000/0000-00';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnpj',
})
export class CnpjPipe implements PipeTransform {
  transform(value: string) {
    if (!value) return;

    const digitos = String(value).replace(/\D/g, '');

    const formatado = digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');

    return formatado;
  }
}
