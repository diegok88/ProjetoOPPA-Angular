import { Component, inject } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  private perfilService = inject(PerfilService);
  protected readonly listar = this.perfilService.perfil;
}
