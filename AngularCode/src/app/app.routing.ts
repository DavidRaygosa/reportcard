import { Routes, RouterModule } from '@angular/router';
//Routes
import { IndexComponent } from './components/index/index.component';
import { UserGuardGuard } from './user-guard.guard';
const routes: Routes = [
    {
      path: '',
      component: IndexComponent,
      canActivate: [UserGuardGuard]
    },
    {
        path: 'profesores',
        loadChildren: () => import('./components/teachers/teachers.module').then(m => m.TeachersModule),
        canActivate: [UserGuardGuard]
    },
    {
        path: 'grupos',
        loadChildren: () => import('./components/groups/groups.module').then(m => m.GroupsModule),
        canActivate: [UserGuardGuard]
    },
    {
        path: 'orientadores',
        loadChildren: () => import('./components/counselor/counselor.module').then(m => m.CounselorModule),
        canActivate: [UserGuardGuard]
    },
    {
        path: 'grupo/:id',
        loadChildren: () => import('./components/group-template/group-template.module').then(m => m.GroupTemplateModule),
        canActivate: [UserGuardGuard]
    },
    {
        path: 'reportes',
        loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [UserGuardGuard]
    },
    {
        path: 'ajustes',
        loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule),
        canActivate: [UserGuardGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
    },
    {  path: '**', redirectTo: '' },
  ];

    export const appRoutingProviders: any[] = [];
    export const routing  = RouterModule.forRoot(routes);