export const CONNECTION_PROPERTIES = {
  BASE_URL: 'http://localhost',
  FeatureServer: {
    LandingPage: 'http://localhost:9010/FeatureServer/',
    Collections: 'http://localhost:9010/FeatureServer/collections/',
    Functions: 'http://localhost:9010/FeatureServer/functions/',
  },
  TREX_SERVER: 'http://localhost:6767/',
  GEOSERVER: {
    URL: 'http://localhost:8080/geoserver/wfs?',
    FEATURES: {
      SERVICE_PREFIX: 'ArchaeoSpringMap',
      NAME: 'FEATURES',
    },
    ERROR: 'Le geo-serveur est indisponible. Contactez l\'administrateur',
  },
};

export const USER_MESSAGE = {
  ERROR: 'Erreur de requête',
  STYLE_ERROR: 'Erreur lors de la récupération des styles',
  TYPOLOGY_ERROR: 'Erreur lors de la récupération des types',
  SERVER_ERROR: 'Erreur lors de la requête sur le serveur de données',
};
