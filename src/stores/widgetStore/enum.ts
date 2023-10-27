import InformationTool from '../../components/widgets/InformationTool/InformationTool.vue'
import FeaturesTool from '../../components/widgets/FeaturesTool/FeaturesTool.vue'
import ProcessingTool from '../../components/widgets/ProcessingTool/ProcessingTool.vue'

import { IWidgets } from './type'
import { DefineComponent } from 'vue'

export const toolbarWidgets: IWidgets = {
  FeaturesTool: {
    tool: FeaturesTool as DefineComponent,
    width: '450px',
    title: 'FeaturesTool',
    icon: 'mdi-map',
    tooltip: 'Features'
  },
  ProcessingTool: {
    tool: ProcessingTool as DefineComponent,
    width: '400px',
    title: 'ProcessingTool',
    icon: 'handyman',
    tooltip: 'Processings'
  },
  InformationTool: {
    tool: InformationTool as DefineComponent,
    width: '400px',
    title: 'InformationTool',
    icon: 'info',
    tooltip: 'Information'
  }
}
