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
        path: 'stats/:id',
        loadComponent: () => import('./shared/components/stats-chart/stats-chart.component')
          .then(m => m.StatsChartComponent)
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