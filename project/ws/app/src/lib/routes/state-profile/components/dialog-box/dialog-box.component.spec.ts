import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DialogBoxComponent } from './dialog-box.component'

describe('DialogBoxComponent', () => {
  let component: DialogBoxComponent
  let fixture: ComponentFixture<DialogBoxComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogBoxComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBoxComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
