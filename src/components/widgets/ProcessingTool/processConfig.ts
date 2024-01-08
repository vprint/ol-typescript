import { OAProcessesBuffer, OAProcessesCentroid, OAProcessesProfile } from './types'

export function getBufferPayload(feature: string, bufferDistance: number): OAProcessesBuffer {
  return {
    inputs: {
      InputPolygon: {
        format: {
          mediaType: 'application/geo+json'
        },
        value: feature
      },
      BufferDistance: bufferDistance
    },
    outputs: {
      Result: {
        format: {
          mediaType: 'application/json'
        },
        transmissionMode: 'value'
      }
    }
  }
}


export function getCentroidPayload(feature: string): OAProcessesCentroid {
  return {
    inputs: {
      InputPolygon: {
        format: {
          mediaType: 'application/geo+json'
        },
        value: feature
      },
    },
    outputs: {
      Result: {
        format: {
          mediaType: 'application/json'
        },
        transmissionMode: 'value'
      }
    }
  }
}

export function getProfilePayload(geom: string, raster: string): OAProcessesProfile {
  return {
    inputs: {
      RasterFile: raster,
      Geometry: {
        type: 'application/geo+json',
        value: geom
      },
    },
    outputs: {
      Profile: {
        format: {
          mediaType: 'application/json'
        },
        transmissionMode: 'value'
      }
    }
  }
}
