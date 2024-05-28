import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CardDetailsComponent } from './card-details.component'

describe('CardDetailsComponent', () => {
  let component: CardDetailsComponent
  let fixture: ComponentFixture<CardDetailsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardDetailsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
