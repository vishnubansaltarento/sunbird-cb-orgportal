import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { RejectionPopupComponent } from './rejection-popup.component'

describe('RejectionPopupComponent', () => {
  let component: RejectionPopupComponent
  let fixture: ComponentFixture<RejectionPopupComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RejectionPopupComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
