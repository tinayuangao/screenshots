import { Component, OnInit, Input } from '@angular/core';
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

  @Input()
  filenames: string[];

  _prNumber: string;
  _sha: string;

  @Input()
  get prNumber(): string {
    return this._prNumber;
  };

  set prNumber(prNumber: string) {
    console.log(prNumber);
    this._prNumber = prNumber;

    this.service.getCommit(prNumber).then((sha) => this._sha = sha);
  }

  get prLink() {
    return `https://github.com/angular/material2/pull/${this.prNumber}`;
  }

  get commitLink() {
    return `https://github.com/angular/material2/commit/${this._sha}`;
  }

  constructor(public service: FirebaseService) { }

  ngOnInit() {
  }

}
