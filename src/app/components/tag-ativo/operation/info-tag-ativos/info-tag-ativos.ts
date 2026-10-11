import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { TagAtivosModel, INICIALIZAR_TAGATIVOS_ENTITY } from '../../../../entities/tag-ativo.model';

@Component({
  selector: 'app-info-tag-ativos',
  imports: [MatListModule],
  templateUrl: './info-tag-ativos.html',
  styles: ``,
})
export class InfoTagAtivos {
  public info = input<TagAtivosModel>(INICIALIZAR_TAGATIVOS_ENTITY());
}
