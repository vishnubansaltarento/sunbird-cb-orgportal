import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BtnChannelAnalyticsComponent } from './btn-channel-analytics.component'

describe('BtnChannelAnalyticsComponent', () => {
  let component: BtnChannelAnalyticsComponent
  let fixture: ComponentFixture<BtnChannelAnalyticsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BtnChannelAnalyticsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnChannelAnalyticsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
