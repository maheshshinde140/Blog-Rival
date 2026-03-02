export class PaginationDto {
  page: number = 1;
  limit: number = 10;
  skip: number = 0;

  constructor(page?: number, limit?: number) {
    this.page = Math.max(1, page || 1);
    this.limit = Math.min(100, Math.max(1, limit || 10));
    this.skip = (this.page - 1) * this.limit;
  }
}

export class PaginatedResponseDto<T> {
  data!: T[];
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
