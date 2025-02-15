import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosBillingComponent } from './pos-billing.component';

describe('PosBillingComponent', () => {
  let component: PosBillingComponent;
  let fixture: ComponentFixture<PosBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
