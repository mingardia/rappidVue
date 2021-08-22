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
      
    var graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = this.paper = new dia.Paper({
        model: graph,
        background: {
            color: '#F8F9FA',
        },
        frozen: true,
        async: true,
        cellViewNamespace: shapes,
        gridSize:5,
        drawGrid: true,
        interactive: {
            linkMove: false,
            labelMove: true,
            arrowheadMove: false,
            vertexMove: false,
            vertexAdd: false,
            vertexRemove: false,
            useLinkTools: false
        }
    });


    const scroller = this.scroller = new ui.PaperScroller({
        paper,
        autoResizePaper: false,
        cursor: 'grab'
    });

    scroller.render();

    let rect1:shapes.standard.Rectangle = new shapes.standard.Rectangle({
        position: { x: 100, y: 100 },
        
        size: { width: 100, height: 50 },
        attrs: {
          body : { fill: 'yellow'},
            label: {
                text: 'Hello World'
            }
        }
    });

    rect1.resize(100, 40);

    const rect2 = new shapes.standard.Rectangle({
        position: { x: 300, y: 100 },
        size: { width: 100, height: 50 },
        attrs: {
            label: {
                text: 'Hello World2'

            },
            body:{
              fill: '#E74C3C',
              rx: 20,
                ry: 20,
                strokeWidth: 0
            }
        }
    });

    graph.addCell(rect1);
    graph.addCell(rect2);

    var link = new shapes.standard.Link();
    link.source(rect1);
    link.target(rect2);
    link.attr('line/stroke', 'orange');
    link.labels(
         [
           { attrs:{
              text: {
                 text: 'Hello, World'
              }
            }
          }
        ]
    );

    link.addTo(graph);

    var CustomElement = dia.Element.define('examples.CustomElement', {
    attrs: {
        e: {
            strokeWidth: 1,
            stroke: '#000000',
            fill: 'rgba(255,0,0,0.3)'
        },
        r: {
            strokeWidth: 1,
            stroke: '#000000',
            fill: 'rgba(0,255,0,0.3)'
        },
        c: {
            strokeWidth: 1,
            stroke: '#000000',
            fill: 'rgba(0,0,255,0.3)'
        },
        outline: {
            refX: 0,
            refY: 0,
            refWidth: '100%',
            refHeight: '100%',
            strokeWidth: 1,
            stroke: '#000000',
            strokeDasharray: '5 5',
            strokeDashoffset: 2.5,
            fill: 'none'
        }
    }
}, {
    markup: [{
        tagName: 'ellipse',
        selector: 'e'
    }, {
        tagName: 'rect',
        selector: 'r'
    }, {
        tagName: 'circle',
        selector: 'c'
    }, {
        tagName: 'rect',
        selector: 'outline'
    }]
});
 var element = new CustomElement();
    element.attr({
        e: {
            refRx: '50%',
            refRy: '25%',
            refCx: '50%',
            refCy: 0,
            refX: '-50%',
            refY: '25%'
        },
        r: {
            refX: '100%',
            x: -10, // additional x offset
            refY: '100%',
            y: -10, // additional y offset
            refWidth: '50%',
            refHeight: '50%',
        },
        c: {
            refRCircumscribed: '50%',
            refCx: '50%',
            refCy: '50%'
        }
    });
    element.position(280, 130);
    element.resize(40, 40);
    element.addTo(graph);

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
