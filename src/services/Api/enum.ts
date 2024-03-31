export const CONNECTION_PROPERTIES = {
  FeatureServer: {
    LandingPage: 'http://localhost:9010/FeatureServer/',
    Collections: 'http://localhost:9010/FeatureServer/collections/',
    Functions: 'http://localhost:9010/FeatureServer/functions/',
  },
  TREX_SERVER: 'http://localhost:6767/',
  GEOSERVER: {
    URL: 'http://localhost:8080/geoserver',
    FEATURES: {
      SERVICE_PREFIX: 'ArchaeoSpringMap',
      NAME: 'FEATURES',
    },
    ERROR: 'Le geo-serveur (GS) est indisponible. Contactez l\'administrateur',
  },
  QGIS_SERVER: {
    URL: 'http://localhost:8081/cgi-bin/qgis_mapserv.fcgi.exe?',
    ERROR: 'Le geo-serveur (QGS) est indisponible. Contactez l\'administrateur',
  },
  MAPPROXY_SERVER: {
    URL: 'http://localhost:8082',
    ERROR: 'Le geo-serveur (MPX) est indisponible. Contactez l\'administrateur',
  },
  ZOO_SERVER: {
    URL: 'http://localhost/ogc-api/processes',
    ERROR: 'Le serveur de géotraitement (ZOO) est indisponible. Contactez l\'administrateur',
  }
};

export const USER_MESSAGE = {
  ERROR: 'Erreur de requête',
  STYLE_ERROR: 'Erreur lors de la récupération des styles',
  TYPOLOGY_ERROR: 'Erreur lors de la récupération des types',
  BBOX_ERROR: 'Erreur lors de la récupération des emprises',
  FEATURE_ERROR: 'Erreur lors de la récupération de l\'entité',
  SERVER_ERROR: 'Erreur lors de la requête sur le serveur de données'
};
