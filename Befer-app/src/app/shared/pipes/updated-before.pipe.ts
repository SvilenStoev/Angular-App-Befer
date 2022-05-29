import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'updatedBefore'
})
export class UpdatedBeforePipe implements PipeTransform {

  private now = new Date();

  transform(updatedAt: string): string {
    if (!updatedAt) {
      return '';
    }

    const updatedTime = new Date(updatedAt);

    const elapsedTime = this.now.getTime() - updatedTime.getTime();
    const milisec = 1000;
    const min = 60 * 1000;
    const hour = 60 * min;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (elapsedTime < min) {
      return ` | Edited ${Math.floor(elapsedTime / milisec)} seconds ago`;
    }

    if (elapsedTime < hour) {
      return ` | Edited ${Math.floor(elapsedTime / min)} minutes ago`;
    }

    if (elapsedTime < day) {
      return ` | Edited ${Math.floor(elapsedTime / hour)} hours ago`;
    }

    if (elapsedTime < month) {
      return ` | Edited ${Math.floor(elapsedTime / day)} days ago`;
    }

    if (elapsedTime < year) {
      return ` | Edited ${Math.floor(elapsedTime / month)} month ago`;
    }

    return ` | Edited ${Math.floor(elapsedTime / year)} years ago`;
  }

}
