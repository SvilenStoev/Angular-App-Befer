import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceArgs'
})
export class ReplaceArgsPipe implements PipeTransform {
  transform(text: string, ...args: any): string {
    if (!text) {
      return '';
    }

    for (let i = 0; i < args.length; i++) {
      text = text.replace(`{${i}}`, args[i]);
    }

    return text;
  }
}