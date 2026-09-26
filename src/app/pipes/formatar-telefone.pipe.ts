import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone',
})
export class TelefonePipe implements PipeTransform {
  transform(value: string) {
    if (!value) return;

    const digitos = String(value).replace(/\D/g, '');

    const formatado = digitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

    return formatado;
  }
}
