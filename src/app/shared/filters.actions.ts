export interface Breed {
  id: string;
  name: string;
  // and other fields
}
export interface CatImage {
  width: number;
  height: number;
  url: string;
  id: string;
  breeds: Breed[];
}

export interface CatFiltersModel {
  catsImages: CatImage[];
}

export class UpdateFilter {
  static readonly type = '[Cats] Filters';
  constructor(
    public limit: number | null | undefined,
    public breed_ids: string | null | undefined
  ) {}
}
