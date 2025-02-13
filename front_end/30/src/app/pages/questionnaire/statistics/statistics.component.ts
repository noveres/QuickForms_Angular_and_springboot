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
import { BaseChartDirective } from 'ng2-charts';

import { StatisticsService } from '../../../shared/@services/statistics.service';
import { StatisticsProcessor } from '../../../shared/@services/StatisticsProcessor';
import { StatisticsPageData } from '../../../shared/@interface/StatisticsPageData';
import { QuestionStatistics } from '../../../shared/@interface/statistics.models';

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
    BaseChartDirective
  ]
})
export class StatisticsComponent implements OnInit {
  questionnaireId!: number;
  statistics?: StatisticsPageData;
  loading = true;
  error = '';

  // 圖表選項
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private route: ActivatedRoute,
    private statisticsService: StatisticsService,
    private statisticsProcessor: StatisticsProcessor
  ) {}

  ngOnInit(): void {
    this.questionnaireId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStatistics();
  }

  async loadStatistics(): Promise<void> {
    try {
      this.loading = true;
      this.statistics = await this.statisticsService.getQuestionnaireStatistics(this.questionnaireId);
      this.loading = false;
    } catch (error) {
      this.error = '載入統計數據失敗';
      this.loading = false;
      console.error('Error loading statistics:', error);
    }
  }

  // 導出Excel
  async exportToExcel(): Promise<void> {
    try {
      const blob = await this.statisticsService.exportToExcel(this.questionnaireId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `questionnaire-statistics-${this.questionnaireId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  }

  // 獲取問題的圖表數據
  getChartData(statistics: QuestionStatistics): any {
    if (statistics.type === 'choice') {
      return {
        labels: Object.keys(statistics.choices || {}),
        datasets: [{
          data: Object.values(statistics.choices || {}),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }]
      };
    } else if (statistics.type === 'rating') {
      const ratings = statistics.ratings || {};
      return {
        labels: Object.keys(ratings),
        datasets: [{
          label: '評分分布',
          data: Object.values(ratings),
          backgroundColor: '#36A2EB'
        }]
      };
    }
    return null;
  }

  // 計算完成率
  getCompletionRate(): string {
    if (!this.statistics?.overview) return '0%';
    const { totalResponses, completedResponses } = this.statistics.overview;
    if (!totalResponses) return '0%';
    return `${Math.round((completedResponses / totalResponses) * 100)}%`;
  }

  // 獲取平均完成時間
  getAverageCompletionTime(): string {
    if (!this.statistics?.overview?.averageCompletionTime) return '0分鐘';
    const minutes = Math.round(this.statistics.overview.averageCompletionTime / 60);
    return `${minutes}分鐘`;
  }
}
