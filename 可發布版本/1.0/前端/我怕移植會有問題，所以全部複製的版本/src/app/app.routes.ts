// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
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
    path: '**',
    redirectTo: 'home'
  }
];