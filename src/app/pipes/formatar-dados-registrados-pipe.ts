import { Pipe, PipeTransform } from '@angular/core';

/* 
PIPE PARA FORMATAÇÃO DO TEXTO DE DADOS REGISTRADOS,
FORMATA EM QUALQUER TIPO DE ENTRADA DE TEXTO
*/

@Pipe({
  name: 'formatarDadosRegistrados',
})
export class FormatarDadosRegistradosPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';

    try {
      let str = value.trim();
      if (str.startsWith('{') && str.endsWith('}')) {
        str = str.slice(1, -1);
      }

      let formatted = str
        .replace(/\s*mudancas:\s*/g, 'mudanças:\n')
        .replace(/\s*,\s*/g, '\n')
        .replace(/\{/g, '')
        .replace(/\}/g, '')
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .replace(/\s*:\s*/g, ': ');

      return formatted;
    } catch {
      return value;
    }
  }
}
