import { Component } from '@angular/core';
import {FirebaseService} from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  prNumber = '2774';
  filenames: string[];

  constructor(service: FirebaseService) {
    service.getFilenames().then((filenames) => {
      console.log(filenames);
      this.filenames = filenames
    });
  }
}
