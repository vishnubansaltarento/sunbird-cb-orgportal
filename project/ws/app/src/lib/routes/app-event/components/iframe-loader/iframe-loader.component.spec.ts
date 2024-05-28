import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { IframeLoaderComponent } from './iframe-loader.component'

describe('IframeLoaderComponent', () => {
  let component: IframeLoaderComponent
  let fixture: ComponentFixture<IframeLoaderComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IframeLoaderComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeLoaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
