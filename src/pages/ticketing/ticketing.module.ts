import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketingPage } from './ticketing';

@NgModule({
  declarations: [
    TicketingPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketingPage),
  ],
})
export class TicketingPageModule {}
