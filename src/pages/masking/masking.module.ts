import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaskingPage } from './masking';

@NgModule({
  declarations: [
    MaskingPage,
  ],
  imports: [
    IonicPageModule.forChild(MaskingPage),
  ],
})
export class MaskingPageModule {}
