<template>
  <div class="scene-canvas full-size">

    <Scene class="full-size" :sceneObjects="sceneObjects" :isRunning="isRunning"></Scene>

    <div class="download-container" v-if="isRunning">
      <i class="fa-solid fa-download" @click="download"></i>
    </div>

    <div class="buttons-container flex-center" v-if="!isRunning">
      <AlgoButton @click="addNewSceneObject()"><i class="fa-solid fa-square-plus"></i> Dodaj nowy obiekt</AlgoButton>
    </div>

    <div class="scene-objects-container" v-if="!isRunning">
      <div class="scene-object-tile flex-row flex-vertical-space-between"
        v-for="(sceneObject, index) of sceneObjects" :key="index"
        @click="configureSceneObject(sceneObject, $event)"
      >
        {{sceneObject.type.label}} {{sceneObject.variable.name}}
        <AlgoIcon type="x" @click="deleteSceneObject(index)"/>
      </div>
    </div>

    <div class="scene-navigation" v-if="isRunning">

      <i v-for="icon in icons.slice(0, 2)" :key="icon.icon"
        :class="icon.icon"
        @click="icon.action"
      ></i>
      <span class="frame-number">{{testCases.current().selectedFrameId+1}}/{{testCases.current().frames.length}}</span>
      
      <i v-for="icon in icons.slice(2)" :key="icon.icon"
        :class="icon.icon"
        @click="icon.action"
      ></i>

    </div>
  </div>
</template>

<script>
import Scene from './Scene.vue';
import AlgoButton from '../global/AlgoButton.vue';
import AlgoIcon from '../global/AlgoIcon.vue';

export default {
    props: ["testCases", "isRunning", "code", "variables", "breakpoints", "language", "sceneObjects"],
    data() {
        return {
            icons: [
                { icon: "fa-solid fa-backward-step", action: () => { this.setSelectedFrame(0); } },
                { icon: "fa-solid fa-backward", action: () => { this.setSelectedFrame(this.selectedFrameId - 1); } },
                /*{ icon: "fa-solid fa-play", action: () => { } },*/
                { icon: "fa-solid fa-forward", action: () => { this.setSelectedFrame(this.selectedFrameId + 1); } },
                { icon: "fa-solid fa-forward-step", action: () => { this.setSelectedFrame(this.numberOfFrames - 1); } },
            ]
        };
    },
    mounted() {
    },
    methods: {
        setSelectedFrame(selectedFrameId) {
            if (selectedFrameId >= 0 && selectedFrameId < this.numberOfFrames) {
                this.$props.testCases.current().selectedFrameId = selectedFrameId;
                this.emitter.emit('currentFrameChangedEvent', this.$props.testCases.currentFrame());
            }
        },

        addNewSceneObject() {
            this.$root.openDialog("ConfigureSceneObjectModal", {
                code: this.$props.code,
                variables: this.$props.variables,
                breakpoints: this.$props.breakpoints,
                language: this.language
            });
        },

        configureSceneObject(sceneObject, event) {
          if (event.target.localName === 'i') return;

          this.$root.openDialog("ConfigureSceneObjectModal", {
              sceneObject: sceneObject,
              code: this.$props.code,
              variables: this.$props.variables,
              breakpoints: this.$props.breakpoints,
              language: this.language
          });
        },

        deleteSceneObject(index) {
          let sceneObjects = this.$props.sceneObjects;
          sceneObjects.splice(index, 1);
          this.$emit("update:sceneObjects", sceneObjects);
        },

        download() {
          this.emitter.emit('downloadStageEvent');
        }
    },
    computed: {
      numberOfFrames() {
        return this.testCases.current().frames.length;
      },
      selectedFrameId() {
        return this.$props.testCases.current().selectedFrameId;
      }
    },
    components: { Scene, AlgoButton, AlgoIcon }
}
</script>

<style scoped>
  .scene-canvas {
    position: relative;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }

  .scene-navigation {
    color: black;
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 0px;
    font-size: 40px;
    user-select:none;
  }

  .scene-navigation i {
    margin: 0 10px;
    cursor: pointer;
  }

  .scene-objects-container {
    color: black;
    position: absolute;
    left: 0;
    top: 0;
  }

  .scene-object-tile {
    background: linear-gradient(#427AA1, #05668D);
    margin: 5px;
    padding: 5px 10px;
    color: white;
    border-radius: 10px;
    gap: 10px;
    cursor: pointer;
  }

  .buttons-container {
    color: black;
    position: absolute;
    width: 100%;
    text-align: center;
    top: 0;
    height: 100%;
  }

  .buttons-container button {
    font-size: 30px;
  }

  .download-container {
    color: black;
    position: absolute;
    text-align: right;
    top: 0px;
    right: 0px;
    font-size: 40px;
    user-select:none;
    padding-right: 10px;
    padding-top: 5px;
  }

  .frame-number {
    width: 150px;
    display: inline-block;
  }


</style>
