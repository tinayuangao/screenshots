import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ImageComponent } from './image/image.component';
import { ResultComponent } from './result/result.component';
import {FirebaseService} from './firebase.service';
import {routing} from './routes';

@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    ImageComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
