import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cep',
})
export class CepPipe implements PipeTransform {
  transform(value: string) {
    if (!value) return;

    const digitos = String(value).replace(/\D/g, '');

    const formatado = digitos.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');

    return formatado;
  }
}
