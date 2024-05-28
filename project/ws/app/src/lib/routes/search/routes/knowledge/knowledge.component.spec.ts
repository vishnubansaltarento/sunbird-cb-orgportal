import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { KnowledgeComponent } from './knowledge.component'

describe('KnowledgeComponent', () => {
  let component: KnowledgeComponent
  let fixture: ComponentFixture<KnowledgeComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KnowledgeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
