import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PerfilService } from '../../../../services/perfil.service';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-inicial-perfil',
  imports: [MatButtonModule, MatCardModule, MatIcon],
  template: `
    <section class="container-operation-initial">
      <img class="operation-initial-img" src="images/team.png" alt="Perfil" />
      <span class="operation-initial-text">Cadastrar um novo Perfil?</span>
      <button matButton="outlined" class="operacao-button" (click)="onCadastrarOperacao()">
        Clique aqui
      </button>
      <div class="operation-initial-data">
        <mat-card class="initial-totals" appearance="outlined">
          <mat-card-header>
            <div class="container-card-icon totals">
              <mat-icon fontSet="material-symbols-outlined">List_Alt</mat-icon>
            </div>
            <mat-card-title>Total de Perfis</mat-card-title>
            <mat-card-subtitle>{{ listar().length }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
        <mat-card class="initial-active" appearance="outlined">
          <mat-card-header>
            <div class="container-card-icon active">
              <mat-icon fontSet="material-symbols-outlined">Verified</mat-icon>
            </div>
            <mat-card-title>Total de Ativas</mat-card-title>
            <mat-card-subtitle>{{ counterStatus(true) }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
        <mat-card class="initial-deactive" appearance="outlined">
          <mat-card-header>
            <div class="container-card-icon deactive">
              <mat-icon fontSet="material-symbols-outlined">Release_Alert</mat-icon>
            </div>
            <mat-card-title>Total de Inativas</mat-card-title>
            <mat-card-subtitle>{{ counterStatus(false) }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
      </div>
    </section>
  `,
  styles: ``,
})
export class InicialPerfil {
  private perfilService = inject(PerfilService);

  protected readonly listar = this.perfilService.perfil;

  public abrirCadastro = output();

  protected counterStatus(status: boolean) {
    const contador = this.listar().filter((item) => item.status === status);
    return contador.length;
  }

  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}
