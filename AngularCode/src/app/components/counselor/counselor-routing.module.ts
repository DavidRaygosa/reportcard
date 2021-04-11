import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounselorComponent } from './counselor.component';

const routes: Routes = [
  {
    path: '',
    component: CounselorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounselorRoutingModule { }
