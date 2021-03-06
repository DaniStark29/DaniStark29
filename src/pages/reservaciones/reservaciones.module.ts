import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservacionesPage } from './reservaciones';
import { AgmCoreModule } from '@agm/core';
import { ZoomAreaModule } from 'ionic2-zoom-area';

@NgModule({
  declarations: [
    ReservacionesPage,
  ],
  imports: [
    ZoomAreaModule.forRoot(),
    IonicPageModule.forChild(ReservacionesPage),
    AgmCoreModule
  ],
})
export class ReservacionesPageModule {}
