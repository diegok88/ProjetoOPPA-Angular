import { Component, computed, inject, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import { AuditoriaData } from '../../interfaces/auditoria-data.interface';
import { AuditoriaService } from '../../services/auditoria.service';
import { EmpresaService } from '../../services/empresa.service';
import { EmpresaData } from '../../interfaces/empresa-data.interface';
import { FormsModule } from '@angular/forms';

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
  imports: [FormsModule],
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

  protected cnpjTouched = signal<boolean>(false);
  protected razaoSocialTouched = signal<boolean>(false);
  protected nomeFantasiaTouched = signal<boolean>(false);
  protected contatoTouched = signal<boolean>(false);
  protected emailTouched = signal<boolean>(false);
  protected ruaTouched = signal<boolean>(false);
  protected numeroTouched = signal<boolean>(false);
  protected bairroTouched = signal<boolean>(false);
  protected cidadeTouched = signal<boolean>(false);
  protected estadoTouched = signal<boolean>(false);
  protected cepTouched = signal<boolean>(false);

  protected isCnpjEmpty = computed(() => {
    return this.empresaModel().cnpj.trim().length === 0;
  });
  protected isRazaoSocialEmpty = computed(() => {
    return this.empresaModel().razaoSocial.trim().length === 0;
  });
  protected isNomeFantasiaEmpty = computed(() => {
    return this.empresaModel().nomeFantasia.trim().length === 0;
  });
  protected isContatoEmpty = computed(() => {
    return this.empresaModel().contato.trim().length === 0;
  });
  protected isEmailEmpty = computed(() => {
    return this.empresaModel().email.trim().length === 0;
  });
  protected isRuaEmpty = computed(() => {
    return this.empresaModel().rua.trim().length === 0;
  });
  protected isNumeroEmpty = computed(() => {
    return this.empresaModel().numero.trim().length === 0;
  });
  protected isBairroEmpty = computed(() => {
    return this.empresaModel().bairro.trim().length === 0;
  });
  protected isCidadeEmpty = computed(() => {
    return this.empresaModel().cidade.trim().length === 0;
  });
  protected isEstadoEmpty = computed(() => {
    return this.empresaModel().estado.trim().length === 0;
  });
  protected isCepEmpty = computed(() => {
    return this.empresaModel().cep.trim().length === 0;
  });

  protected cnpjEmptyFiedlsError = computed(() => {
    return (this.cnpjTouched() || this.formSubmitted()) && this.isCnpjEmpty();
  });
  protected razaoSocialEmptyFiedlsError = computed(() => {
    return (this.razaoSocialTouched() || this.formSubmitted()) && this.isRazaoSocialEmpty();
  });
  protected nomeFantasiaEmptyFiedlsError = computed(() => {
    return (this.nomeFantasiaTouched() || this.formSubmitted()) && this.isNomeFantasiaEmpty();
  });
  protected contatoEmptyFiedlsError = computed(() => {
    return (this.contatoTouched() || this.formSubmitted()) && this.isContatoEmpty();
  });
  protected emailEmptyFiedlsError = computed(() => {
    return (this.emailTouched() || this.formSubmitted()) && this.isEmailEmpty();
  });
  protected ruaEmptyFiedlsError = computed(() => {
    return (this.ruaTouched() || this.formSubmitted()) && this.isRuaEmpty();
  });
  protected numeroEmptyFiedlsError = computed(() => {
    return (this.numeroTouched() || this.formSubmitted()) && this.isNumeroEmpty();
  });
  protected bairroEmptyFiedlsError = computed(() => {
    return (this.bairroTouched() || this.formSubmitted()) && this.isBairroEmpty();
  });
  protected cidadeEmptyFiedlsError = computed(() => {
    return (this.cidadeTouched() || this.formSubmitted()) && this.isCidadeEmpty();
  });
  protected estadoEmptyFiedlsError = computed(() => {
    return (this.estadoTouched() || this.formSubmitted()) && this.isEstadoEmpty();
  });
  protected cepEmptyFiedlsError = computed(() => {
    return (this.razaoSocialTouched() || this.formSubmitted()) && this.isRazaoSocialEmpty();
  });

  protected isFormValid = computed(() => {
    const cnpjOk = !this.cnpjEmptyFiedlsError();
    const razaoSocialOk = !this.razaoSocialEmptyFiedlsError();
    const nomeFantasiaOk = !this.nomeFantasiaEmptyFiedlsError();
    const contatoOk = !this.contatoEmptyFiedlsError();
    const emailOk = !this.emailEmptyFiedlsError();
    const ruaOk = !this.ruaEmptyFiedlsError();
    const numeroOk = !this.numeroEmptyFiedlsError();
    const bairroOk = !this.bairroEmptyFiedlsError();
    const cidadeOk = !this.cidadeEmptyFiedlsError();
    const estadoOk = !this.estadoEmptyFiedlsError();
    const cepOk = !this.cepEmptyFiedlsError();
    const dadosOk = [
      cnpjOk,
      razaoSocialOk,
      nomeFantasiaOk,
      contatoOk,
      emailOk,
      ruaOk,
      numeroOk,
      bairroOk,
      cidadeOk,
      estadoOk,
      cepOk,
    ];
    return dadosOk;
  });

  protected onBlur(field: Field): void {
    if (field === 'cnpj') this.cnpjTouched.set(true);
    if (field === 'razaoSocial') this.cnpjTouched.set(true);
    if (field === 'nomeFantasia') this.cnpjTouched.set(true);
    if (field === 'contato') this.cnpjTouched.set(true);
    if (field === 'email') this.cnpjTouched.set(true);
    if (field === 'rua') this.cnpjTouched.set(true);
    if (field === 'numero') this.cnpjTouched.set(true);
    if (field === 'bairro') this.cnpjTouched.set(true);
    if (field === 'cidade') this.cnpjTouched.set(true);
    if (field === 'estado') this.cnpjTouched.set(true);
    if (field === 'cep') this.cnpjTouched.set(true);
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
          this.carregar();
          this.resetForm();
          this.mudarOperacao('inicial');
        },
        error: (err: any) => {
          console.error('Erro ao cadastrar perfil:', err);
          alert('Falha ao cadastrar perfil. Tente novamente.');
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
