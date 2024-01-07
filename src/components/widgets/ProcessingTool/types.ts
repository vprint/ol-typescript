import { FeatureCollection, LineString } from 'geojson';

export interface OAProcessesInputPolygon {
  InputPolygon: {
    format: {
      mediaType: 'application/geo+json' | 'text/xml';
    };
    value: string;
  };
};

export interface OAProcessesOutput {
  format: {
    mediaType: 'application/json' | 'text/xml';
  };
  transmissionMode: 'value' | 'reference'
};

export interface OAProcessesGdalInput {
  Geometry: {
    type: string;
    value: string
  }
}

export interface OAProcessesProfileInput extends OAProcessesGdalInput {
  RasterFile: string;
}


export interface OAProcessesResult {
  Result: {
    value: FeatureCollection
  }
}

export interface OAProcessesProfileResult {
  Profile: {
    value: LineString
  }
}

export interface OAProcessesInputBuffer extends OAProcessesInputPolygon {
  BufferDistance: number
}

export interface OAProcessesBuffer {
  inputs: OAProcessesInputBuffer,
  outputs: {
    Result: OAProcessesOutput
  }
}

export interface OAProcessesCentroid {
  inputs: OAProcessesInputPolygon,
  outputs: {
    Result: OAProcessesOutput
  }
}

export interface OAProcessesProfile {
  inputs: OAProcessesProfileInput,
  outputs: {
    Profile: OAProcessesOutput
  }
}
