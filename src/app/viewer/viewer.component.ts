import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MdSnackBar} from '@angular/material';
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
  _travis: string;

  flipping: boolean = false;

  hasPermission: boolean;

  @Input() mode: string = 'diff';

  @Input() collapse: boolean = false;

  get githubToken() {
    return this._service.githubToken;
  }

  @Input()
  get prNumber(): string {
    return this._prNumber;
  };

  set prNumber(prNumber: string) {
    this._prNumber = prNumber;
    this._service.prNumber = prNumber;

    this._service.getCommit().then((sha) => {
      this._sha = sha;
      this._service.sha = sha;
      this._changeDetectorRef.markForCheck();
    });

    this._service.getTravisJobId().then((travis) => {
      this._travis = travis;
      this._changeDetectorRef.markForCheck();
    });

    // TODO(tinagao): Get a list of files
    this._service.getFilenames().then((filenames) => {
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

  get travisLink() {
    return `https://travis-ci.org/angular/material2/jobs/${this._travis}`;
  }

  constructor(private _service: FirebaseService,
              private _route: ActivatedRoute,
              private _changeDetectorRef: ChangeDetectorRef,
              public snackBar: MdSnackBar) {
    _route.params.subscribe(p => {
      this.prNumber = p['id'];
    });

    this._service.hasApprovalPermission().then((result) => {
      this.hasPermission = result;
    });
  }

  updateGithubStatus(status: string) {
    this._service.updateGithubStatus(status).then((code) => {
      if (code == 201) {
        this.snackBar.open(`Update to ${status} succeed.`, '', {duration: 2000});
      } else {
        this.snackBar.open(`Update failed ${code}`, '', {duration: 2000});
      }
    })
  }

  ngOnInit() {
  }
}
