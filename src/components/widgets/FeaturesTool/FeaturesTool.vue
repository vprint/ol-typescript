<template>
  <div class="global">
    <div>
      <RegularWidget title="Entités">
        <q-stepper
          v-model="step"
          vertical
          color="primary"
          animated
          class="no-shadow"
        >
          <q-step
            :name="1"
            title="Type d'action"
            :done="step > 1"
            class="merriweather"
          >
            <p>Sélectionner l'action à effectuer.</p>
            <q-stepper-navigation>
              <div class="row justify-end">
                <q-btn
                  square
                  flat
                  icon="mdi-shape-polygon-plus"
                  color="primary"
                  label="Créer"
                  class="merriweather"
                  @click="setStep({toStep:2, toActionType:'create'})"
                />
                <q-btn
                  square
                  flat
                  icon="mdi-cursor-default-click-outline"
                  color="primary"
                  label="Editer"
                  class="merriweather"
                  @click="setStep({toStep:3, toActionType:'edit'})"
                />
              </div>
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="Créer une entité"
            icon="create_new_folder"
            :done="step > 2"
            :disable="actionType === 'edit'"
            class="merriweather"
          >
            <p>Dessiner une nouvelle entité sur la carte.</p>
            <q-stepper-navigation>
              <div class="row justify-end">
                <q-btn
                  square
                  flat
                  color="primary"
                  label="Retour"
                  class="q-ml-sm"
                  @click="setStep({toStep:1})"
                />
                <q-btn
                  square
                  color="primary"
                  icon="done"
                  label="Continuer"
                  class="merriweather"
                  @click="setStep({toStep:4})"
                />
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
            class="merriweather"
          >
            <q-stepper-navigation>
              <feature-selector
                @selector-next="enableModification"
                @selector-back="setStep({toStep: 1})"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="4"
            title="Attributs"
            icon="view_headline"
            class="merriweather"
          >
            <p>Modifier les informations attributaires</p>
            <q-form class="q-gutter-md">
              <q-select
                v-model="featureType"
                :options="typologiesName"
                label="Types"
              />
              <q-input v-model="observation" label="Observation" />
            </q-form>
            <q-stepper-navigation>
              <div class="row justify-end">
                <q-btn
                  :loading="waiter"
                  square
                  flat
                  color="primary"
                  label="Retour"
                  class="shadow-1"
                  @click="setStep({toStep: 3})"
                />
                <q-space />
                <q-btn
                  :loading="waiter"
                  square
                  color="primary"
                  label="Supprimer"
                  class="q-mr-sm shadow-1"
                  @click="tester('supp')"
                />
                <q-btn
                  :loading="waiter"
                  square
                  color="positive"
                  label="Enregistrer"
                  class="shadow-1"
                  @click="tester('save')"
                />
              </div>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </RegularWidget>
    </div>

    <div class="q-pl-sm">
      <DrawTool
        :draw-mode="'ntm'">
      </DrawTool>
    </div>
  </div>
</template>

<script setup lang="ts">

import RegularWidget from '../RegularWidget/RegularWidget.vue';
import featureSelector from '../FeatureSelector/FeatureSelector.vue';
import { ref, Ref } from 'vue';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { ITypologies } from 'src/services/Api/types';
import { FeatureLike } from 'ol/Feature';
import { useMapStore } from 'src/stores/mapStore/map-store';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import DrawTool from '../DrawTool/DrawTool.vue';


const step = ref(1)
const actionType = ref('')
const featureType: Ref<string | undefined> = ref('')
const observation: Ref<string | undefined> = ref('')
const typologiesRaw = ApiRequestor.getTypologies()
const typologiesName: Ref<string[]> = ref([])
const waiter = ref(false)

const mapStore = useMapStore()

setTypologies(typologiesRaw)

/**
 * Fonction de modification des étapes
 * @param toStep Etape cible
 * @param toActionType Action cible
 */
function setStep({toStep, toActionType, toDrawMode}: {toStep: number, toActionType?: string, toDrawMode?: string}): void {
  step.value = toStep,
  toActionType ? actionType.value = toActionType : null
}

function tester(msg: string): void {
  console.log(msg)
}

/**
 * Définition du nom des typologies pour la liste de sélection
 * @param typologies Liste des typologies
 */
async function setTypologies(typologyPromise: Promise<ITypologies | undefined>): Promise<void> {
  const typologyList = await typologyPromise
  typologyList?.forEach(element => {
    typologiesName.value.push(element.typology_name)
  })
}

/**
 * Activation des modifications attributaires et géométriques
 * @param feature
 */
async function enableModification(feature: FeatureLike): Promise<void> {
  setStep({toStep:4})
  const editionLayer = mapStore.getLayerByName('Edition') as VectorLayer<VectorSource>

  // Récupération de l'entité non simplifiée et affichage sur le layer d'édition
  const fullFeature = await ApiRequestor.getFeatureById(feature.getId() as string)
  fullFeature ? editionLayer.getSource()?.addFeature(fullFeature) : null
  editionLayer.setVisible(true)

  // Gestion de la typologie de l'entité sélectionnée
  const typologies = await typologiesRaw
  const type = typologies?.find((element) => element.id_typology === feature.get('id_typology'))
  featureType.value = type?.typology_name
  observation.value = feature.get('commentaire')
}

</script>

<style lang="sass" scoped>
.global
  display: flex
</style>
