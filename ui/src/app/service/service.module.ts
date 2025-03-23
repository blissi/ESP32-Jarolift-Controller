import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ServicePageComponent } from './service-page/service-page.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {path: "", component: ServicePageComponent }
];

@NgModule({
  declarations: [ServicePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ]
})
export class ServiceModule { }
