import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Chart } from 'chart.js/auto';
import { NgChartsModule } from 'ng2-charts';

import { TemplateService, QuestionnaireStatistics } from '../../../shared/@services/template.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    NgChartsModule
  ]
})
export class StatisticsComponent implements OnInit {
  statistics: QuestionnaireStatistics | null = null;
  charts: { [key: number]: Chart } = {};

  constructor(
    private route: ActivatedRoute,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadStatistics(id);
      }
    });
  }

  loadStatistics(id: number): void {
    this.templateService.getQuestionnaireStatistics(id).subscribe({
      next: (data) => {
        this.statistics = data;
        setTimeout(() => {
          this.createCharts();
        });
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  createCharts(): void {
    if (!this.statistics) return;

    this.statistics.questionStatistics.forEach(question => {
      const canvasElement = document.getElementById(`chart-${question.questionId}`) as HTMLCanvasElement;
      if (!canvasElement) return;

      const ctx = canvasElement.getContext('2d');
      if (!ctx) return;

      // 如果已存在圖表，先銷毀它
      if (this.charts[question.questionId]) {
        this.charts[question.questionId].destroy();
      }

      const labels = Object.keys(question.optionDistribution);
      const data = Object.values(question.optionDistribution);

      this.charts[question.questionId] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '回答數量',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: question.questionText
            }
          }
        }
      });
    });
  }
}
