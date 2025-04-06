import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GroupPageComponent } from './group-page/group-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { GroupComponent } from './group/group.component';

const routes: Routes = [
  {path: "", component: GroupPageComponent }
];

@NgModule({
  declarations: [
    GroupPageComponent,
    GroupComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ]
})
export class GroupModule { }
