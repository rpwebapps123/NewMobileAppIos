import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { StatsCurrentDataComponent } from './stats-current-data';

@NgModule({
  declarations: [
    StatsCurrentDataComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    StatsCurrentDataComponent
  ]
})
export class StatsCurrentDataComponentModule {}
