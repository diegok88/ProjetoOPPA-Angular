import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { EmpresaModel, INICIALIZAR_EMPRESA_ENTITY } from '../../../../entities/empresa.model';

@Component({
  selector: 'app-info-empresa',
  imports: [MatListModule],
  template: `
    <mat-list class="info-operacao">
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
          <p>Cnpj:</p>
          <p>{{ info().cnpj }}</p>
        </span>
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Razão Social:</p>
          <p>{{ info().razaoSocial }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Nome Fantasia:</p>
          <p>{{ info().nomeFantasia }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Contato:</p>
          <p>{{ info().contato }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Email:</p>
          <p>{{ info().email }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Rua:</p>
          <p>{{ info().rua }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Número:</p>
          <p>{{ info().numero }}</p>
        </span>
      </mat-list-item>
    </mat-list>
     <mat-list-item>
        <span matListItemTitle>
          <p>Bairro:</p>
          <p>{{ info().bairro }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Cidade:</p>
          <p>{{ info().cidade }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Estado:</p>
          <p>{{ info().estado }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Cep:</p>
          <p>{{ info().cep }}</p></span
        >
      </mat-list-item>
      <mat-list-item>
        <span matListItemTitle>
          <p>Status:</p>
          <p>{{ info().status }}</p>
        </span>
      </mat-list-item>
    </mat-list>
  `,
  styles: ``,
})
export class InfoEmpresa {
  public info = input<EmpresaModel>({ ...INICIALIZAR_EMPRESA_ENTITY });
}
