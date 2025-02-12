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
  chart!: Chart
  @Input() questionnaireId!: string;


  constructor(private questionnaireService: QuestionnaireService) {}

  ngAfterViewInit() {
    this.questionnaireService.getStats(this.questionnaireId).subscribe(data => {
      this.renderChart(data);
    });
  }

  private renderChart(data: any) {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: '回答数量',
          data: data.values
        }]
      }
    });
  }
}