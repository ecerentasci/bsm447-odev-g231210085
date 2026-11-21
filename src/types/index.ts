export interface Rate {
  code: string;
  rate: number;
}

export interface SavedRate extends Rate {
  id: string;
  timestamp: number;
}
