import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'createdBefore'
})
export class CreatedBeforePipe implements PipeTransform {

  private now = new Date();

  transform(createdAt: string): string {
    if (!createdAt) {
      return '';
    }

    const createdTime = new Date(createdAt);

    const elapsedTime = this.now.getTime() - createdTime.getTime();
    const milisec = 1000;
    const min = 60 * 1000;
    const hour = 60 * min;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (elapsedTime < min) {
      return `comment ${Math.floor(elapsedTime / milisec)} seconds ago`;
    }

    if (elapsedTime < hour) {
      return `comment ${Math.floor(elapsedTime / min)} minutes ago`;
    }

    if (elapsedTime < day) {
      return `comment ${Math.floor(elapsedTime / hour)} hours ago`;
    }

    if (elapsedTime < month) {
      return `comment ${Math.floor(elapsedTime / day)} days ago`;
    }

    if (elapsedTime < year) {
      return `comment ${Math.floor(elapsedTime / month)} month ago`;
    }

    return `comment ${Math.floor(elapsedTime / year)} years ago`;
  }

}
