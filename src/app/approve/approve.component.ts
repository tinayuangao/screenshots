import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {FirebaseService} from '../firebase.service';


@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveComponent {
  constructor(private _service: FirebaseService,
              public snackBar: MdSnackBar) {}

  approve() {
    this._service.approvePR().then((result) => {
      this.snackBar.open(`Approved`, '', {duration: 10000});
    }).catch((error) => {
      this.snackBar.open(`Error ${error}`, '', {duration: 10000});
    });
  }
}
