import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';

import { TeamsPage } from '../pages';
import { EliteApi } from '../../app/shared/shared';

@Component({
  selector: 'page-tournaments',
  templateUrl: 'tournaments.html'
})
export class TournamentsPage {

    tournaments: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private eliteApi: EliteApi,
              private loadingController: LoadingController) {}

  itemTapped($event, tourney){
      this.navCtrl.push(TeamsPage, tourney);
  }

  ionViewDidLoad(){
      let loader = this.loadingController.create({
          content: 'Getting tournaments...'
        //   spinner: 'dots'
      });

      loader.present().then(() => {
          this.eliteApi.getTournaments().then(data => {
              this.tournaments = data
              loader.dismiss();
          });
      })

  }


}
