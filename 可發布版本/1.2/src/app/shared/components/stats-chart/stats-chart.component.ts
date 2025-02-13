import { AfterViewInit, Component, ViewChild, ElementRef, Input } from '@angular/core';
import { QuestionnaireService } from '../../@services/questionnaire.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-stats-chart',
  imports: [],
  templateUrl: './stats-chart.component.html',
  styleUrl: './stats-chart.component.scss'
})
export class StatsChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') canvas!: ElementRef;
  chart!: Chart;
  @Input() set questionnaireId(value: string | number) {
    this._questionnaireId = typeof value === 'string' ? parseInt(value, 10) : value;
  }
  get questionnaireId(): number {
    return this._questionnaireId;
  }
  private _questionnaireId!: number;

  constructor(private questionnaireService: QuestionnaireService) {}

  ngAfterViewInit() {
    if (this.questionnaireId) {
      this.questionnaireService.getStats(this.questionnaireId).subscribe(data => {
        this.renderChart(data);
      });
    }
  }

  private renderChart(data: any) {
    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: '回答數量',
          data: data.values,
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
        }
      }
    });
  }
}