import { Widgets } from './type'
import InformationTool from '../../components/widgets/InformationTool/InformationTool.vue'
import FeaturesTool from '../../components/widgets/FeaturesTool/FeaturesTool.vue'
import ProcessingTool from '../../components/widgets/ProcessingTool/ProcessingTool.vue'
import { DefineComponent } from 'vue'

export const toolbarWidgets: Widgets = {
  featuresTool: {
    tool: FeaturesTool as DefineComponent,
    width: '450px',
    title: 'FeaturesTool',
    icon: 'mdi-map',
    tooltip: 'Features'
  },
  processingTool: {
    tool: ProcessingTool as DefineComponent,
    width: '400px',
    title: 'ProcessingTool',
    icon: 'handyman',
    tooltip: 'Processings'
  },
  informationTool: {
    tool: InformationTool as DefineComponent,
    width: '400px',
    title: 'InformationTool',
    icon: 'info',
    tooltip: 'Information'
  }
}
