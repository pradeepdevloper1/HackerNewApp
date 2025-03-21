  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Story {
  id: number;
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {
  private apiUrl = 'https://localhost:7288/api/stories'; // Replace with your back-end URL

  constructor(private http: HttpClient) { }

  getNewStories(page: number, pageSize: number): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/new?page=${page}&pageSize=${pageSize}`);
  }

  searchStories(query: string, page: number, pageSize: number): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/search?query=${query}&page=${page}&pageSize=${pageSize}`);
  }
}