import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { QuickTourComponent } from './quick-tour.component'

describe('QuickTourComponent', () => {
  let component: QuickTourComponent
  let fixture: ComponentFixture<QuickTourComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuickTourComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickTourComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
