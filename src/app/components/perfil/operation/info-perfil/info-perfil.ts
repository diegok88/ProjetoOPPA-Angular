import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { INICIALIZAR_PERFIL_ENTITY, PerfilModel } from '../../../../entities/perfil.model';

@Component({
  selector: 'app-info-perfil',
  imports: [MatListModule],
  template: `
    <section class="container-operation-info">
      <div class="container-operation-info-separated">
        <mat-list>
          <mat-list-item>
            <span matListItemTitle>
              <p class="list-label">Id:</p>
              <p class="list-data">{{ info().id }}</p>
            </span>
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Código:</p>
              <p>{{ info().codigo }}</p>
            </span>
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Descrição:</p>
              <p>{{ info().descricao }}</p></span
            >
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Status:</p>
              <p>{{ info().status }}</p>
            </span>
          </mat-list-item>
        </mat-list>
      </div>
    </section>
  `,
  styles: ``,
})
export class InfoPerfil {
  public info = input<PerfilModel>({ ...INICIALIZAR_PERFIL_ENTITY });
}
