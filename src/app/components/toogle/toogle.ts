import { Component, input, output } from '@angular/core';
import { RecordType } from '../../constants/operation-map.const';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export interface ToggleOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-toogle',
  imports: [FormsModule, MatButtonToggleModule],
  templateUrl: './toogle.html',
  styleUrl: './toogle.scss',
})
export class Toogle {
  protected options: ToggleOption[] = [
    { value: 'informacao', label: 'Informação' },
    { value: 'atualizar', label: 'Atualizar' },
    { value: 'status', label: 'Status' },
    { value: 'eliminar', label: 'Eliminar' },
    { value: 'auditoria', label: 'Auditoria' },
  ];
  protected label: string = '';

  public onRegistroAtual = input<RecordType | null>(null);
  public statusEntity = input<boolean>();

  public onMudarRegistro = output<RecordType>();

  onSelect(value: RecordType): void {
    this.onMudarRegistro.emit(value);
  }
}
