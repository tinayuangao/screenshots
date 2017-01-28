import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {

  constructor() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBekh5ZSi1vEhaE2qetH4RU91gHmUmpqgg",
      authDomain: "material2-screenshots.firebaseapp.com",
      databaseURL: "https://material2-screenshots.firebaseio.com",
      storageBucket: "material2-screenshots.appspot.com",
      messagingSenderId: "975527407245"
    };
    firebase.initializeApp(config);
  }

  _storageRef(prNumber: string): firebase.storage.Reference {
    return firebase.storage().ref('screenshots').child(prNumber);
  }

  testRef(prNumber: string): firebase.storage.Reference {
    return this._storageRef(prNumber).child('test');
  }

  diffRef(prNumber: string): firebase.storage.Reference {
    return this._storageRef(prNumber).child('diff');
  }

  goldRef(prNumber: string): firebase.storage.Reference {
    return firebase.storage().ref('golds')
  }

  getTestResult(key: string, prNumber: string): firebase.Promise<any> {
    return firebase.database().ref('screenshot').child('reports').child(prNumber)
      .child('results').child(key).once('value').then((snapshot) => snapshot.val());
  }

  getFilenames(): firebase.Promise<any> {
    return firebase.database().ref('screenshot').child('filenames').once('value')
      .then((snapshot) => snapshot.val());
  }

  getCommit(prNumber: string): firebase.Promise<any> {
    return firebase.database().ref('screenshot').child('reports')
      .child(prNumber).child('commit').once('value').then((snapshot) => snapshot.val());
  }
}
