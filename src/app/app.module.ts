// app.module.ts
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';


import { AppComponent } from './app.component';
import { CsvChartComponent } from './csv-chart/csv-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CsvChartComponent
  ],
  imports: [
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "space": 10,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 20,
      "outerStrokeColor": "#4882c2",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "titleColor": "#000",
      "subtitleColor": "#000",
      "titleFontSize": "20",
      "subtitleFontSize": "10",
      "showSubtitle": false,
      "showInnerStroke": false,
      "startFromZero": false
    }),

    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }