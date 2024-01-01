<template>
  <RegularWidget>

    <template #header>
      Entités
    </template>

    <template #component>
      <q-stepper v-model="step" vertical color="primary" animated class="no-shadow regular-stepper">

        <q-step :name="1" title="Type d'action" :done="step > 1" class="merriweather">
          <p>Sélectionner l'action à effectuer.</p>
          <q-stepper-navigation>
            <div class="row justify-end">
              <q-btn square flat icon="mdi-shape-polygon-plus" color="primary" label="Créer" class="merriweather"
                @click="setStep({ toStep: 3, toDrawMode: 'addFeature' })" />
              <q-btn square flat icon="mdi-cursor-default-click-outline" color="primary" label="Editer"
                class="merriweather" @click="setStep({ toStep: 2 })" />
            </div>
          </q-stepper-navigation>
        </q-step>

        <q-step :name="2" title="Sélectionner une entité" icon="ads_click" active-icon="ads_click" :done="step > 2"
          :disable="drawMode === 'addFeature'" class="merriweather">
          <q-stepper-navigation>
            <feature-selector @selector-next="enableModification" @selector-back="setStep({ toStep: 1 })" />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="3" title="Attributs" icon="view_headline" class="merriweather">

          <!-- Mode ajout de feature -->
          <div v-if="drawMode === 'addFeature'">
            <p>Ajouter les informations attributaires</p>

            <q-form @reset="onReset" class="q-gutter-md">
              <q-select v-model="insertType" :options="typologiesFormatted" option-label="typology_name"
                option-value="id_typology" label="Types" />
              <q-input v-model="observation" label="Observation" />

              <div class="row justify-end">
                <q-btn :disabled="pendingTransaction" label="Retour" type="reset" color="primary" flat class="q-ml-sm" />
                <q-space />
                <q-btn :disabled="pendingTransaction" label="Enregistrer" square color="positive"
                  @click="inserting = true" />
              </div>
            </q-form>

            <!-- Popup création de feature-->
            <q-dialog v-model="inserting" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="save" color="primary" text-color="white" />
                  <span class="q-ml-sm merriweather">Confirmer l'insertion en base</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat class="merriweather" label="Annuler" color="primary" v-close-popup />
                  <q-space />
                  <q-btn flat class="merriweather" label="Insérer" color="primary" @click="serverTransaction('insert')"
                    v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

          </div>

          <!-- Mode modification de feature -->
          <div v-if="drawMode === 'modifyFeature'">
            <p>Modifier les informations attributaires</p>

            <q-form @reset="onReset" class="q-gutter-md">
              <q-select v-model="updateType" :options="typologiesFormatted" option-label="typology_name"
                option-value="id_typology" label="Types" />
              <q-input v-model="observation" label="Observation" />

              <div class="row justify-end">
                <q-btn :disabled="pendingTransaction" label="Retour" type="reset" color="primary" flat class="q-ml-sm" />
                <q-space />
                <q-btn :disabled="pendingTransaction" label="Supprimer" square color="primary" class="q-mr-sm"
                  @click="deleting = true" />
                <q-btn :disabled="pendingTransaction" label="Enregistrer" square color="positive"
                  @click="updating = true" />
              </div>
            </q-form>

            <!-- Popup supression de feature-->
            <q-dialog v-model="deleting" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="sym_o_delete" color="primary" text-color="white" />
                  <span class="q-ml-sm merriweather">Cette action est définitive. Confirmer la suppression ?</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat class="merriweather" label="Annuler" color="primary" v-close-popup />
                  <q-btn flat class="merriweather" label="Supprimer" color="primary" @click="serverTransaction('delete')"
                    v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!-- Popup de mise à jour de feature-->
            <q-dialog v-model="updating" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="save" color="primary" text-color="white" />
                  <span class="q-ml-sm merriweather">Cette action est définitive. Confirmer les modifications ?</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat class="merriweather" label="Annuler" color="primary" v-close-popup />
                  <q-btn flat class="merriweather" label="Enregistrer" color="primary"
                    @click="serverTransaction('update')" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

          </div>
        </q-step>

      </q-stepper>
    </template>

    <template #external>
      <DrawTool v-if="drawMode !== ''" :draw-mode="drawMode" :feature-id="featureId" :pending-state="pendingTransaction">
      </DrawTool>
    </template>
  </RegularWidget>
</template>

<script setup lang="ts">

import RegularWidget from '../RegularWidget/RegularWidget.vue';
import featureSelector from '../FeatureSelector/FeatureSelector.vue';
import { ref, Ref } from 'vue';
import ApiRequestor from 'src/services/Api/ApiRequestor';
import { ISQLTypologies, ITypologies } from 'src/services/Api/types';
import { FeatureLike } from 'ol/Feature';
import { useMapStore } from 'src/stores/mapStore/map-store';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import DrawTool from '../DrawTool/DrawTool.vue';
import { VECTOR_LAYERS_SETTINGS, VECTOR_TILE_LAYERS_SETTINGS } from 'src/map/layers/enum';
import VectorTileLayer from 'ol/layer/VectorTile';
import { ITransactionMode } from 'src/services/TransactionServices/type';
import { IDrawMode } from '../DrawTool/types';


const step = ref(1)
const updateType: Ref<ISQLTypologies | undefined> = ref(undefined)
const insertType: Ref<ISQLTypologies | undefined> = ref(undefined)
const observation: Ref<string | undefined> = ref('')
const typologiesRaw = ApiRequestor.getTypologies()
const drawMode: Ref<IDrawMode> = ref('')
const mapStore = useMapStore()
const editionLayer = mapStore.getLayerByName(VECTOR_LAYERS_SETTINGS.EDITION_LAYER.NAME) as VectorLayer<VectorSource>
const pendingTransaction = ref(false)
const deleting = ref(false)
const updating = ref(false)
const inserting = ref(false)


let featureId: string | number | undefined
let typologiesFormatted: ITypologies | undefined = undefined



/**
 * Fonction de modification des étapes
 * @param toStep Etape cible
 * @param toDrawMode Mode de dessin
 */
function setStep({ toStep, toDrawMode }: { toStep: number, toDrawMode?: IDrawMode }): void {
  step.value = toStep;
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
  setStep({ toStep: 3, toDrawMode: 'modifyFeature' })
  featureId = feature.getId()

  // Gestion de la typologie de l'entité sélectionnée
  const typologies = await typologiesRaw

  // Attribution des valeurs du formulaire
  updateType.value = typologies?.find((element) => element.id_typology === feature.get('id_typology'))
  observation.value = feature.get('commentaire')
}



/**
 * Fonction de récupération de la valeur d'insertion par défaut
 */
async function setinsertType(): Promise<void> {
  const typologies = await typologiesRaw
  insertType.value = typologies?.find((element) => element.id_typology === 0)
}




/**
 * Fonction de transaction
 * @param mode Mode de transaction (insert, update, delete)
 */
async function serverTransaction(mode: ITransactionMode): Promise<void> {
  pendingTransaction.value = true
  const feature = editionLayer.getSource()?.getFeatures()[0]

  // Récupération des valeurs du formulaire
  feature?.set('commentaire', observation.value);

  if (mode === 'update' || mode === 'delete') {
    feature?.set('id_typology', updateType.value?.id_typology);
  } else {
    feature?.set('id_typology', insertType.value?.id_typology);
  }




  // Execution de la transaction
  const wfsTransactionResult = await ApiRequestor.wfsTransaction(feature, mode)

  // Supression de la géométrie si mode === delete
  if (mode === 'delete' && wfsTransactionResult.result) {
    editionLayer.getSource()?.clear()
    setStep({
      toStep: 1
    })
  }
  // Passage en mode édition si mode === insert
  else if (mode === 'insert' && wfsTransactionResult.result) {
    setStep({
      toStep: 3,
      toDrawMode: 'modifyFeature'
    })
    feature?.setId(wfsTransactionResult.id)
    updateType.value = insertType.value
  }

  // rafraichissement du layer et desactivation du mode transaction
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
function onReset(): void {
  if (drawMode.value === 'modifyFeature') {
    setStep({
      toStep: 2
    })
  } else {
    setStep({
      toStep: 1
    })
  }
  editionLayer.getSource()?.clear()
  featureId = ''
  observation.value = ''
  updateType.value = undefined
}


setTypologies(typologiesRaw)
setinsertType()

</script>

<style lang="sass" scoped>
.regular-stepper
  background-color: $secondary
</style>
