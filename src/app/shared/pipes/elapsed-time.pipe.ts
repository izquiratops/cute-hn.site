import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elapsedTime'
})
export class ElapsedTimePipe implements PipeTransform {

  transform(timestamp: number): string {
    const now = Date.now() / 1000; // timestamp is given in seconds
    const seconds = Math.abs(now - timestamp );
    const minutes = Math.trunc(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) {
      return `${days} days ago`;
    } else if (days === 1) {
      return `${days} day ago`;
    } else if (hours > 1) {
      return `${hours} hours ago`;
    } else if (hours === 1) {
      return `${hours} hour ago`;
    } else {
      return `${minutes} minutes ago`;
    }
  }
}
