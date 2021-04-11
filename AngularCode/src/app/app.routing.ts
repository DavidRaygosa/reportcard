import { Routes, RouterModule } from '@angular/router';
//Routes
import { IndexComponent } from './components/index/index.component';
const routes: Routes = [
    {
      path: '',
      component: IndexComponent
    },
    {
        path: 'profesores',
        loadChildren: () => import('./components/teachers/teachers.module').then(m => m.TeachersModule)
    },
    {
        path: 'grupos',
        loadChildren: () => import('./components/groups/groups.module').then(m => m.GroupsModule)
    },
    {
        path: 'orientadores',
        loadChildren: () => import('./components/counselor/counselor.module').then(m => m.CounselorModule)
    },
    {
        path: 'grupo/:id',
        loadChildren: () => import('./components/group-template/group-template.module').then(m => m.GroupTemplateModule)
    },
    {
        path: 'reportes',
        loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule)
    },
    {
        path: 'ajustes',
        loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule)
    },
    {  path: '**', redirectTo: '' },
  ];

    export const appRoutingProviders: any[] = [];
    export const routing  = RouterModule.forRoot(routes);