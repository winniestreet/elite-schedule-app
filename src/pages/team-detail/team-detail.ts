import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GamePage } from '../pages';
import * as _ from 'lodash';
import * as moment from 'moment';

import { EliteApi } from '../../app/shared/shared';

@Component({
  selector: 'page-team-detail',
  templateUrl: 'team-detail.html'
})
export class TeamDetailPage {
    allGames: any[];
    dateFilter: string;
    games: any;
    team: any = {};
    teamStanding: any =[];
    private tourneyData: any;
    useDateFilter: false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private eliteApi: EliteApi) { }


  goHome(){
    //   this.navCtrl.push(MyTeamsPage);
    // this.navCtrl.popToRoot
    console.log("**parent", this.navCtrl.parent);
    this.navCtrl.parent.parent.popToRoot();
    //first parent is tabs page, second parent is overall root of app
  }

  ionViewDidLoad(){
      this.team = this.navParams.data;
      this.tourneyData = this.eliteApi.getCurrentTourney();
      this.games = _.chain(this.tourneyData.games)
                    .filter(g => g.team1Id === this.team.id || g.team2Id === this.team.id)
                    .map(g => {
                        let isTeam1 = (g.team1Id === this.team.id);
                        let opponentName = isTeam1 ? g.team2 : g.team1;
                        let scoreDisplay = this.getScoreDisplay(isTeam1, g.team1Score, g.team2Score)
                        return {
                            gameId: g.id,
                            opponent: opponentName,
                            time: Date.parse(g.time),
                            location: g.location,
                            locationUrl: g.locationUrl,
                            scoreDisplay: scoreDisplay,
                            homeAway: (isTeam1 ? "vs." : "at")
                        };
                    })
                    .value();
    this.allGames = this.games;
    this.teamStanding = _.find(this.tourneyData.standings, { 'teamId': this.team.id});
    console.log(this.teamStanding);
  }

  getScoreDisplay(isTeam1, team1Score, team2Score){
      if (team1Score && team2Score) {
          var teamScore = (isTeam1 ? team1Score : team2Score);
          var opponentScore = (isTeam1 ? team2Score : team1Score);
          var winIndicatior = teamScore > opponentScore ? "W: " : "L: ";
          return winIndicatior + teamScore + "_" + opponentScore;
      }
      else {
          return "";
      }
  }

  getScoreWorL(game){
      return game.scoreDisplay ? game.scoreDisplay[0] : '';
  }

  getScoreDisplayBadgeClass(game) {
      return game.scoreDisplay.indexOf('W:') === 0 ? 'primary' : 'danger';
  }

  gameClicked($event, game) {
      let sourceGame = this.tourneyData.games.find(g => g.id === game.gameId);
      console.log(sourceGame);
      this.navCtrl.parent.parent.push(GamePage, sourceGame);
  }

  dateChanged(){
      if (this.useDateFilter) {
          this.games = _.filter(this.allGames, g => moment(g.time).isSame(this.dateFilter, 'day'));
      } else {
          this.games = this.allGames;
      }
  }
}
