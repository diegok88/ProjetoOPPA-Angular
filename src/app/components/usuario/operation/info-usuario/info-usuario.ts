import { Component, input } from '@angular/core';
import { UsuarioModel, INICIALIZAR_USUARIO_ENTITY } from '../../../../entities/usuario.model';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-info-usuario',
  imports: [MatListModule, DatePipe],
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
              <p>Crachá:</p>
              <p>{{ info().cracha }}</p>
            </span>
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Nome:</p>
              <p>{{ info().nome }}</p>
            </span>
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Data de Nascimento:</p>
              <p>{{ info().dataNascimento | date: 'dd/MM/yyyy' }}</p></span
            >
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Data de Admissão:</p>
              <p>{{ info().dataAdmissao | date: 'dd/MM/yyyy' }}</p></span
            >
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Perfil:</p>
              <p>{{ info().desPerfil }}</p></span
            >
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Turno:</p>
              <p>{{ info().turno }}</p></span
            >
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Escala:</p>
              <p>{{ info().escala }}</p></span
            >
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Empresa:</p>
              <p>{{ info().desEmpresa }}</p></span
            >
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Status:</p>
              <p>{{ info().status }}</p></span
            >
          </mat-list-item>
          <mat-list-item>
            <span matListItemTitle>
              <p>Gestor Responsável:</p>
              <p>{{ info().nomeGestor }} - {{ info().crachaGestor }}</p></span
            >
          </mat-list-item>
        </mat-list>
      </div>
    </section>
  `,
  styles: ``,
})
export class InfoUsuario {
  public info = input<UsuarioModel>(INICIALIZAR_USUARIO_ENTITY());
}
