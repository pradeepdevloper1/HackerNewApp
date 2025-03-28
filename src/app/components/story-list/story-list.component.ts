import { Component, signal, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HackerNewsService, Story } from '../../services/hacker-news.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { LoaderComponent } from '../loader/loader.component';
import { NotFoundComponent } from '../../pages/not-found/not-found.component';
import { catchError, finalize, of } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    SearchBoxComponent,
    LoaderComponent,
    NotFoundComponent,
    PaginatorComponent
  ],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})
export class StoryListComponent {
  private hackerNewsService = inject(HackerNewsService);

  // State signals
  stories = signal<Story[]>([]);
  filteredStories = signal<Story[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal('');

  // Pagination
  pageSize = 10;
  currentPage = 0;
  totalStories = signal(0);

  ngOnInit() {
    this.loadStories();
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.currentPage = 0; // Reset to first page when searching
    
    if (!query) {
      this.filteredStories.set(this.stories());
      this.totalStories.set(this.stories().length);
      return;
    }

    const filtered = this.stories().filter(story =>
      story.title.toLowerCase().includes(query.toLowerCase())
    );
    
    this.filteredStories.set(filtered);
    this.totalStories.set(filtered.length);
  }

  loadStories() {
    this.loading.set(true);
    this.error.set(null);
    
    this.hackerNewsService.getTopStories(100)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(err => {
          this.error.set('Failed to load stories. Please try again later.');
          return of([]);
        })
      )
      .subscribe(stories => {
        this.stories.set(stories);
        this.filteredStories.set(stories);
        this.totalStories.set(stories.length);
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatedStories() {
    const start = this.currentPage * this.pageSize;
    return this.filteredStories().slice(start, start + this.pageSize);
  }
}