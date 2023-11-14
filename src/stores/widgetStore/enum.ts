import InformationTool from '../../components/widgets/InformationTool/InformationTool.vue';
import FeaturesTool from '../../components/widgets/FeaturesTool/FeaturesTool.vue';
import ProcessingTool from '../../components/widgets/ProcessingTool/ProcessingTool.vue';

import { IWidgets } from './type'
import { DefineComponent, markRaw } from 'vue'

export const toolbarWidgets: IWidgets = {
  FeaturesTool: {
    tool: markRaw(FeaturesTool) as DefineComponent,
    width: '500px',
    title: 'FeaturesTool',
    icon: 'mdi-map',
    tooltip: 'Features'
  },
  ProcessingTool: {
    tool: markRaw(ProcessingTool) as DefineComponent,
    width: '400px',
    title: 'ProcessingTool',
    icon: 'handyman',
    tooltip: 'Processings'
  },
  InformationTool: {
    tool: markRaw(InformationTool) as DefineComponent,
    width: '400px',
    title: 'InformationTool',
    icon: 'info',
    tooltip: 'Information'
  }
}
