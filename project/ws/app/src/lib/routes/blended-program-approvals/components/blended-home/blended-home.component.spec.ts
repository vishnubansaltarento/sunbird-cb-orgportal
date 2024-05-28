import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BlendedHomeComponent } from './blended-home.component'

describe('BlendedHomeComponent', () => {
  let component: BlendedHomeComponent
  let fixture: ComponentFixture<BlendedHomeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BlendedHomeComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlendedHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
