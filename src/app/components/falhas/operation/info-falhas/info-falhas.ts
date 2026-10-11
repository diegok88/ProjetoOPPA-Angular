import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FalhasModel, INICIALIZAR_FALHAS_ENTITY } from '../../../../entities/falhas.model';

@Component({
  selector: 'app-info-falhas',
  imports: [MatListModule],
  templateUrl: './info-falhas.html',
  styles: ``,
})
export class InfoFalhas {
  public info = input<FalhasModel>(INICIALIZAR_FALHAS_ENTITY());
}
