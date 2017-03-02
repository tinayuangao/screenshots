import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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



  @Input() collapse: boolean = true;
  @Input() prNumber: string;

  @Input()
  get mode() {
    return this._mode;
  }
  set mode(value: 'flip' | 'side' | 'diff') {
    this._mode = value;
    this.modeEvent.emit(value);
    this._changeDetectorRef.markForCheck();
  }

  _mode: 'flip' | 'side' | 'diff' = 'diff';


  _flipping: boolean = false;

  @Output('flippingChange') flippingEvent = new EventEmitter<boolean>();

  @Output('modeChange') modeEvent = new EventEmitter<'flip' | 'side' | 'diff'>();

  @Output('collapseChange') collapseEvent = new EventEmitter<boolean>();

  @Input()
  get flipping() {
    return this._flipping;
  }

  set flipping(value: boolean) {
    this._flipping = value;
    this.flippingEvent.emit(value);
    this._changeDetectorRef.markForCheck();
  }

  @Input()
  get filename() {
    return this._filename;
  }

  set filename(filename: string) {
    this._filename = filename;
    this.testName = filename.replace('.screenshot.png', '').replace('_', ' ');
    this.service.testRef(/*this.prNumber*/).child(this._filename).getDownloadURL()
      .then((url) => {
        this.testImageUrl = url;
        this._changeDetectorRef.markForCheck();
      });
    this.service.diffRef(/*this.prNumber*/).child(this._filename).getDownloadURL()
      .then((url) => {
        this.diffImageUrl = url;
        this._changeDetectorRef.markForCheck();
      });
    this.service.goldRef(/*this.prNumber*/).child(this._filename).getDownloadURL()
      .then((url) => {
        this.goldImageUrl = url;
        this._changeDetectorRef.markForCheck();
      });
    this.service.getTestResult(this._filename.replace('.screenshot.png', '')/*, this.prNumber*/)
      .then((result) => {
        this.collapse = result;
        this.result = result ? 'Passed' : 'Failed';
        this._changeDetectorRef.markForCheck();
      });
  }

  constructor(public service: FirebaseService, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  flip() {
    this.flipping = !this._flipping;
  }
}
