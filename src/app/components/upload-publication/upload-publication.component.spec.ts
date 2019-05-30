import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPublicationComponent } from './upload-publication.component';

describe('UploadPublicationComponent', () => {
  let component: UploadPublicationComponent;
  let fixture: ComponentFixture<UploadPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
