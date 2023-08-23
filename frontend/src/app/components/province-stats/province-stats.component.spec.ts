import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceStatsComponent } from './province-stats.component';

describe('ProvinceStatsComponent', () => {
  let component: ProvinceStatsComponent;
  let fixture: ComponentFixture<ProvinceStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvinceStatsComponent]
    });
    fixture = TestBed.createComponent(ProvinceStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
