<template>
  <RegularWidget>

    <template #header>
      Entités
    </template>

    <template #component>
      <q-stepper v-model="step" vertical color="primary" animated class="no-shadow">

        <q-step :name="1" title="Type d'action" :done="step > 1" class="merriweather">
          <p>Sélectionner l'action à effectuer.</p>
          <q-stepper-navigation>
            <div class="row justify-end">
              <q-btn square flat icon="mdi-shape-polygon-plus" color="primary" label="Créer" class="merriweather"
                @click="setStep({ toStep: 2, toActionType: 'create' })" />
              <q-btn square flat icon="mdi-cursor-default-click-outline" color="primary" label="Editer"
                class="merriweather" @click="setStep({ toStep: 3, toActionType: 'edit' })" />
            </div>
          </q-stepper-navigation>
        </q-step>

        <q-step :name="2" title="Créer une entité" icon="create_new_folder" :done="step > 2"
          :disable="actionType === 'edit'" class="merriweather">
          <p>Dessiner une nouvelle entité sur la carte.</p>
          <q-stepper-navigation>
            <div class="row justify-end">
              <q-btn square flat color="primary" label="Retour" class="q-ml-sm" @click="setStep({ toStep: 1 })" />
              <q-btn square color="primary" icon="done" label="Continuer" class="merriweather"
                @click="setStep({ toStep: 4 })" />
            </div>
          </q-stepper-navigation>
        </q-step>

        <q-step :name="3" title="Sélectionner une entité" icon="ads_click" active-icon="ads_click" :done="step > 3"
          :disable="actionType === 'create'" class="merriweather">
          <q-stepper-navigation>
            <feature-selector @selector-next="enableModification" @selector-back="setStep({ toStep: 1 })" />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="4" title="Attributs" icon="view_headline" class="merriweather">
          <p>Modifier les informations attributaires</p>

          <q-form class="q-gutter-md">
            <q-select v-model="featureType" :options="typologiesFormatted" option-label="typology_name"
              option-value="id_typology" label="Types" />
            <q-input v-model="observation" label="Observation" />
          </q-form>

          <q-stepper-navigation>
            <div class="row justify-end">
              <q-btn :loading="pendingTransaction" :disabled="pendingTransaction" square flat color="primary"
                label="Retour" class="shadow-1" @click="setStep({ toStep: 3 }), reset()">
                <template v-slot:loading>
                  <q-spinner-puff class="on-left" />
                </template>
              </q-btn>

              <q-space />

              <q-btn :loading="pendingTransaction" :disabled="pendingTransaction" square color="primary" label="Supprimer"
                class="q-mr-sm shadow-1" @click="serverTransaction('delete')">
                <template v-slot:loading>
                  <q-spinner-puff class="on-left" />
                </template>
              </q-btn>

              <q-btn :loading="pendingTransaction" :disabled="pendingTransaction" square color="positive"
                label="Enregistrer" class="shadow-1" @click="serverTransaction('update')">
                <template v-slot:loading>
                  <q-spinner-puff class="on-left" />
                </template>
              </q-btn>
            </div>
          </q-stepper-navigation>
        </q-step>

      </q-stepper>
    </template>

    <template #external>
      <DrawTool v-if="drawMode !== ''" :draw-mode="drawMode" :feature-id="featureId">
      </DrawTool>
    </template>
  </RegularWidget>
</template>

<script setup lang="ts">

import RegularWidget from '../RegularWidget/RegularWidget.vue';
import featureSelector from '../FeatureSelector/FeatureSelector.vue';
import { ref, Ref } from 'vue';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { ISqlTypologies, ITypologies } from 'src/services/Api/types';
import { FeatureLike } from 'ol/Feature';
import { useMapStore } from 'src/stores/mapStore/map-store';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import DrawTool from '../DrawTool/DrawTool.vue';
import { VECTOR_LAYERS_SETTINGS, VECTOR_TILE_LAYERS_SETTINGS } from 'src/map/layers/enum';
import VectorTileLayer from 'ol/layer/VectorTile';
import { TransactionMode } from 'src/services/TransactionServices/type';


const step = ref(1)
const actionType = ref('')
const featureType: Ref<ISqlTypologies | undefined> = ref(undefined)
const observation: Ref<string | undefined> = ref('')
const typologiesRaw = ApiRequestor.getTypologies()
const drawMode: Ref<string> = ref('')
const mapStore = useMapStore()
const editionLayer = mapStore.getLayerByName(VECTOR_LAYERS_SETTINGS.EDITION_LAYER.NAME) as VectorLayer<VectorSource>
const pendingTransaction = ref(false)

let featureId: string | number | undefined
let typologiesFormatted: ITypologies | undefined = undefined

setTypologies(typologiesRaw)

/**
 * Fonction de modification des étapes
 * @param toStep Etape cible
 * @param toActionType Action cible
 */
function setStep({ toStep, toActionType, toDrawMode }: { toStep: number, toActionType?: string, toDrawMode?: string }): void {
  step.value = toStep;
  toActionType ? actionType.value = toActionType : null;
  toDrawMode ? drawMode.value = toDrawMode : drawMode.value = '';
}

/**
 * Définition du nom des typologies pour la liste de sélection
 * @param typologies Liste des typologies
 */
async function setTypologies(typologyPromise: Promise<ITypologies | undefined>): Promise<void> {
  const typologyList = await typologyPromise
  typologiesFormatted = typologyList
}

/**
 * Activation des modifications attributaires et géométriques
 * @param feature
 */
async function enableModification(feature: FeatureLike): Promise<void> {
  setStep({ toStep: 4, toDrawMode: 'modifyFeature' })
  featureId = feature.getId()

  // Gestion de la typologie de l'entité sélectionnée
  const typologies = await typologiesRaw

  // Attribution des valeurs du formulaire
  featureType.value = typologies?.find((element) => element.id_typology === feature.get('id_typology'))
  observation.value = feature.get('commentaire')
}

/**
 * Fonction de transaction
 * @param mode Mode de transaction (insert, update, delete)
 */
async function serverTransaction(mode: TransactionMode): Promise<void> {
  pendingTransaction.value = true
  const feature = editionLayer.getSource()?.getFeatures()[0]

  // Récupération des valeurs du formulaire
  feature?.set('commentaire', observation.value);
  feature?.set('id_typology', featureType.value?.id_typology)

  // Execution de la transaction et rafraichissement du layer
  await ApiRequestor.wfsTransaction(feature, mode)
  refreshLayer()
  pendingTransaction.value = false

}

/**
 * Fonction de rafraichissement du layer d'édition
 */
function refreshLayer(): void {
  const mapLayer = mapStore.getLayerByName(VECTOR_TILE_LAYERS_SETTINGS.CARTOGRAPHY_LAYER.NAME) as VectorTileLayer
  mapLayer.getSource()?.refresh()
}


/**
 * Fonction de réinitialisation
 */
function reset(): void {
  editionLayer.getSource()?.clear()
}

</script>

<style lang="sass" scoped>
.global
  display: flex
</style>
