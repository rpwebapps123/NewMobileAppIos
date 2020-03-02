import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';

@Pipe({name: 'timeZonePipe'})
export class TimeZonePipe implements PipeTransform {
  transform(value: string,timeZoneName: string): string {
     
    var dateTime = moment.tz(value,"America/Chicago");
    var convertedDateTime = dateTime.tz(this.getTimeZoneName(timeZoneName).name).format("YYYY-MM-DD HH:mm:ss");

    return convertedDateTime + " (" + timeZoneName + ")";
  }


  private getTimeZoneName(timeZone: string) {
       /*
           Provigil Time Zones

           CT - UTC–06:00 Central Daylight Time (America/Chicago)
           ET - UTC–05:00 Eastern Daylight Time (America/New_York)
           MT -UTC–06:00 Mountain Daylight Time (America/Denver)
           MT-AZ - UTC–07:00 Mountain Standard Time (America/Phoenix)
           PT - UTC–07:00 Pacific Daylight Time ()
           BST - UTC+01:00 British Summer Time (Europe/London)
           HT - UTC–10:00 Hawaii-Aleutian Standard Time (Pacific/Honolulu)
           */
        switch (timeZone) {
            case 'CT': {
                return ({ name: 'America/Chicago', offset: '-06:00' });
            }
            case 'ET': {
                return ({ name: 'America/New_York', offset: '-05:00' });
            }
            case 'MT': {
                return ({ name: 'America/Denver', offset: '-07:00' });
            }
            case 'MT-AZ': {
                return ({ name: 'America/Phoenix', offset: '-07:00' });
            }
            case 'PT': {
                return ({ name: 'America/Los_Angeles', offset: '-08:00' });
            }
            case 'BST': {
                return ({ name: 'Europe/London', offset: '+01:00' });
            }
            case 'HT': {
                return ({ name: 'Pacific/Honolulu', offset: '-10:00' });
            }
        }
    }
}