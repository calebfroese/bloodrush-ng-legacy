import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './game-detail.component.html'
})
export class GameDetailComponent implements OnInit {
    isBye: boolean = false;
    nonByeTeam: string; // index of the team that is not null
    game: any;
    gameId: number;
    season: any;

    // Canvas
    canvasSize: number = 600;
    @ViewChild('gameCanvas') gameCanvas: ElementRef;
    context: any;
    x: number = 0;
    y: number = 0;
    charX: number;
    charY: number;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mongo: MongoService
    ) {

    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            // Fetch the season
            let seasonNumber: number = +params['seasonNumber'];
            let gameId: number = +params['gameId'];
            this.gameId = gameId;
            this.mongo.run('seasons', 'oneByNumber', { number: seasonNumber }).then(season => {
                this.season = season;
                if (season) {
                    if (season.games[gameId]) this.game = season.games[gameId];
                    // Load the teams
                    this.mongo.run('teams', 'oneById', { _id: this.game.home }).then(teamHome => {
                        this.game.home = teamHome;
                        return this.mongo.run('teams', 'oneById', { _id: this.game.away });
                    }).then(awayTeam => {
                        this.game.away = awayTeam;
                        this.playGame(this.season.games[gameId].game);
                    }).catch(err => {
                        debugger;
                    });
                } else {
                    debugger;
                }
            }).catch(err => {
                debugger;
            });
        });
    }

    calculateBye(x): void {
        if (!this.game['home']) {
            this.nonByeTeam = 'home';
        } else {
            this.nonByeTeam = 'away';
        }
    }

    // CANVAS
    playGame(game: any): void {
        this.initCanvas();
    }

    images = {};

    totalResources = 6;
    numResourcesLoaded = 0;
    fps = 30;

    resourceLoaded() {

        this.numResourcesLoaded++;
        if (this.numResourcesLoaded === this.totalResources) {
            setInterval(this.redraw, 1000 / this.fps);
        }
    }

    initCanvas(): void {
        this.context = CanvasRenderingContext2D = this.gameCanvas.nativeElement.getContext('2d');
        let imageObj = new Image();

        imageObj.onload = () => {
            this.context.drawImage(imageObj, 69, 50);
        };
        imageObj.src = '/assets/char.png';
        // happy drawing from here on
        // this.context.drawImage(this.images["char"], 0, 0);
        // this.context.drawImage(this.images["torso"], this.x, this.y - 50);
        // this.context.drawImage(this.images["rightArm"], this.x - 15, this.y - 42);
        // this.context.drawImage(this.images["head"], this.x - 10, this.y - 125);
        // this.context.drawImage(this.images["hair"], this.x - 37, this.y - 138);
    }

    redraw() {
        // this.context.drawImage(this.images["char"], this.x, this.y);
        // this.x = this.charX;
        // this.y = this.charY;
        // this.gameCanvas.nativeElement.width = this.gameCanvas.nativeElement.width;
        // this.context.drawImage(this.images["leftArm"], this.x + 40, this.y - 42);
        // this.context.drawImage(this.images["legs"], this.x, this.y);
        // this.context.drawImage(this.images["torso"], this.x, this.y - 50);
        // this.context.drawImage(this.images["rightArm"], this.x - 15, this.y - 42);
        // this.context.drawImage(this.images["head"], this.x - 10, this.y - 125);
        // this.context.drawImage(this.images["hair"], this.x - 37, this.y - 138);
    }
}
