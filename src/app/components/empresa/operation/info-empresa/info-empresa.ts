import { Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { EmpresaModel, INICIALIZAR_EMPRESA_ENTITY } from '../../../../entities/empresa.model';
import { TelefonePipe } from '../../../../pipes/formatar-telefone.pipe';
import { CepPipe } from '../../../../pipes/formatar-cep.pipe';
import { CnpjPipe } from '../../../../pipes/formatar-cnpj.pipe';

@Component({
  selector: 'app-info-empresa',
  imports: [MatListModule, TelefonePipe, CepPipe, CnpjPipe],
  templateUrl: './info-empresa.html',
  styles: ``,
})
export class InfoEmpresa {
  public info = input<EmpresaModel>(INICIALIZAR_EMPRESA_ENTITY());
}
