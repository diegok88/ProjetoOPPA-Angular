import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { PerfilData } from '../../../../interfaces/perfil-data.interface';

@Component({
  selector: 'app-info-perfil',
  imports: [MatListModule],
  template: `
    <mat-list>
      <mat-list-item>
        <span matListItemTitle>
          <p class="list-label">Id:</p>
          <p class="list-data">{{ infoPerfil()?.id }}</p>
        </span>
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Código:</p>
          <p>{{ infoPerfil()?.codigo }}</p>
        </span>
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Descrição:</p>
          <p>{{ infoPerfil()?.descricao }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Status:</p>
          <p>{{ infoPerfil()?.status }}</p>
        </span>
      </mat-list-item>
    </mat-list>
  `,
  styles: ``,
})
export class InfoPerfil {
  public infoPerfil = input<PerfilData | null>(null);
}
