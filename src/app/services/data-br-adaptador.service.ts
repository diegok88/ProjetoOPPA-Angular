import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class DateBrAdapter extends NativeDateAdapter {
  override parse(value: unknown): Date | null {
    if (typeof value === 'string') {
      const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m) {
        const data = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
        return isNaN(data.getTime()) ? null : data;
      }
    }
    return super.parse(value as string);
  }
}
