import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {

  githubToken: string;
  user: any;
  prNumber: string;
  sha: string;
  mode: 'flip' | 'side' | 'diff' = 'diff';
  flipping: boolean = false;

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

  flip() {
    this.flipping = !this.flipping;
  }

  _storageRef(): firebase.storage.Reference {
    return firebase.storage().ref('screenshots').child(this.prNumber);
  }

  testRef(): firebase.storage.Reference {
    return this._storageRef().child('test');
  }

  diffRef(): firebase.storage.Reference {
    return this._storageRef().child('diff');
  }

  goldRef(): firebase.storage.Reference {
    return firebase.storage().ref('goldens');
  }

  _databaseRef(): firebase.database.Reference {
    return firebase.database().ref('screenshot').child('reports').child(this.prNumber);
  }

  getTestResult(key: string): firebase.Promise<any> {
    return this._databaseRef() .child('results').child(key).once('value').then((snapshot) => {
        return snapshot.val();
      });
  }

  getFilenames(): firebase.Promise<any> {
    return firebase.database().ref('screenshot').child('goldens').once('value')
      .then((snapshot) => {
        let filenames = [];
        snapshot.forEach((childSnapshot) => {
          filenames.push(`${childSnapshot.key}.screenshot.png`);
        });
        return filenames;
      });
  }

  getCommit(): firebase.Promise<any> {
    return this._databaseRef().child('sha').once('value').then((snapshot) => {
        return snapshot.val();
      });
  }

  getTravisJobId(): firebase.Promise<any> {
    return this._databaseRef().child('travis').once('value').then((snapshot) => {
        return snapshot.val();
      });
  }

  currentUser() {
    return firebase.auth().currentUser;
  }

  get githubProvider() {
    let provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo:status');
    return provider;
  }

  signInGithubRedirect(): firebase.Promise<any> {
    return firebase.auth().signInWithRedirect(this.githubProvider);
  }

  signedInGithub() {
    firebase.auth().getRedirectResult().then((result) => {
      if (result.credential) {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        this.githubToken = result.credential.accessToken;
      } else {
        this.githubToken = null;
      }
      // The signed-in user info.
     this.user = result.user;
    }).catch(function(error) {
      console.error(error);
    });
  }

  authStateChange(callback?: any) {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if (callback) {
        callback(user);
      }
    });
  }


  approvePR() {
    return this._databaseRef().child('approved').set(this.sha);
  }

  approveByUser() {
    return this.hasApprovalPermission().then((hasPermission) => {
      if (hasPermission) {
        return this._updateGolds();
        // TODO(tinayuangao): Update PR status?
      } else {
        return false;
      }
    });
  }

  _updateGolds() {
    return this._databaseRef().child(`filenames`)
        .once('value').then((snapshot) => {
      return snapshot.val();
    }).then((filenames: string[]) => {
        // TODO: Remove the gold files whose name is not in list after it's done
      let promises = [firebase.database().ref('screenshot').child('filenames').set(filenames)];
      filenames.forEach((filename: string) => {
        let file = firebase.storage().ref('screenshots').child(this.prNumber).child('test').child(filename);
        file.getDownloadURL().then((url) => {
          let img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = url;
          img.onload = () => {
            let ref = firebase.storage().ref('golds').child(filename);
            promises.push(ref.putString(this._getBase64Image(img), 'base64').then((snapshot) => {
              return true;
            } , function(error) {
              // Handle unsuccessful uploads
              console.log(`error ${error}`);
            },));
          };
        });
      });
      return firebase.Promise.all(promises);
    }).then((r) => {
      return true;
    });
  }

  hasApprovalPermission(): firebase.Promise<boolean> {
    return firebase.database().ref('whitelist').once('value')
      .then((snapshot) => {
        if (!this.user || !this.user.providerData || !this.user.providerData[0].uid) {
          return false;
        }
        let ids: string[] = snapshot.val();
        let isWhiteListed: boolean = false;
        ids.forEach((id) => {
          if (id == this.user.providerData[0].uid) {
            isWhiteListed = true;
          }
        });
        return isWhiteListed;
      });
  }

  _getBase64Image(img: HTMLImageElement) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  restartTravisJob(jobId: string) {
    if (!this.githubToken) {
      this.signInGithubRedirect();
    } else {
      this._authGithub();
    }
  }

  _authGithub() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.travis-ci.org/auth/github', true);
    xhr.setRequestHeader('User-Agent', 'Travis/ScreenshotDiff/1.0.0');
    //xhr.setRequestHeader('Host', 'api.travis-ci.org');
    //xhr.setRequestHeader('Content-Length', '37');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/vnd.travis-ci.2+json');
    xhr.onreadystatechange = function() {
      console.log(xhr.responseText);
    };
    xhr.send(JSON.stringify({
     'github_token': this.githubToken
    }));
  }

  updateGithubStatus(state: string) {
    return new firebase.Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      let data = JSON.stringify({
        "state": state,
        "target_url": `http://material2-screenshots.firebaseapp.com/${this.prNumber}`,
        "context": "screenshot-diff",
        "description": `Screenshot test ${state}`
      });
      xhr.open('POST', `https://api.github.com/repos/angular/material2/statuses/${this.sha}`, true);
      //xhr.setRequestHeader('User-Agent', 'ScreenshotDiff/1.0.0');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', `token ${this.githubToken}`);
      xhr.onreadystatechange = () => {
        resolve(xhr.status);
      };
      xhr.send(data);
    });
  }
}
