import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { FileProgressComponent } from './file-progress.component'

describe('FileProgressComponent', () => {
  let component: FileProgressComponent
  let fixture: ComponentFixture<FileProgressComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FileProgressComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FileProgressComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
