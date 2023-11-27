import { defineStore } from 'pinia';
import { toolbarWidgets } from './enum';

export const useWidgetStore = defineStore('widget', {

  state: () => ({
    _widgetList: toolbarWidgets
  }),

  getters: {
    widgetList: (state) => state._widgetList
  }
});
