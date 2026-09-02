import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PerfilService } from '../../../../services/perfil.service';

@Component({
  selector: 'app-inicial-perfil',
  imports: [MatButtonModule],
  template: `
    <section class="operacao-inicial">
      <img class="operacao-img" src="images/team.png" alt="Perfil" />
      <span class="operacao-texto">Cadastrar um novo Perfil?</span>
      <button matButton="outlined" class="operacao-button" (click)="onCadastrarOperacao()">
        Clique aqui
      </button>
      <div class="dados-inicial">
        <span>Total de Perfis: {{ listar().length }}</span>
        <span>Total de Ativas: {{ counterStatus(true) }}</span>
        <span>Total de Inativas: {{ counterStatus(false) }}</span>
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
