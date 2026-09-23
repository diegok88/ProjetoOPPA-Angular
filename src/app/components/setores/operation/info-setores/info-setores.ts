import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { SetoresModel, INICIALIZAR_SETORES_ENTITY } from '../../../../entities/setores.model';

@Component({
  selector: 'app-info-setores',
  imports: [MatListModule],
  templateUrl: './info-setores.html',
  styles: ``,
})
export class InfoSetores {
  public info = input<SetoresModel>(INICIALIZAR_SETORES_ENTITY());
}
