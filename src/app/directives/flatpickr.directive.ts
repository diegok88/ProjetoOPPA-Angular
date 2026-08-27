import { Directive, ElementRef, forwardRef, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';

@Directive({
  selector: '[appFlatpickr]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlatpickrDirective),
      multi: true,
    },
  ],
})
export class FlatpickrDirective implements OnInit, OnDestroy, ControlValueAccessor {
  public config = input<any>({});
  private instance!: Instance;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  private el = inject(ElementRef);

  ngOnInit(): void {
    const defaultConfig = {
      dateFormat: 'd/m/Y',
      allowInput: true,
      onChange: (selectedDates: Date[]) => {
        const val = selectedDates.length ? selectedDates[0] : null;
        this.onChange(val);
        this.onTouched();
      },
      onClose: () => this.onTouched(),
    };
    const finalConfig = { ...defaultConfig, ...this.config };
    this.instance = flatpickr(this.el.nativeElement, finalConfig);
  }
  ngOnDestroy(): void {
    this.instance?.destroy();
  }

  writeValue(value: any): void {
    if (this.instance) {
      // Se não houver valor, limpa
      if (!value) {
        this.instance.clear();
        return;
      }

      let dateValue = value;

      if (typeof value === 'string') {
        if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const parts = value.split('/');
          dateValue = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        } else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
          dateValue = new Date(value);
          if (isNaN(dateValue.getTime())) {
            const parts = value.split('T')[0].split('-');
            dateValue = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          }
        } else {
          dateValue = new Date(value);
          if (isNaN(dateValue.getTime())) {
            console.warn('Flatpickr: data inválida recebida:', value);
            dateValue = null;
          }
        }
      }
      if (dateValue && !isNaN(dateValue.getTime())) {
        this.instance.setDate(dateValue, false);
      } else {
        this.instance.clear();
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.instance) {
      if (isDisabled) {
        this.instance.input?.setAttribute('disabled', 'disabled');
      } else {
        this.instance.input?.removeAttribute('disabled');
      }
    }
  }
}
