import FeaturesTool from '../../components/widgets/FeaturesTool/FeaturesTool.vue';
import ProcessingTool from '../../components/widgets/ProcessingTool/ProcessingTool.vue';
import TuneTool from '../../components/widgets/TuneTool/TuneTool.vue'

import { IWidgets } from './type'
import { DefineComponent, markRaw } from 'vue'

export const toolbarWidgets: IWidgets = {
  FeaturesTool: {
    tool: markRaw(FeaturesTool) as DefineComponent,
    width: '470px',
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
  TuneTool: {
    tool: markRaw(TuneTool) as DefineComponent,
    width: '470px',
    title: 'TuneTool',
    icon: 'sym_o_tune',
    tooltip: 'Customization'
  }
}
