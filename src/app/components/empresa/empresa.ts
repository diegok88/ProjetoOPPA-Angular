import { Component, computed, inject, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { EmpresaService } from '../../services/empresa.service';
import { EmpresaData } from '../../interfaces/empresa-data.interface';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

type Operacao = 'inicial' | 'cadastrar' | 'registro';
type Registro = 'informacao' | 'atualizar' | 'inativar' | 'eliminar' | 'auditoria';
type Field =
  | 'cnpj'
  | 'razaoSocial'
  | 'nomeFantasia'
  | 'contato'
  | 'email'
  | 'rua'
  | 'numero'
  | 'bairro'
  | 'cidade'
  | 'estado'
  | 'cep';

@Component({
  selector: 'app-empresa',
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './empresa.html',
  styleUrl: './empresa.scss',
})
export class Empresa {
  private empresaService = inject(EmpresaService);
  private auditoriaService = inject(AuditoriaService);

  protected readonly listar = this.empresaService.empresa;
  protected readonly buscar = signal<EmpresaData | null>(null);
  protected readonly listarAuditoria = this.auditoriaService.auditoria;
  protected readonly buscarAuditoria = signal<AuditoriaData | null>(null);

  protected operacaoEstado = signal<string>('inicial');
  protected registroEstado = signal<string>('informacao');
  protected auditoriaEstado = signal<boolean>(true);

  protected empresaModel = signal<EmpresaData>({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    contato: '',
    email: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  });

  protected formSubmitted = signal<boolean>(false);

  protected touchedSubmitted = signal<boolean>(false);
  //----------------------------------------------------------------------------------------//
  protected cnpjTouched = signal<boolean>(false);

  protected isCnpjEquals = computed(() => {
    const atual = this.buscar()?.cnpj;
    const novo = this.empresaModel().cnpj.toUpperCase();
    return atual === novo;
  });

  protected cnpjEqualsFiedlsError = computed(() => {
    return (this.cnpjTouched() || this.formSubmitted()) && this.isCnpjEquals();
  });

  protected isCnpjEmpty = computed(() => {
    return this.empresaModel().cnpj.trim().length === 0;
  });

  protected cnpjEmptyFiedlsError = computed(() => {
    return (this.cnpjTouched() || this.formSubmitted()) && this.isCnpjEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected razaoSocialTouched = signal<boolean>(false);

  protected isRazaoSocialEquals = computed(() => {
    const atual = this.buscar()?.razaoSocial;
    const novo = this.empresaModel().razaoSocial.toUpperCase();
    return atual === novo;
  });

  protected razaoSocialEqualsFiedlsError = computed(() => {
    return (this.razaoSocialTouched() || this.formSubmitted()) && this.isRazaoSocialEquals();
  });

  protected isRazaoSocialEmpty = computed(() => {
    return this.empresaModel().razaoSocial.trim().length === 0;
  });

  protected razaoSocialEmptyFiedlsError = computed(() => {
    return (this.razaoSocialTouched() || this.formSubmitted()) && this.isRazaoSocialEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected nomeFantasiaTouched = signal<boolean>(false);

  protected isNomeFantasiaEquals = computed(() => {
    const atual = this.buscar()?.nomeFantasia;
    const novo = this.empresaModel().nomeFantasia.toUpperCase();
    return atual === novo;
  });

  protected nomeFantasiaEqualsFiedlsError = computed(() => {
    return (this.nomeFantasiaTouched() || this.formSubmitted()) && this.isNomeFantasiaEquals();
  });

  protected isNomeFantasiaEmpty = computed(() => {
    return this.empresaModel().nomeFantasia.trim().length === 0;
  });

  protected nomeFantasiaEmptyFiedlsError = computed(() => {
    return (this.nomeFantasiaTouched() || this.formSubmitted()) && this.isNomeFantasiaEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected contatoTouched = signal<boolean>(false);

  protected isContatoEquals = computed(() => {
    const atual = this.buscar()?.contato;
    const novo = this.empresaModel().contato.toUpperCase();
    return atual === novo;
  });

  protected contatoEqualsFiedlsError = computed(() => {
    return (this.contatoTouched() || this.formSubmitted()) && this.isContatoEquals();
  });

  protected isContatoEmpty = computed(() => {
    return this.empresaModel().contato.trim().length === 0;
  });

  protected contatoEmptyFiedlsError = computed(() => {
    return (this.contatoTouched() || this.formSubmitted()) && this.isContatoEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected emailTouched = signal<boolean>(false);

  protected isEmailEquals = computed(() => {
    const atual = this.buscar()?.email;
    const novo = this.empresaModel().email.toUpperCase();
    return atual === novo;
  });

  protected emailEqualsFiedlsError = computed(() => {
    return (this.emailTouched() || this.formSubmitted()) && this.isEmailEquals();
  });

  protected isEmailEmpty = computed(() => {
    return this.empresaModel().email.trim().length === 0;
  });

  protected emailEmptyFiedlsError = computed(() => {
    return (this.emailTouched() || this.formSubmitted()) && this.isEmailEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected ruaTouched = signal<boolean>(false);

  protected isRuaEquals = computed(() => {
    const atual = this.buscar()?.rua;
    const novo = this.empresaModel().rua.toUpperCase();
    return atual === novo;
  });

  protected ruaEqualsFiedlsError = computed(() => {
    return (this.ruaTouched() || this.formSubmitted()) && this.isRuaEquals();
  });

  protected isRuaEmpty = computed(() => {
    return this.empresaModel().rua.trim().length === 0;
  });

  protected ruaEmptyFiedlsError = computed(() => {
    return (this.ruaTouched() || this.formSubmitted()) && this.isRuaEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected numeroTouched = signal<boolean>(false);

  protected isNumeroEquals = computed(() => {
    const atual = this.buscar()?.numero;
    const novo = this.empresaModel().numero.toUpperCase();
    return atual === novo;
  });

  protected numeroEqualsFiedlsError = computed(() => {
    return (this.numeroTouched() || this.formSubmitted()) && this.isNumeroEquals();
  });

  protected isNumeroEmpty = computed(() => {
    return this.empresaModel().numero.trim().length === 0;
  });

  protected numeroEmptyFiedlsError = computed(() => {
    return (this.numeroTouched() || this.formSubmitted()) && this.isNumeroEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected bairroTouched = signal<boolean>(false);

  protected isBairroEquals = computed(() => {
    const atual = this.buscar()?.bairro;
    const novo = this.empresaModel().bairro.toUpperCase();
    return atual === novo;
  });

  protected bairroEqualsFiedlsError = computed(() => {
    return (this.bairroTouched() || this.formSubmitted()) && this.isBairroEquals();
  });

  protected isBairroEmpty = computed(() => {
    return this.empresaModel().bairro.trim().length === 0;
  });

  protected bairroEmptyFiedlsError = computed(() => {
    return (this.bairroTouched() || this.formSubmitted()) && this.isBairroEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected cidadeTouched = signal<boolean>(false);

  protected isCidadeEquals = computed(() => {
    const atual = this.buscar()?.cidade;
    const novo = this.empresaModel().cidade.toUpperCase();
    return atual === novo;
  });

  protected cidadeEqualsFiedlsError = computed(() => {
    return (this.cidadeTouched() || this.formSubmitted()) && this.isCidadeEquals();
  });

  protected isCidadeEmpty = computed(() => {
    return this.empresaModel().cidade.trim().length === 0;
  });

  protected cidadeEmptyFiedlsError = computed(() => {
    return (this.cidadeTouched() || this.formSubmitted()) && this.isCidadeEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected estadoTouched = signal<boolean>(false);

  protected isEstadoEquals = computed(() => {
    const atual = this.buscar()?.estado;
    const novo = this.empresaModel().estado.toUpperCase();
    return atual === novo;
  });

  protected estadoEqualsFiedlsError = computed(() => {
    return (this.estadoTouched() || this.formSubmitted()) && this.isEstadoEquals();
  });

  protected isEstadoEmpty = computed(() => {
    return this.empresaModel().estado.trim().length === 0;
  });

  protected estadoEmptyFiedlsError = computed(() => {
    return (this.estadoTouched() || this.formSubmitted()) && this.isEstadoEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected cepTouched = signal<boolean>(false);

  protected isCepEquals = computed(() => {
    const atual = this.buscar()?.estado;
    const novo = this.empresaModel().estado.toUpperCase();
    return atual === novo;
  });

  protected cepEqualsFiedlsError = computed(() => {
    return (this.cepTouched() || this.formSubmitted()) && this.isCepEquals();
  });

  protected isCepEmpty = computed(() => {
    return this.empresaModel().cep.trim().length === 0;
  });

  protected cepEmptyFiedlsError = computed(() => {
    return (this.cepTouched() || this.formSubmitted()) && this.isCepEmpty();
  });
  //----------------------------------------------------------------------------------------//
  protected isFormValid = computed(() => {
    const cnpjOk = !this.cnpjEmptyFiedlsError() && !this.cnpjEqualsFiedlsError();
    const razaoSocialOk =
      !this.razaoSocialEmptyFiedlsError() && !this.razaoSocialEqualsFiedlsError();
    const nomeFantasiaOk =
      !this.nomeFantasiaEmptyFiedlsError() && !this.nomeFantasiaEqualsFiedlsError();
    const contatoOk = !this.contatoEmptyFiedlsError() && !this.contatoEqualsFiedlsError();
    const emailOk = !this.emailEmptyFiedlsError() && !this.emailEqualsFiedlsError();
    const ruaOk = !this.ruaEmptyFiedlsError() && !this.ruaEqualsFiedlsError();
    const numeroOk = !this.numeroEmptyFiedlsError() && !this.numeroEqualsFiedlsError();
    const bairroOk = !this.bairroEmptyFiedlsError() && !this.bairroEqualsFiedlsError();
    const cidadeOk = !this.cidadeEmptyFiedlsError() && !this.cidadeEqualsFiedlsError();
    const estadoOk = !this.estadoEmptyFiedlsError() && !this.estadoEqualsFiedlsError();
    const cepOk = !this.cepEmptyFiedlsError() && !this.cepEqualsFiedlsError();
    const touchedOk = this.touchedSubmitted();
    const dadosOk =
      cnpjOk &&
      razaoSocialOk &&
      nomeFantasiaOk &&
      contatoOk &&
      emailOk &&
      ruaOk &&
      numeroOk &&
      bairroOk &&
      cidadeOk &&
      estadoOk &&
      cepOk &&
      touchedOk;

    console.log(dadosOk);
    return dadosOk;
  });
  //----------------------------------------------------------------------------------------//
  protected onBlur(field: Field): void {
    if (field) this.touchedSubmitted.set(true);
    if (field === 'cnpj') this.cnpjTouched.set(true);
    if (field === 'razaoSocial') this.razaoSocialTouched.set(true);
    if (field === 'nomeFantasia') this.nomeFantasiaTouched.set(true);
    if (field === 'contato') this.contatoTouched.set(true);
    if (field === 'email') this.emailTouched.set(true);
    if (field === 'rua') this.ruaTouched.set(true);
    if (field === 'numero') this.numeroTouched.set(true);
    if (field === 'bairro') this.bairroTouched.set(true);
    if (field === 'cidade') this.cidadeTouched.set(true);
    if (field === 'estado') this.estadoTouched.set(true);
    if (field === 'cep') this.cepTouched.set(true);
  }

  protected getField(field: keyof EmpresaData) {
    return this.empresaModel()[field] ?? '';
  }

  protected setField(field: keyof EmpresaData, value: string): void {
    this.empresaModel.update((model) => ({ ...model, [field]: value }));
  }

  protected onInput(field: keyof EmpresaData, value: string): void {
    this.empresaModel.update((model) => ({ ...model, [field]: value }));
  }

  ngOnInit(): void {
    this.carregar().subscribe();
  }

  protected carregar() {
    return this.empresaService.listar();
  }

  protected carregarAuditoria(field: string, query: string) {
    return this.auditoriaService.listar(field, query);
  }

  protected mudarOperacao(operacao: Operacao, item?: string): void {
    if (operacao === 'registro') {
      this.registroEstado.set('informacao');
      this.resetForm();
      if (item) this.carregarRegistro(item);
    }
    if (operacao === 'cadastrar') {
      this.resetForm();
    }
    if (operacao === 'inicial') {
      this.buscar.set(null);
    }
    this.operacaoEstado.set(operacao);
  }

  protected mudarRegistro(registro: Registro): void {
    if (registro === 'atualizar') {
      this.resetForm();
      this.empresaModel.set({
        cnpj: this.buscar()!.cnpj,
        razaoSocial: this.buscar()!.razaoSocial,
        nomeFantasia: this.buscar()!.nomeFantasia,
        contato: this.buscar()!.contato,
        email: this.buscar()!.email,
        rua: this.buscar()!.rua,
        numero: this.buscar()!.numero,
        bairro: this.buscar()!.bairro,
        cidade: this.buscar()!.cidade,
        estado: this.buscar()!.estado,
        cep: this.buscar()!.cep,
      });
    }
    this.auditoriaEstado.set(true);
    this.registroEstado.set(registro);
  }

  protected mudarAuditoria(dados?: AuditoriaData): void {
    if (this.auditoriaEstado() && dados) {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set(dados);
    } else {
      this.auditoriaEstado.update((atual) => (atual = !atual));
      this.buscarAuditoria.set(null);
    }
  }

  private carregarRegistro(id: string): void {
    this.carregar().subscribe({
      next: () => {
        const dado = this.listar().find((item) => item.id === id);
        if (dado) {
          const field: string = 'registroId';
          this.carregarAuditoria(field, id).subscribe();
          this.buscar.set(dado);
          this.empresaModel.set({
            cnpj: this.buscar()!.cnpj,
            razaoSocial: this.buscar()!.razaoSocial,
            nomeFantasia: this.buscar()!.nomeFantasia,
            contato: this.buscar()!.contato,
            email: this.buscar()!.email,
            rua: this.buscar()!.rua,
            numero: this.buscar()!.numero,
            bairro: this.buscar()!.bairro,
            cidade: this.buscar()!.cidade,
            estado: this.buscar()!.estado,
            cep: this.buscar()!.cep,
          });
        }
      },
    });
  }

  protected cadastrar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }
    this.empresaService
      .cadastrar(this.empresaModel())
      .pipe(switchMap(() => this.carregar()))
      .subscribe({
        next: () => {
          this.resetForm();
          this.mudarOperacao('inicial');
        },
        error: (err: any) => {
          console.error('Erro ao cadastrar empresa:', err);
          alert('Falha ao cadastrar empresa. Tente novamente.');
        },
      });
  }

  protected atualizar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.isFormValid()) {
      alert('Formulário inválido - não enviar');
      return;
    }
    this.empresaService
      .atualizar(this.buscar()!.id!, this.empresaModel())
      .pipe(switchMap(() => this.carregar()))
      .subscribe({
        next: () => {
          this.resetForm();
          this.mudarOperacao('registro', this.buscar()!.id!);
        },
        error: (err: any) => {
          console.error('Erro ao atualizar perfil:', err);
          alert('Falha ao atualizar perfil. Tente novamente.');
        },
      });
  }

  protected inativar(event: Event): void {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (!this.buscar()?.status) {
      alert('Perfil já está inativo!');
      return;
    }
    this.empresaService
      .inativar(this.buscar()!.id!)
      .pipe(switchMap(() => this.carregar()))
      .subscribe({
        next: () => {
          this.carregar();
          this.carregarRegistro(this.buscar()!.id!);
          this.mudarOperacao('registro', this.buscar()!.id!);
        },
        error: (err: any) => {
          console.error('Erro ao inativar o perfil:', err);
          alert('Falha ao inativar perfil. Tente novamente.');
        },
      });
  }

  protected eliminar(event: Event) {
    event.preventDefault();
    this.formSubmitted.set(true);
    if (this.buscar()?.status) {
      alert('Perfil não está inativo!');
      return;
    }
    this.empresaService
      .deletar(this.buscar()!.id!)
      .pipe(switchMap(() => this.carregar()))
      .subscribe({
        next: () => {
          this.carregar();
          this.mudarOperacao('inicial');
        },
        error: (err: any) => {
          console.error('Erro ao eliminar o perfil:', err);
          alert('Falha ao eliminar o perfil. Tente novamente.');
        },
      });
  }

  private resetForm(): void {
    this.empresaModel.set({
      cnpj: '',
      razaoSocial: '',
      nomeFantasia: '',
      contato: '',
      email: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    });
    this.cnpjTouched.set(false);
    this.razaoSocialTouched.set(false);
    this.nomeFantasiaTouched.set(false);
    this.contatoTouched.set(false);
    this.emailTouched.set(false);
    this.ruaTouched.set(false);
    this.numeroTouched.set(false);
    this.bairroTouched.set(false);
    this.cidadeTouched.set(false);
    this.estadoTouched.set(false);
    this.cepTouched.set(false);
    this.formSubmitted.set(false);
  }
}
