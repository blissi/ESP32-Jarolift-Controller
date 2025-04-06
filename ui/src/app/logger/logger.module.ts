import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoggerPageComponent } from './logger-page/logger-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { SendDataDirective } from '../send-data.directive';

const routes: Routes = [
  {path: "", component: LoggerPageComponent }
];

@NgModule({
  declarations: [LoggerPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SendDataDirective
  ]
})
export class LoggerModule { }
