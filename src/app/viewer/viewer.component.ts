import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnInit {

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

    this.service.getCommit(prNumber).then((sha) => {
      this._sha = sha;
      this._changeDetectorRef.markForCheck();
    });

    this.service.getFilenames().then((filenames) => {
      let files = [];
      filenames.forEach((file) => {
        files.push(file);
      });
      this.filenames = files;
      this._changeDetectorRef.markForCheck();
    });
  }

  get prLink() {
    return `https://github.com/angular/material2/pull/${this.prNumber}`;
  }

  get commitLink() {
    return `https://github.com/angular/material2/commit/${this._sha}`;
  }

  constructor(public service: FirebaseService,
              private _route: ActivatedRoute,
              private _changeDetectorRef: ChangeDetectorRef) {
    _route.params.subscribe(p => {
      this.prNumber = p['id'];
    });
  }

  ngOnInit() {
  }

}
