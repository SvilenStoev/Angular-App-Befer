import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceFightGameComponent } from './space-fight-game.component';

describe('SpaceFightGameComponent', () => {
  let component: SpaceFightGameComponent;
  let fixture: ComponentFixture<SpaceFightGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceFightGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceFightGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
