import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsAllComponent } from './posts-all.component';

describe('PostsAllComponent', () => {
  let component: PostsAllComponent;
  let fixture: ComponentFixture<PostsAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
