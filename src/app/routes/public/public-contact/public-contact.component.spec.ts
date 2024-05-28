import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PublicContactComponent } from './public-contact.component'

describe('PublicContactComponent', () => {
  let component: PublicContactComponent
  let fixture: ComponentFixture<PublicContactComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PublicContactComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicContactComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
