// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 公開路由
  {
    path: 'login',
    component: LoginComponent
  },
  
  // 需要驗證的路由
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/questionnaire/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'questionnaires',
        loadChildren: () => [
          {
            path: 'list',
            loadComponent: () => import('./pages/questionnaire/list/list.component')
              .then(m => m.QuestionnaireListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./pages/questionnaire/form/questionnaire-form.component')
              .then(m => m.QuestionnaireFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/questionnaire/form/questionnaire-form.component')
              .then(m => m.QuestionnaireFormComponent)
          },
          {
            path: 'answer/:id',
            loadComponent: () => import('./pages/questionnaire/answer/questionnaire-answer.component')
              .then(m => m.QuestionnaireAnswerComponent)
          },
          {
            path: 'statistics/:id',
            loadComponent: () => import('./pages/questionnaire/statistics/statistics.component')
              .then(m => m.StatisticsComponent)
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component')
          .then(m => m.ProfileComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/support/support.component')
          .then(m => m.SupportComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // 萬用路由 - 必須放在最後
  {
    path: '**',
    redirectTo: 'home'
  }
];