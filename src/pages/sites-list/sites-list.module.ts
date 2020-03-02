import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SitesListPage } from './sites-list';

@NgModule({
  declarations: [
    SitesListPage,
  ],
  imports: [
    IonicPageModule.forChild(SitesListPage),
  ],
})
export class SitesListPageModule {}
