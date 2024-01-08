import { ApexOptions } from 'apexcharts'

export const chartOptions: ApexOptions = {
  // Définition du type de graphique
  chart: {
    type: 'area'
  },

  // Définition du trait du graphique
  stroke: {
    width: 1,
    colors: ['#8a1946']
  },

  // Paramètres de l'axe x
  xaxis: {
    labels: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },

  // Parmètres de l'axe y
  yaxis: {
    decimalsInFloat: 0,
    title: {
      text: 'Altitude',
      style: {
        fontFamily: 'merriweather'
      }
    },
    labels: {
      style: {
        fontFamily: 'merriweather'
      }
    }
  },

  // Paramètre du marker (point sur la ligne lors du survol)
  markers: {
    colors: '#8a1946',
    hover: {
      size: 5
    }
  },


  // Paramètre des tooltip (fenêtre affichée à coté du point sur la ligne)
  tooltip: {
    x: {
      show: false
    },
    y: {
      formatter: (val: number): string => {
        return `${val.toFixed(2)}m`
      }
    },
    style: {
      fontFamily: 'merriweather'
    },
    marker: {
      fillColors: ['#8a1946']
    },
    followCursor: true
  },

  dataLabels: {
    enabled: false
  },

  // Dégradé de couleur sous la ligne principale
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 1,
      opacityTo: 0.1
    },
    colors: ['#8a1946']
  }
}
