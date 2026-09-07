import { Component, inject, output } from '@angular/core';
import { EmpresaService } from '../../../../services/empresa.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inicial-empresa',
  imports: [MatButtonModule, MatCardModule],
  template: `
    <section class="operacao-inicial">
      <img class="operacao-img" src="images/factory.png" alt="Empresa" />
      <span class="operacao-texto">Cadastrar uma nova Empresa?</span>
      <button matButton="outlined" class="operacao-button" (click)="onCadastrarOperacao()">
        Clique aqui
      </button>
      <div class="inicial-dados">
        <mat-card class="inicial-totais" appearance="outlined">
          <mat-card-header>
            <mat-card-title>Total de Empresas</mat-card-title>
            <mat-card-subtitle>{{ listar().length }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
        <mat-card class="inicial-ativos" appearance="outlined">
          <mat-card-header>
            <mat-card-title>Total de Ativas</mat-card-title>
            <mat-card-subtitle>{{ counterStatus(true) }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
        <mat-card class="inicial-inativos" appearance="outlined">
          <mat-card-header>
            <mat-card-title>Total de Inativas</mat-card-title>
            <mat-card-subtitle>{{ counterStatus(false) }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
      </div>
    </section>
  `,
  styles: ``,
})
export class InicialEmpresa {
  private empresaService = inject(EmpresaService);

  protected readonly listar = this.empresaService.empresa;

  public abrirCadastro = output();

  protected counterStatus(status: boolean) {
    const contador = this.listar().filter((item) => item.status === status);
    return contador.length;
  }

  protected onCadastrarOperacao(): void {
    this.abrirCadastro.emit();
  }
}
