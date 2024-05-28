import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ItemTileComponent } from './item-tile.component'

describe('ItemTileComponent', () => {
  let component: ItemTileComponent
  let fixture: ComponentFixture<ItemTileComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ItemTileComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
