import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirebaseService} from '../firebase.service';


@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {

  @Input()
  prNumber: string;

  constructor(private _service: FirebaseService,
              private _route: ActivatedRoute,) {
    
  }

  ngOnInit() {
  }

}
