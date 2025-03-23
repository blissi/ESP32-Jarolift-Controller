import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPageComponent } from './control-page/control-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ChannelComponent } from './channel/channel.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {path: "", component: ControlPageComponent }
];

@NgModule({
  declarations: [ChannelComponent, ControlPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  exports: [ChannelComponent]
})
export class ControlModule { }
