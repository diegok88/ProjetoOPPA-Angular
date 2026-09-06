import { Component, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { RecordMap, RecordType } from '../../const/operation-map.const';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toogle',
  imports: [FormsModule],
  templateUrl: './toogle.html',
  styleUrl: './toogle.scss',
})
export class Toogle implements OnInit {
  public buscarStatus = input<boolean | undefined>();
  public onRegistroAtual = input<RecordType>();
  public onMudarRegistro = output<RecordType>();

  protected registroAtual = signal<RecordType>(this.onRegistroAtual()!);

  protected recordMap = RecordMap;

  ngOnInit(): void {
    this.mudarRegistro(RecordMap.INFORMACAO);
  }

  protected mudarRegistro(registro: RecordType) {
    this.onMudarRegistro.emit(registro);
    console.log(this.registroAtual());
  }
}
