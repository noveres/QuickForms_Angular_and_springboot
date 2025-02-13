import { Injectable } from '@angular/core';
import { 
    QuestionAnswer, 
    ChoiceStatistics, 
    RatingStatistics, 
    TextAnalysis,
    WordCloudItem,
    CommonPhrase
} from '../@interface/statistics.models';

@Injectable({
    providedIn: 'root'
})
export class StatisticsProcessor {
    // 處理選擇題統計
    processChoiceQuestion(answers: QuestionAnswer[]): ChoiceStatistics {
        const totalResponses = answers.length;
        const counts: { [key: string]: number } = {};
        const percentages: { [key: string]: number } = {};

        // 計算每個選項的數量
        answers.forEach(answer => {
            const value = answer.answerValue;
            counts[value] = (counts[value] || 0) + 1;
        });

        // 計算百分比
        Object.keys(counts).forEach(key => {
            percentages[key] = (counts[key] / totalResponses) * 100;
        });

        return {
            totalResponses,
            counts,
            percentages
        };
    }

    // 處理評分題統計
    processRatingQuestion(answers: QuestionAnswer[]): RatingStatistics {
        const totalResponses = answers.length;
        const values = answers.map(a => Number(a.answerValue));
        const average = values.reduce((a, b) => a + b, 0) / totalResponses;
        const distribution = this.calculateDistribution(values);

        return {
            totalResponses,
            average,
            distribution
        };
    }

    // 處理文本答案統計
    processTextQuestion(answers: QuestionAnswer[]): TextAnalysis {
        const texts = answers.map(a => a.answerValue).filter(v => typeof v === 'string');
        return this.processTextAnswers(texts);
    }

    // 處理文字答案
    private processTextAnswers(answers: string[]): TextAnalysis {
        const wordCounts = new Map<string, number>();
        const phraseCounts = new Map<string, number>();

        answers.forEach(answer => {
          // 計算單詞頻率
          const words = answer.split(/\s+/);
          words.forEach(word => {
            const cleanWord = word.toLowerCase().trim();
            if (cleanWord.length > 2) {
              wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1);
            }
          });

          // 尋找常見短語（3-5個詞）
          for (let i = 0; i < words.length - 2; i++) {
            for (let len = 3; len <= 5 && i + len <= words.length; len++) {
              const phrase = words.slice(i, i + len).join(' ').toLowerCase();
              phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
            }
          }
        });

        // 轉換為詞雲數據
        const wordCloud = Array.from(wordCounts.entries())
          .map(([text, count]) => ({
            text,
            weight: count
          }))
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 50);

        // 轉換為常見短語數據
        const commonPhrases = Array.from(phraseCounts.entries())
          .map(([text, count]) => ({
            text,
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        return {
          wordCloud,
          commonPhrases
        };
    }

    // 計算分布
    private calculateDistribution(values: number[]): { [key: string]: number } {
        const distribution: { [key: string]: number } = {};
        values.forEach(value => {
            const key = value.toString();
            distribution[key] = (distribution[key] || 0) + 1;
        });
        return distribution;
    }
}