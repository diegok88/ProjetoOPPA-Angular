import { Component, input } from '@angular/core';
import { UsuarioModel, INICIALIZAR_USUARIO_ENTITY } from '../../../../entities/usuario.model';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-info-usuario',
  imports: [MatListModule, DatePipe],
  templateUrl: './info-usuario.html',
  styles: ``,
})
export class InfoUsuario {
  public info = input<UsuarioModel>(INICIALIZAR_USUARIO_ENTITY());
}
