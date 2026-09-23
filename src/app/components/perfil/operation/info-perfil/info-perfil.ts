import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { INICIALIZAR_PERFIL_ENTITY, PerfilModel } from '../../../../entities/perfil.model';

@Component({
  selector: 'app-info-perfil',
  imports: [MatListModule],
  templateUrl: '/info-perfil.html',
  styles: ``,
})
export class InfoPerfil {
  public info = input<PerfilModel>(INICIALIZAR_PERFIL_ENTITY());
}
