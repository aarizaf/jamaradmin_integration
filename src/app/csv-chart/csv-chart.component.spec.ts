import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvChartComponent } from './csv-chart.component';

describe('CsvChartComponent', () => {
  let component: CsvChartComponent;
  let fixture: ComponentFixture<CsvChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsvChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
