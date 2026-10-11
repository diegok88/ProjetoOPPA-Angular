import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import {
  SolucoesModel,
  INICIALIZAR_SOLUCOES_ENTITY,
} from '../../../../entities/solucoes.model';

@Component({
  selector: 'app-info-solucoes',
  imports: [MatListModule],
  templateUrl: './info-solucoes.html',
  styles: ``,
})
export class InfoSolucoes {
  public info = input<SolucoesModel>(INICIALIZAR_SOLUCOES_ENTITY());
}