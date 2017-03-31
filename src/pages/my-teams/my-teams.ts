import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';

import { TournamentsPage, TeamHomePage } from '../pages';
import { EliteApi } from '../../app/shared/shared';

@Component({
  selector: 'page-my-teams',
  templateUrl: 'my-teams.html'
})
export class MyTeamsPage {

    favourites = [
        {
            team: { id: 6182, name: 'HC Elite 7th', coach: 'Michelotti'},
            tournamentId: '89e13aa2-ba6d-4f55-9cc2-61eba6172c63',
            tournamentName: 'March Madness Tournament'
        },
        {
            team: { id: 805, name: 'HC Elite', coach: 'Michelotti'},
            tournamentId: '98c6857e-b0d1-4295-b89e-2d95a45437f2',
            tournamentName: 'Holiday Hoops Challenge'
        }

    ]

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private eliteApi: EliteApi,
              private loadingController: LoadingController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTeamsPage');
  }

  favouriteTapped($event, favourite){
      let loader = this.loadingController.create({
          content: 'Getting data...',
          dismissOnPageChange: true
      });
      loader.present();
      this.eliteApi.getTournamentData(favourite.tournamentId)
          .subscribe(t => this.navCtrl.push(TeamHomePage, favourite.team));
  }

  goToTournaments() {
      this.navCtrl.push(TournamentsPage);
  }

}
