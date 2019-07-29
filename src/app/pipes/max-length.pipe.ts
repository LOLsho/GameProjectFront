import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength',
})
export class MaxLengthPipe implements PipeTransform {
  transform(value: any, length: number = 20): any {
    if (!value) return value;
    if (value.length > length) value = `${value.substr(0, length)}...`;
    else value.substr(0, length);
    return value;
  }
}
