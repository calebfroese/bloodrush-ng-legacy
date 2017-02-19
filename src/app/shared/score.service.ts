import { Injectable } from '@angular/core';

@Injectable()
export class ScoreService {
    public calculateRatio(teamScore: any): number {
        if (!teamScore.w) teamScore.w = 0;
        if (!teamScore.t) teamScore.t = 0;
        if (!teamScore.l) return (teamScore.w + (teamScore.t / 2));
        return (teamScore.w + (teamScore.t / 2) / teamScore.l).toFixed(2);
    }

    public calculatePoints(teamScore: any): number {
        if (!teamScore.w) teamScore.w = 0;
        if (!teamScore.t) teamScore.t = 0;

        return (teamScore.w * 2) + teamScore.t;
    }
}