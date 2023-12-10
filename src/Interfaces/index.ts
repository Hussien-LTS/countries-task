export interface Country {
  name: string;
  languages: string[];
  cca2: string;
  cca3: string;
  ccn3: number;
  currencies: { name: string; symbol: string }[];
  region: string;
  latlng: number[];
}
