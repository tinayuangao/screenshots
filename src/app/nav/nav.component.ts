import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../firebase.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  email: string;
  signedIn: boolean = false;

  get noGithubToken() {
    return !this._service.githubToken;
  }

  constructor(private _service: FirebaseService) { }

  ngOnInit() {
    this._service.authStateChange((user) => {
      if (user && user.email) {
        this.email = user.email;
        this.signedIn = true;
        if (!this._service.githubToken) {
          this.signInGithub();
        }
      }
    });
    this._service.signedInGithub();
  }

  signInGithub() {
    this._service.signInGithubRedirect();
  }
}
