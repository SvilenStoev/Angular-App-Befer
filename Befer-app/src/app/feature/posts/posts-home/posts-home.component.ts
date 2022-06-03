import { IPost } from 'src/app/interfaces';
import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/services/auth/user.service';
import { PostService } from 'src/app/services/components/post.service';
import { LanguageService } from 'src/app/services/common/language.service';

@Component({
  selector: 'app-posts-home',
  templateUrl: './posts-home.component.html',
  styleUrls: ['./posts-home.component.css']
})
export class PostsHomeComponent implements OnInit {

  posts: IPost[];
  limitPosts: number = 5;
  showLoader: boolean = false;
  menu: any = this.langService.get().postsHome;

  //default sortType
  sortType: string = this.menu.date;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private langService: LanguageService) { }

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  ngOnInit(): void {
    this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.postsHome;

      //Update sortType when language is changed
      if (this.sortType == 'Date' || this.sortType == 'Дата') {
        this.sortType = this.menu.date;
      } else {
        this.sortType = this.menu.likes;
      }
    });

    this.loadPosts(this.limitPosts);
  }

  loadPosts(limit: number) {
    this.showLoader = true;
    this.limitPosts = limit;

    this.postService.loadAllPosts$(this.limitPosts, this.sortType, 0).subscribe({
      next: (data) => {
        if (this.sortType == this.menu.date) {
          this.sortByDate(data.results);
        } else {
          this.sortByLikes(data.results);
        }
      },
      complete: () => {
        this.showLoader = false;
      },
      error: () => {
        this.showLoader = false;
      }
    });
  }

  sortByDate(postsArr: IPost[]): void {
    this.sortType = this.menu.date;
    this.posts = postsArr.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  sortByLikes(postsArr: IPost[]): void {
    this.sortType = this.menu.likes;
    this.posts = postsArr.sort((a, b) => b.likes.length - a.likes.length);
  }
}