<template>
    <div class="canvas" ref="canvas"></div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { dia, ui, shapes } from '@clientio/rappid';

@Options({
  components: {
  },
})
export default class App extends Vue {
  public $refs!: {
   canvas: HTMLDivElement;
}

private graph!: dia.Graph;
private paper!: dia.Paper;
private scroller!: ui.PaperScroller;


public created() : void {
  console.log("Hello");
var graph = new dia.Graph({}, { cellNamespace: shapes });



const paper = this.paper = new dia.Paper({
    model: graph,
    background: {
        color: '#F8F9FA',
    },
    frozen: true,
    async: true,
    cellViewNamespace: shapes
});


const scroller = this.scroller = new ui.PaperScroller({
    paper,
    autoResizePaper: false,
    cursor: 'grab'
});

scroller.render();

const rect1 = new shapes.standard.Rectangle({
    position: { x: 100, y: 100 },
    size: { width: 100, height: 50 },
    attrs: {
        label: {
            text: 'Hello World'
    }
 }
});

const rect2 = new shapes.standard.Rectangle({
    position: { x: 300, y: 100 },
    size: { width: 100, height: 50 },
    attrs: {
        label: {
            text: 'Hello World2'
    }
 }
});

graph.addCell(rect1);
graph.addCell(rect2);

var link = new shapes.standard.Link();
link.source(rect1);
link.target(rect2);
link.addTo(graph);

}

public mounted(): void {
const { scroller, paper, $refs : { canvas } } = this;
canvas.appendChild(this.scroller.el);
scroller.center();
paper.unfreeze();
}
}
</script>

<style lang="scss">
@import "~@clientio/rappid/rappid.css";

 body {
   height: 100vh;
   box-sizing: border-box;
   margin: 0;

   .canvas {
     width: 100%;
     height: 100%;

     .joint-paper {
       border: 1px solid #A0A0A0;
     }
   }
 }
</style>
