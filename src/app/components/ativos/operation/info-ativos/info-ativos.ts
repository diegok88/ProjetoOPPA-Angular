import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { AtivosModel, INICIALIZAR_ATIVOS_ENTITY } from '../../../../entities/ativos.model';

@Component({
  selector: 'app-info-ativos',
  imports: [MatListModule],
  templateUrl: './info-ativos.html',
  styles: ``,
})
export class InfoAtivos {
  public info = input<AtivosModel>(INICIALIZAR_ATIVOS_ENTITY());
}
