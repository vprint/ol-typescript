<template>
  <RegularWidget title="Entités">
    <q-stepper
      v-model="step"
      vertical
      color="primary"
      animated
      class="no-shadow">

      <q-step
        :name="1"
        title="Type d'action"
        :done="step > 1"
        class="merriweather">
        <p>Sélectionner l'action à effectuer.</p>
        <q-stepper-navigation>
          <div
            class="row justify-end">
            <q-btn
              square
              flat
              icon="mdi-shape-polygon-plus"
              color="primary"
              label="Créer"
              class="merriweather"
              @click="setStep({toStep:2, toActionType:'create'})" />
            <q-btn
              square
              flat
              icon="mdi-cursor-default-click-outline"
              color="primary"
              label="Editer"
              class="merriweather"
              @click="setStep({toStep:3, toActionType:'edit'})" />
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Créer une entité"
        icon="create_new_folder"
        :done="step > 2"
        :disable="actionType === 'edit'"
        class="merriweather">
        <p>Dessiner une nouvelle entité sur la carte.</p>
        <q-stepper-navigation>
          <div class="row justify-end">
            <q-btn
              square
              flat
              color="primary"
              label="Retour"
              class="q-ml-sm"
              @click="setStep({toStep:1})" />
            <q-btn
              square
              color="primary"
              icon="done"
              label="Continuer"
              class="merriweather"
              @click="setStep({toStep:4})"/>
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Sélectionner une entité"
        icon="ads_click"
        active-icon="ads_click"
        :done="step > 3"
        :disable="actionType === 'create'"
        class="merriweather">
        <p>Cliquer sur une entité pour la sélectionner.</p>
        <q-stepper-navigation>
          <div class="row justify-end">
            <q-btn
              square
              flat
              color="primary"
              label="Retour"
              class="q-ml-sm"
              @click="setStep({toStep:1})" />
            <q-btn
              square
              color="primary"
              icon="done"
              label="Continuer"
              class="merriweather"
              @click="setStep({toStep:4})"/>
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="4"
        title="Attributs"
        icon="view_headline"
        class="merriweather">
        <p>Modifier les informations attributaires</p>
        <q-form class="q-gutter-md">
          <q-select v-model="featureType" :options="typologys" label="Types" />
        </q-form>
      </q-step>

    </q-stepper>
  </RegularWidget>
</template>

<script setup lang="ts">
import RegularWidget from '../RegularWidget/RegularWidget.vue';
import { ref, Ref } from 'vue';
import ApiRequestor from 'src/services/Api/ApiRequestor';

const step = ref(1)
const actionType:Ref<string> = ref('')
const featureType: Ref<string> = ref('yo')
const typologys: Ref<string[]> = ref([])

/**
 * Fonction de modification des étapes
 * @param toStep Etape cible
 * @param toActionType Action cible
 */
function setStep({toStep, toActionType, toDrawMode}: {toStep: number, toActionType?: string, toDrawMode?: string}): void {
  step.value = toStep,
  toActionType ? actionType.value = toActionType : null
}

/**
 * Fonction de récupération des noms des typologies
 */
async function set_typologys(): Promise<void> {
  const result = await ApiRequestor.getTypologies()
  if (result !== undefined) {
    result.forEach(element => {
      typologys.value.push(element.typology_name)
    });
  }
}

set_typologys()

</script>
