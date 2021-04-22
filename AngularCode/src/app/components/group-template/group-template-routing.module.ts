import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupTemplateComponent } from './group-template.component';

const routes: Routes = [
  {
    path: '',
    component: GroupTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupTemplateRoutingModule { }
