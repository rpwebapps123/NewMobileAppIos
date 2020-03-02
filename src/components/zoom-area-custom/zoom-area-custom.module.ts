import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ZoomAreaCustomComponent } from './zoom-area-custom.component';
import { ZoomAreaCustomProvider } from './zoom-area-custom.provider';

@NgModule({
  declarations: [
    ZoomAreaCustomComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ZoomAreaCustomComponent
  ],
  providers: [
    ZoomAreaCustomProvider
  ]
})
export class ZoomAreaCustomModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZoomAreaCustomModule,
      providers: [
        ZoomAreaCustomProvider
      ]
    };
  }
}