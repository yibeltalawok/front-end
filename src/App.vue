<template>
  <v-app id="app">
    <!-- loading -->
    <div id="app-loading" class="accent">
      <v-layout column justify-center align-center id="app-loading">
        <!-- <img src="@/assets/astralogo.png" width="300px" alt /> -->
         <div id="canvasContainer">
            <canvas id="riveCanvas1" class="mx-auto"></canvas>
          </div>
        <h3>Loading ...</h3>
        <p>Loading depends on your internet speed.</p>
      </v-layout>
    </div>

    <!-- notifications container -->
    <notifications :overlap="true" />

    <!-- main content -->
    <div>
      <router-view />
    </div>
  </v-app>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import Rive from "rive-canvas/rive.js"
import AccountService from "@/shared/services";


export default {

  data() {
    return {
      user: AccountService.getProfile(),
    }
  },

  sockets: {
        connect: function () {
                // eslint-disable-next-line no-console
            console.log('socket connected')
        },
      
    },

  computed: {
    ...mapGetters("core", ["showNetworkProgressBar"]),
    ...mapState("core", ["appName"]),
  },
  beforeCreate() {
    this.$store.commit("core/initializeStore");

    this.$store.subscribe((mutation, state) => {
      localStorage.setItem(
        "currentLanguage",
        JSON.stringify(state.core.currentLanguage)
      );
    });

          

  },

 
  mounted() {
    Rive({ 
              locateFile: (file) => '/node_modules/rive-canvas/'+ file,
            }).then((rive) => {
              const req = new Request('/rive/sample3.riv');
              
              fetch(req).then((res) => {
                return res.arrayBuffer();
              }).then((buf) => {
                // we've got the raw bytes of the animation,
                // let's load them into a Rive file
                const file = rive.load(new Uint8Array(buf));
                
                const artboard = file.defaultArtboard();
                // eslint-disable-next-line no-console
              // console.log(artboard)
                const mainAnim = artboard.animationByName('loadding');
                const myAnimInstance = new rive.LinearAnimationInstance(mainAnim);
                
                this.canvas = document.getElementById('riveCanvas1');
                const ctx = this.canvas.getContext('2d');
                const renderer = new rive.CanvasRenderer(ctx);
                
                // Get container size
                const canvasContainer = document.getElementById('canvasContainer')
                const canvasRect = canvasContainer.getBoundingClientRect()
                // Set canvas size
                this.canvas.width = canvasRect.width
                this.canvas.height = 100
                // this.canvas.height = 1000
                artboard.advance(0);
                ctx.save();
                renderer.align(rive.Fit.contain, rive.Alignment.center, {
                  minX: 0,
                  minY: 0,
                  maxX: this.canvas.width / 4,
                  maxY: this.canvas.height / 4
                }, artboard.bounds);
                artboard.draw(renderer);
                ctx.restore();
                let lastTime = 0;
                let canvas = this.canvas
                function draw(time) {
                  if (!lastTime) {
                    lastTime = time;
                  }
                  const elapsedTime = (time - lastTime) / 1000;
                  lastTime = time;
                  myAnimInstance.advance(elapsedTime); 
                  myAnimInstance.apply(artboard, 1.0);
                  artboard.advance(elapsedTime);
                  ctx.clearRect(0, 0, canvas.width , canvas.height);
                  ctx.save();
                  renderer.align(rive.Fit.contain, rive.Alignment.center, {
                    minX: 0,
                    minY: 0,
                    maxX: canvas.width,
                    maxY: canvas.height
                  }, artboard.bounds);
                  artboard.draw(renderer);
                  ctx.restore();
                  requestAnimationFrame(draw);
                }
                requestAnimationFrame(draw);
              })
            });
  },

  created() {
		// window.addEventListener("resize", this.onResize);

    window.onload = () => {
      const appLoadingDiv = document.getElementById("app-loading");
      appLoadingDiv.style.display = "none";
    };

    // eslint-disable-next-line no-console
    console.log("============================")
    // eslint-disable-next-line no-console
    console.log(this.user.id)
    // eslint-disable-next-line no-console
    console.log(localStorage.getItem("token"))
    this.$socket.emit('authentication', {id: this.user.id, userId: localStorage.getItem("token") });
    // eslint-disable-next-line no-console
    console.log("============================")
  },
  methods: {
		// onResize() {
		// 	const canvasContainer = document.getElementById('canvasContainer')
		// 	const canvasRect = canvasContainer.getBoundingClientRect()
		// 	// Set canvas size
		// 	this.canvas.width = canvasRect.width
		// 	this.canvas.height = canvasRect.height
		// }
	}
};


  
</script>

<style lang="scss">


body{
  overflow-y: hidden;
}
body::-webkit-scrollbar {
  display: none;
}


div.disabled {
    overflow-x: hidden; //horizontal
    overflow-y: scroll; //vertical
}
#app {
    overflow-y: auto;
}
#app::-webkit-scrollbar {
  display: none;
}
#app-loading {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
}
.links {
  text-decoration: none;
}

// #canvasContainer {
//   width: 100px;
//   height: 100px;
//   // background-color: black;
// }

//style- route indicator
#nprogress .bar {
  background: red !important;
}
#nprogress .spinner-icon {
  border-left-color: red !important;
  border-top-color: pink !important;
}

// form input
.theme--light .v-text-field--outline .v-input__slot {
  border: 1px solid #adadad;
}
.theme--light
  .v-text-field--outline:not(.v-input--is-focused)
  .v-input__slot:hover {
  border: 1px solid rgba(0, 0, 0, 0.87);
}

.label-text {
  color: #a7a1a1;
}

.v--modal-box.v--modal {
  top: 50px !important;
}
.modal-toolbar .v-toolbar__content {
  padding-right: 14px !important;
}
</style>

