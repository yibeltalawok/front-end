<template>
   <div id="canvasContainer">
      <canvas id="riveCanvas1" class="mx-auto"></canvas>
    </div>
</template>

<script>
import Rive from "rive-canvas/rive.js"

export default {

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
              console.log(artboard)
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
}
</script>

<style>

</style>