import { FeatureLike } from 'ol/Feature';

export interface ISelected {
  rows: readonly FeatureLike[];
  keys: readonly string[];
  added: boolean;
  evt: Event;
}
