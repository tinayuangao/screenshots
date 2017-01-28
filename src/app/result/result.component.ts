import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    console.log(this._filename);
    this._filename = filename;
    this.testName = filename.replace('.screenshot.png', '').replace('_', ' ');
    this.service.testRef(this.prNumber).child(this._filename).getDownloadURL()
      .then((url) => {
        console.log(url);
        this.testImageUrl = url;
        this._changeDetectorRef.markForCheck();
      });
    this.service.diffRef(this.prNumber).child(this._filename).getDownloadURL()
      .then((url) => {
        console.log(url);
        this.diffImageUrl = url;
        this._changeDetectorRef.markForCheck();
      });
    this.service.goldRef(this.prNumber).child(this._filename).getDownloadURL()
      .then((url) => {
        console.log(url);
        this.goldImageUrl = url;
        this._changeDetectorRef.markForCheck();
      });
    this.service.getTestResult(this._filename.replace('.screenshot.png', ''), this.prNumber)
      .then((result) => {
        console.log(result);
        this.result = result ? 'Passed' : 'Failed';
        this._changeDetectorRef.markForCheck();
      });
  }

  constructor(public service: FirebaseService, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
