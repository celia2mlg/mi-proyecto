import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationHelper {
  static getPaginatedData<T>(
    data: T[],
    pageIndex: number,
    pageSize: number,
  ): T[] {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }
}
