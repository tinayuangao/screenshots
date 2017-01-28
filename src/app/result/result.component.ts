import { Component, OnInit, Input } from '@angular/core';
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  _filename: string;
  testName: string;
  testImageUrl: string;
  diffImageUrl: string;
  goldImageUrl: string;
  result: string;

  @Input()
  prNumber: string;

  @Input()
  get filename() {
    return this._filename;
  }

  set filename(filename: string) {
    this.filename = filename;
    this.testName = filename.replace('.screenshot.png', '').replace('_', ' ');
    this.service.testRef(this.prNumber).child(this.filename).getDownloadURL()
      .then((url) => this.testImageUrl = url);
    this.service.diffRef(this.prNumber).child(this.filename).getDownloadURL()
      .then((url) => this.diffImageUrl = url);
    this.service.goldRef(this.prNumber).child(this.filename).getDownloadURL()
      .then((url) => this.goldImageUrl = url);
    this.service.getTestResult(this.filename.replace('.screenshot.png', ''), this.prNumber)
      .then((result) => this.result = result);
  }

  constructor(public service: FirebaseService) { }

  ngOnInit() {
  }

}
