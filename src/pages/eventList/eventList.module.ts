import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventListPage } from './eventList';

@NgModule({
  declarations: [
    EventListPage,
  ],
  imports: [
    IonicPageModule.forChild(EventListPage),
  ],
})
export class EventListPageModule {}
