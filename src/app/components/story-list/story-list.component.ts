import { Component, OnInit } from '@angular/core';
import { HackerNewsService, Story } from '../../services/hacker-news.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  BehaviorSubject,
  Observable,
  of,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-story-list',
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './story-list.component.html',
  styleUrl: './story-list.component.css',
})
export class StoryListComponent implements OnInit {
  stories$: Observable<Story[]> = of([]);
  loading$ = new BehaviorSubject<boolean>(false);
  page = 1;
  pageSize = 10;
  searchQuery = '';
  searchControl = new FormControl('');
  constructor(private hackerNewsService: HackerNewsService) {}

  ngOnInit() {
    this.loadStories();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(3000), // Wait for 3000ms after the user stops typing
        distinctUntilChanged(), // Only emit if the value has changed
        tap(() => (this.page = 1)), // Reset to the first page when searching
        switchMap((query) => {
          this.searchQuery = query || '';
          return this.hackerNewsService.searchStories(
            this.searchQuery,
            this.page,
            this.pageSize
          );
        })
      )
      .subscribe((res) => {
        this.stories$ = of(res);
        console.log(res);
      });
  }
  openLink(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
  loadStories() {
    this.loading$.next(true);
    this.stories$ = this.hackerNewsService
      .getNewStories(this.page, this.pageSize)
      .pipe(tap(() => this.loading$.next(false)));
    console.log(this.stories$.subscribe((res) => console.log(res)));
  }
  onSearch() {
    if (!this.searchQuery.length) {
      this.loadStories();
    } else {
      this.searchControl.setValue(this.searchQuery);
    }
  }
  nextPage() {
    this.page++;
    this.loadStories();
  }

  prevPage() {
    this.page--;
    this.loadStories();
  }
}
