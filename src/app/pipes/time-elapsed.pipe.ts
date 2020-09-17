import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeElapsed',
})
export class TimeElapsedPipe implements PipeTransform {
  transform(date: any, ...args: any[]): any {
    const msElapsed = Date.now() - date;

    // Some sources say there are 31556952000 ms in a year
    // 31536000000 was used originally on ScatterSchool...
    // Have not verified because dang I spent too much time on it already
    const msYear = 31536000000;
    const ms10Year = msYear * 10;
    const msMonth = 2592000000;
    const ms10Month = msMonth * 10;
    const msWeek = 6048000000;
    const msDay = 86400000;
    const ms10Day = msDay * 10;
    const msHour = 3600000;
    const ms10Hour = msHour * 10;
    const msMinute = 60000;
    const ms10Minute = msMinute * 10;

    console.log(msElapsed);
    return msElapsed >= ms10Year
      ? `${Math.floor(msElapsed / msYear)} years ago`
      : msElapsed >= msYear
      ? `${(msElapsed / msYear).toFixed(1)} years ago`
      : msElapsed >= ms10Month
      ? `${Math.floor(msElapsed / msMonth)} months ago`
      : msElapsed >= msMonth
      ? `${(msElapsed / msMonth).toFixed(1)} months ago`
      : msElapsed >= msWeek
      ? `${(msElapsed / msWeek).toFixed(1)} weeks ago`
      : msElapsed >= ms10Day
      ? `${Math.floor(msElapsed / msDay)} days ago`
      : msElapsed >= msDay
      ? `${(msElapsed / msDay).toFixed(1)} days ago`
      : msElapsed >= ms10Hour
      ? `${Math.floor(msElapsed / msHour)} hours ago`
      : msElapsed >= msHour
      ? `${(msElapsed / msHour).toFixed(1)} hours ago`
      : msElapsed >= ms10Minute
      ? `${Math.floor(msElapsed / msMinute)} minutes ago`
      : msElapsed >= msMinute
      ? `${(msElapsed / msMinute).toFixed(1)} minutes ago`
      : 'just now';
  }
}
