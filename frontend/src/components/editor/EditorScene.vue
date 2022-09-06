<template>
  <div class="scene-canvas full-size">

    <Scene class="full-size" :sceneObjects="sceneObjects" :currentFrame="testCases.currentFrame()" :isRunning="isRunning"></Scene>

    <div class="download-container" v-if="isRunning">
      <i class="fa-solid fa-download" @click="download"></i>
    </div>

    <div class="buttons-container" v-if="!isRunning">
      <button class="algo-button-default" @click="addNewSceneObject()">Dodaj nowy obiekt</button> <br/><br/>
      <button v-if="sceneObjects.length" class="algo-button-default" @click="showSceneObjects()">Konfiguruj obiekty</button>
    </div>

    <div class="scene-navigation" v-if="isRunning">

      <i v-for="icon in icons.slice(0, 2)" :key="icon.icon"
        :class="icon.icon"
        @click="icon.action"
      />
      <span class="frame-number">{{testCases.current().selectedFrameId+1}}/{{testCases.current().frames.length}}</span>
      
      <i v-for="icon in icons.slice(2)" :key="icon.icon"
        :class="icon.icon"
        @click="icon.action"
      />

    </div>
  </div>
</template>

<script>
import Scene from './Scene.vue';

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

        showSceneObjects() {
            this.$root.openDialog("ShowSceneObjectsModal", {
                sceneObjects: this.$props.sceneObjects,
                code: this.$props.code,
                variables: this.$props.variables,
                breakpoints: this.$props.breakpoints,
                language: this.language
            });
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
    components: { Scene }
}
</script>

<style scoped>
  .scene-canvas {
    position: relative;
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

  .buttons-container {
    color: black;
    position: absolute;
    width: 100%;
    text-align: center;
    top: 45%;
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
