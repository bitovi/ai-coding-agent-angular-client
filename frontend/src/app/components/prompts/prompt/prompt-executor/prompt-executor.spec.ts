import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptExecutor } from './prompt-executor';

describe('PromptExecutor', () => {
  let component: PromptExecutor;
  let fixture: ComponentFixture<PromptExecutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptExecutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptExecutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
