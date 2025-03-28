import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-search-box',
  imports: [CommonModule,   ReactiveFormsModule,FormsModule,MatFormFieldModule,MatInputModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent {
  query = '';
  @Output() search = new EventEmitter<string>();
  searchControl = new FormControl('');
  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.search.emit(query?.trim().toLowerCase() || '');
      });
  }
 
}
