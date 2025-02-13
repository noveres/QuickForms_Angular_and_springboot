import { Injectable } from '@angular/core';
import { 
    QuestionAnswer, 
    ChoiceStatistics, 
    RatingStatistics, 
    TextStatistics,
    WordCloudItem,
    CommonPhrase
} from '../@interface/statistics.models';

@Injectable({
    providedIn: 'root'
})
export class StatisticsProcessor {
    // 處理選擇題統計
    processChoiceQuestion(answers: QuestionAnswer[]): ChoiceStatistics {
        const counts: { [key: string]: number } = {};
        answers.forEach(answer => {
            if (Array.isArray(answer.answerValue)) {
                // 處理多選題
                answer.answerValue.forEach(value => {
                    counts[value] = (counts[value] || 0) + 1;
                });
            } else {
                // 處理單選題
                counts[answer.answerValue] = (counts[answer.answerValue] || 0) + 1;
            }
        });

        const percentages = this.calculatePercentages(counts, answers.length);

        return {
            totalResponses: answers.length,
            counts,
            percentages
        };
    }

    // 處理評分題統計
    processRatingQuestion(answers: QuestionAnswer[]): RatingStatistics {
        const values = answers.map(a => Number(a.answerValue)).filter(v => !isNaN(v));
        const average = this.calculateAverage(values);
        const distribution = this.calculateDistribution(values);

        return {
            totalResponses: answers.length,
            average,
            distribution
        };
    }

    // 處理文本答案統計
    processTextQuestion(answers: QuestionAnswer[]): TextStatistics {
        const texts = answers.map(a => a.answerValue).filter(v => typeof v === 'string');
        
        return {
            totalResponses: answers.length,
            wordCloud: this.generateWordCloud(texts),
            commonPhrases: this.findCommonPhrases(texts)
        };
    }

    // 計算百分比
    private calculatePercentages(counts: { [key: string]: number }, total: number): { [key: string]: number } {
        const percentages: { [key: string]: number } = {};
        Object.keys(counts).forEach(key => {
            percentages[key] = (counts[key] / total) * 100;
        });
        return percentages;
    }

    // 計算平均值
    private calculateAverage(values: number[]): number {
        if (values.length === 0) return 0;
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    // 計算分布
    private calculateDistribution(values: number[]): { [key: string]: number } {
        const distribution: { [key: string]: number } = {};
        values.forEach(value => {
            distribution[value] = (distribution[value] || 0) + 1;
        });
        return distribution;
    }

    // 生成詞雲數據
    private generateWordCloud(texts: string[]): WordCloudItem[] {
        const wordCount: { [key: string]: number } = {};
        texts.forEach(text => {
            const words = text.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.length > 2) { // 忽略太短的詞
                    wordCount[word] = (wordCount[word] || 0) + 1;
                }
            });
        });

        return Object.entries(wordCount)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 50); // 只返回前50個最常用的詞
    }

    // 查找常見短語
    private findCommonPhrases(texts: string[]): CommonPhrase[] {
        const phraseCount: { [key: string]: number } = {};
        const minPhraseLength = 3;
        const maxPhraseLength = 5;

        texts.forEach(text => {
            const words = text.toLowerCase().split(/\s+/);
            for (let len = minPhraseLength; len <= maxPhraseLength; len++) {
                for (let i = 0; i <= words.length - len; i++) {
                    const phrase = words.slice(i, i + len).join(' ');
                    phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
                }
            }
        });

        return Object.entries(phraseCount)
            .map(([phrase, count]) => ({ phrase, count }))
            .filter(item => item.count > 1) // 只保留出現超過一次的短語
            .sort((a, b) => b.count - a.count)
            .slice(0, 20); // 只返回前20個最常見的短語
    }
}