import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateToken } from './validate-token';

describe('ValidateToken', () => {
  let component: ValidateToken;
  let fixture: ComponentFixture<ValidateToken>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateToken]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateToken);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
