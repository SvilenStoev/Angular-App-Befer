import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { IPost } from 'src/app/interfaces';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from 'src/app/services/auth/user.service';
import { PostService } from 'src/app/services/components/post.service';
import { LanguageService } from 'src/app/services/common/language.service';
import { TabTitleService } from 'src/app/services/common/tab-title.service';

@Component({
  selector: 'app-posts-all',
  templateUrl: './posts-all.component.html',
  styleUrls: ['./posts-all.component.css']
})
export class PostsAllComponent implements OnInit, OnDestroy {

  posts: IPost[];
  showLoader: boolean = false;
  isMyPosts: boolean = false;

  //menu languages
  menu: any = this.langService.get().postsAll;
  subscription: Subscription;

  //default sortType
  sortType: string = this.menu.date;

  //pagination
  limitPosts: number = 8;
  currPage: number = 1;
  allPostsCount: number = 0;
  lastPage: number = 1;
  skipPosts: number = (this.currPage - 1) * this.limitPosts;

  constructor(
    private postService: PostService,
    private router: Router,
    private userService: UserService,
    private titleService: TabTitleService,
    private langService: LanguageService) {
    this.isMyPosts = this.router.url == '/posts/mine';
  }

  setTitle(): void {
    this.titleService.setTitle(`${this.isMyPosts ? this.menu.my : this.menu.all} ${this.menu.title}`);
  }

  ngOnInit(): void {
    this.setTitle();

    this.subscription = this.langService.langEvent$.subscribe(langJson => {
      this.menu = langJson.postsAll;
      this.setTitle();

      //Update sortType when language is changed
      if (this.sortType == 'Date' || this.sortType == 'Дата') {
        this.sortType = this.menu.date;
      } else {
        this.sortType = this.menu.likes;
      }
    });

    this.loadPosts();
  }

  loadPosts() {
    this.showLoader = true;

    if (!this.isMyPosts) {
      this.postService.getAllPostsCount$().subscribe({
        next: (data) => {
          this.allPostsCount = data.count;
          this.lastPage = Math.ceil(this.allPostsCount / this.limitPosts);
        }
      });

      this.postService.loadAllPosts$(this.limitPosts, this.sortType, this.skipPosts).subscribe({
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
    } else if (this.isMyPosts) {
      const userId = this.userService.userId;

      this.postService.getMyPostsCount$(userId).subscribe({
        next: (data) => {
          this.allPostsCount = data.count;
          this.lastPage = Math.ceil(this.allPostsCount / this.limitPosts);
        }
      });

      this.postService.loadMyPosts$(this.limitPosts, userId, this.sortType, this.skipPosts).subscribe({
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
  }

  sortByDate(postsArr: IPost[]): void {
    this.sortType = this.menu.date;
    this.posts = postsArr.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  sortByLikes(postsArr: IPost[]): void {
    this.sortType = this.menu.likes;
    this.posts = postsArr.sort((a, b) => b.likes.length - a.likes.length);
  }

  //pagination logic
  goToPreviousPage(): void {
    if (this.currPage == 1) {
      return;
    }

    this.currPage--;
    this.updateSkipPosts();

    this.loadPosts();
  }

  goToNextPage(): void {
    if (this.currPage == this.lastPage) {
      return;
    }

    this.currPage++;
    this.updateSkipPosts();

    this.loadPosts();
  }

  goToFirstPage(): void {
    this.currPage = 1;
    this.updateSkipPosts();

    this.loadPosts();
  }

  goToLastPage(): void {
    this.currPage = this.lastPage;
    this.updateSkipPosts();

    this.loadPosts();
  }

  updateSkipPosts(): void {
    this.skipPosts = (this.currPage - 1) * this.limitPosts;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}