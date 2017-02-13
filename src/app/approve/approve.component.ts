import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {FirebaseService} from '../firebase.service';


@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveComponent implements OnInit {

  hasPermission: boolean = false;
  approved: boolean = false;

  @Input()
  prNumber: string;

  constructor(private _service: FirebaseService,
              private _changeDetector: ChangeDetectorRef,
              public snackBar: MdSnackBar) {
    this._service.hasApprovalPermission().then((hasPermission) => {
      this.hasPermission = hasPermission;
      this._changeDetector.markForCheck();
    });
  }

  approve() {
    this._service.approveByUser().then((result) => {
      if (result) {
        this.snackBar.open(`Approved`, '', {duration: 10000});
      }
      this.approved = result;
      this._changeDetector.markForCheck();
    });
  }

  restartTravis() {
    this._service.restartTravisJob('');
  }

  ngOnInit() {
  }

}
