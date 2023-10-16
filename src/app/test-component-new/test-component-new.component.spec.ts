import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponentNewComponent } from './test-component-new.component';

describe('TestComponentNewComponent', () => {
  let component: TestComponentNewComponent;
  let fixture: ComponentFixture<TestComponentNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponentNewComponent]
    });
    fixture = TestBed.createComponent(TestComponentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
