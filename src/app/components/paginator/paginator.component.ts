import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
@Component({
  selector: 'app-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input() totalItems: number=0;
  @Input() pageSize: number=0;
  @Output() pageChanged = new EventEmitter<PageEvent>();
}
