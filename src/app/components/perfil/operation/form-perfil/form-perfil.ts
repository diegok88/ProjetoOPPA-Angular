import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PerfilData } from '../../../../interfaces/perfil-data.interface';
import { DialogConfirmarService } from '../../../../services/dialog-confirmar.service';
import { DialogFinalizarService } from '../../../../services/dialog-finalizar.service';
import { PerfilService } from '../../../../services/perfil.service';

type Field = 'descricao';

@Component({
  selector: 'app-form-perfil',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <form class="operacao-forms" (ngSubmit)="cadastrar($event)">
      <section class="operacao-group">
        <mat-form-field appearance="outline">
          <mat-label>Descrição</mat-label>
          <input
            matInput
            type="text"
            id="descricao"
            name="descricao"
            placeholder="Insira a descrição do perfil"
            [ngModel]="getField('descricao')"
            (ngModelChange)="setField('descricao', $event)"
            (blur)="onBlur('descricao')"
            autocomplete="off"
          />
          @if (getField('descricao')) {
            <!-- PARA O BOTÃO NÃO SER SUBMETIDO IGUAL A DO CADASTRAR O MESMO DEVE SER TIPADO - type="button" -->
            <button
              matSuffix
              matIconButton
              type="button"
              aria-label="Clear"
              (click)="clearField('descricao')"
            >
              <mat-icon>close</mat-icon>
            </button>
          }
          <mat-hint>
            <span class="error-message" [class.show]="descricaoEmptyFiedlsError()">
              O descrição é obrigatório
            </span>
            <span class="error-message" [class.show]="descricaoEqualsFiedlsError()">
              A descrição igual a cadastrada.
            </span>
          </mat-hint>
        </mat-form-field>
      </section>
      <button matButton="outlined" type="submit" [disabled]="isFormValid()">Cadastrar</button>
    </form>
  `,
  styles: ``,
})
export class FormPerfil {
  private confirmarService = inject(DialogConfirmarService);
  private finalizarService = inject(DialogFinalizarService);
  private perfilService = inject(PerfilService);

  protected readonly listar = this.perfilService.perfil;
  protected readonly buscar = signal<PerfilData | null>(null);

  public onMudarOperacao = output();

  protected perfilModel = signal<PerfilData>({ descricao: '' });

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(true);

  protected descricaoTouched = signal<boolean>(false);

  protected isDescricaoEquals = computed(() => {
    const des = this.perfilModel().descricao.toUpperCase();
    const atualizaIgual = des === this.buscar()?.descricao;
    const registroIgual = this.listar().some((item) => item.descricao === des);
    return atualizaIgual || registroIgual;
  });

  protected descricaoEqualsFiedlsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEquals();
  });

  protected isDescricaoEmpty = computed(() => {
    return this.perfilModel().descricao.trim().length === 0;
  });

  protected descricaoEmptyFiedlsError = computed(() => {
    return (this.descricaoTouched() || this.formSubmitted()) && this.isDescricaoEmpty();
  });

  protected isFormValid = computed(() => {
    const descricaoOk = this.descricaoEmptyFiedlsError() || this.descricaoEqualsFiedlsError();
    const touchedOk = this.touchedSubmitted();
    const dadosOk = descricaoOk || touchedOk;
    return dadosOk;
  });

  protected onBlur(field: Field): void {
    if (field) this.touchedSubmitted.set(false);
    if (field === 'descricao') this.descricaoTouched.set(true);
  }

  protected getField(field: keyof PerfilData) {
    return this.perfilModel()[field] ?? '';
  }

  protected setField(field: keyof PerfilData, value: string): void {
    this.perfilModel.update((model) => ({ ...model, [field]: value }));
  }

  protected carregar() {
    return this.perfilService.listar();
  }

  protected cadastrar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }

    const perfil = this.perfilModel();

    this.confirmarService
      .confirmar({
        icone: '/icons/add_circle_84.png',
        titulo: 'Novo Perfil',
        mensagem: `Deseja confirmar o cadastro do perfil ${perfil.descricao.toUpperCase()}?`,
        acao: () => this.perfilService.cadastrar(perfil),
      })
      .subscribe((confirmado) => {
        console.log(confirmado);
        if (confirmado === 'finalizado') {
          this.resetForm();
          this.onMudarOperacao.emit();
          this.carregar().subscribe();
          this.finalizarService.finalizar({
            icone: '/icons/check_circle_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Sucesso!',
            mensagem: 'Cadastrado com exíto.',
          });
        } else if (confirmado === 'erro') {
          this.finalizarService.finalizar({
            icone: '/icons/error_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Erro!',
            mensagem: 'Falha no cadastro.',
            erros: this.finalizarService.ultimosErros(),
          });
        } else {
          this.finalizarService.finalizar({
            icone: '/icons/cancel_84.png',
            operacao: perfil.descricao.toLocaleUpperCase(),
            titulo: 'Cancelado!',
            mensagem: 'Operação de cadastro cancelada.',
          });
        }
      });
  }
  /* FUNÇÃO DE LIMPEZA DO CAMPO */
  protected clearField(field: keyof PerfilData) {
    this.perfilModel.update((current) => {
      const emptyValue = this.getEmptyValue(current[field]);
      return { ...current, [field]: emptyValue };
    });
  }
  /* FUNÇÃO PARA IDENTIFICAR O TIPO DE DADOS O CAMPO PERTENCE */
  private getEmptyValue(value: any): any {
    if (typeof value === 'string') return '';
    if (typeof value === 'number') return 0;
    if (typeof value === 'boolean') return false;
    if (value instanceof Date) return null; // ou new Date()
    return null;
  }

  private resetForm(): void {
    this.perfilModel.set({ descricao: '' });
    this.descricaoTouched.set(false);
    this.formSubmitted.set(false);
    this.touchedSubmitted.set(true);
  }
}
