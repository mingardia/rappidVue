<template>
  <div>
    <p>
      The objects are labeled by how they are created. Left ( define ), 2
      shape.standard.Records, Right ( minimal type script class)
    </p>
    <p>far right is created via namespace</p>

    <ul>
      <li>
        <p>
          Only the standard ones will collapse as expected which clicking on a -
          or +
        </p>
      </li>
      <li>
        <p>
          <b>
            Links drawn between the two standard ones link appropriately, with
            the line being displayed outside of the element
          </b>
        </p>
        <p>
          <b>
            Lines between a child class be that javascript defined, or type
            script defined result in the line attaching to the element
          </b>
        </p>
      </li>
    </ul>
    <div class="canvas" ref="canvas"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { dia, ui, shapes, util } from "@clientio/rappid";
import MyRecord from "./myShapes";

@Options({
  components: {},
})
export default class App extends Vue {
  private graph!: dia.Graph;
  private paper!: dia.Paper;
  private scroller!: ui.PaperScroller;

  public $refs!: {
    canvas: HTMLDivElement;
  };

  public created(): void {
    const graph = (this.graph = new dia.Graph({}, { cellNamespace: shapes }));

    const paper = (this.paper = new dia.Paper({
      model: graph,
      background: {
        color: "#F8F9FA",
      },
      width: 1124,
      frozen: true,
      async: true,
      cellViewNamespace: shapes,
      gridSize: 5,
      drawGrid: true,
      interactive: {
        linkMove: false,
        labelMove: true,
        arrowheadMove: false,
        vertexMove: false,
        vertexAdd: false,
        vertexRemove: false,
        useLinkTools: false,
      },
    }));

    const scroller = (this.scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: false,
      //cursor: "grab"
    }));

    scroller.render();

    //*********** Define a new Record type using define method ...  **********/
    var MappingRecord = shapes.standard.HeaderedRecord.define(
      "mapping.Record",
      {
        itemHeight: 20,
        itemOffset: 15,
        itemMinLabelWidth: 70,
        padding: { top: 35, left: 10, right: 10, bottom: 10 },
        size: { height: 100 },
        itemOverflow: true,
        attrs: {
        root: {
          magnet: false,
        },
        header: {
          fill: "#31d0c6",
        },
        footer: {
          height: 10,
          x: 0,
          refDy: -10,
          refWidth: "100%",
          fill: "#31d0c6",
          stroke: "black",
        },
        headerLabel: {
          fontFamily: "Sans-serif",
          fontWeight: "bold",
          textWrap: {
            ellipsis: true,
            height: 30,
          },
        },
        group_0: {
          scrollTop: 0,
        },
        buttonsGroups: {
          stroke: "black",
        },
        forksGroups: {
          stroke: "lightgray",
        },
        itemBodies: {
          itemHighlight: {
            stroke: "#000000",
          },
        },
        itemLabels: {
          magnet: "true",
          cursor: "pointer",
          fontSize: 12,
          fontFamily: "Sans-serif",
          itemHighlight: {
            fill: "#fe854f",
          },
        },
        itemLabels_disabled: {
          magnet: null,
          fill: "#aaaaaa",
          cursor: "not-allowed",
        },
      }
      },
      {
         setName: function(name :string, opt :any) {
            this.attr(['headerLabel', 'textWrap', 'text'], name, opt);
        },
        markup: [{
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'rect',
            selector: 'header'
        }, {
            tagName: 'text',
            selector: 'headerLabel'
        }, {
            tagName: 'rect',
            selector: 'footer'
        }] 
      },
      {
           attributes: {
            //@ts-ignore   
            ...shapes.standard.Record.attributes
           }
      }
    );

    Object.assign(shapes, {
    mapping : {
        MappingRecord
    }
});

//@ts-ignore
  shapes.mapping.RecordView = shapes.standard.RecordView.extend({

        presentationAttributes: shapes.standard.RecordView.addPresentationAttributes({
            attrs: ['TOOLS']
        }),

        getMagnetFromLinkEnd: function(end :any) {
            var itemId = end.port;
            var model = this.model;

            while (itemId && !model.isItemVisible(itemId)) itemId = model.getItemParentId(itemId);
            if (!itemId) {
                // The connected magnet is not an item (it's a port or arbitrary sub-node)
                //@ts-ignore
                return dia.ElementViewPrototype.getMagnetFromLinkEnd.apply(this, arguments);
            }

            const sign = model.getItemOutsideViewSign(itemId);
            if (sign !== 0) {
                return this.findBySelector(sign < 0 ? 'header' : 'footer', this.el, this.selectors)[0];
            }
            var selector = model.getSelector('itemBody', itemId);
            return this.findBySelector(selector, this.el, this.selectors)[0];
        },

    });


var items = [
        [
          {
            id: ":TS Inline new",
            label: ":TS Inline (new)",

            highlighted: true,
            items: [
              {
                id: "order",
                label: "Order",

                items: [
                  {
                    id: "order_id",
                    label: "id",
                  },
                  {
                    id: "order_name",
                    label: "name",
                  },
                  {
                    id: "order_email",
                    label: "email",
                  },
                  {
                    id: "order_entry_date",
                    label: "entry_date",

                    items: [
                      {
                        id: "entry_date_year",
                        label: "year",
                      },
                      {
                        id: "entry_date_month",
                        label: "month",
                      },
                      {
                        id: "entry_date_day",
                        label: "day",
                      },
                    ],
                  },
                  {
                    id: "address",
                    label: "address",
                    items: [
                      {
                        id: "address_city",
                        label: "city",
                      },
                      {
                        id: "address_street",
                        label: "street",
                      },
                      {
                        id: "address_number",
                        label: "number",
                      },
                      {
                        id: "address_shipping",
                        label: "shipping",
                      },
                      {
                        id: "address_billing",
                        label: "billing",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      ]

    var order = new MappingRecord().set({items: items});

    order.position(100, 200);
    order.addTo(graph);

    // Use the "standard record type"
    var order15 = new shapes.standard.Record({
      itemHeight: 20,
      itemOffset: 15,
      itemMinLabelWidth: 70,
      padding: { top: 35, left: 10, right: 10, bottom: 10 },
      size: { height: 100, width: 50 },
      itemOverflow: true,
      attrs: {
        root: {
          magnet: false,
        },
        header: {
          fill: "#31d0c6",
        },
        footer: {
          height: 10,
          x: 0,
          refDy: -10,
          refWidth: "100%",
          fill: "#31d0c6",
          stroke: "black",
        },
        headerLabel: {
          fontFamily: "Sans-serif",
          fontWeight: "bold",
          textWrap: {
            ellipsis: true,
            height: 30,
          },
        },
        group_0: {
          scrollTop: 0,
        },
        buttonsGroups: {
          stroke: "black",
        },
        forksGroups: {
          stroke: "lightgray",
        },
        itemBodies: {
          itemHighlight: {
            stroke: "#000000",
          },
        },
        itemLabels: {
          magnet: "true",
          cursor: "pointer",
          fontSize: 12,
          fontFamily: "Sans-serif",
          itemHighlight: {
            fill: "#fe854f",
          },
        },
        itemLabels_disabled: {
          magnet: null,
          fill: "#aaaaaa",
          cursor: "not-allowed",
        },
      },
      items: [
        [
          {
            id: "file1",
            label: "Standard: Record",

            highlighted: true,
            items: [
              {
                id: "order",
                label: "Order",
                items: [
                  {
                    id: "order_id",
                    label: "id",
                  },
                  {
                    id: "order_name",
                    label: "name",
                  },
                  {
                    id: "order_email",
                    label: "email",
                  },
                  {
                    id: "order_entry_date",
                    label: "entry_date",

                    items: [
                      {
                        id: "entry_date_year",
                        label: "year",
                      },
                      {
                        id: "entry_date_month",
                        label: "month",
                      },
                      {
                        id: "entry_date_day",
                        label: "day",
                      },
                    ],
                  },
                  {
                    id: "address",
                    label: "address",
                    items: [
                      {
                        id: "address_city",
                        label: "city",
                      },
                      {
                        id: "address_street",
                        label: "street",
                      },
                      {
                        id: "address_number",
                        label: "number",
                      },
                      {
                        id: "address_shipping",
                        label: "shipping",
                      },
                      {
                        id: "address_billing",
                        label: "billing",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      ],
    });
    //order.setName('Order');
    order15.position(300, 200);
    order15.addTo(graph);

    var order2 = new shapes.standard.Record({
      itemHeight: 20,
      itemOffset: 15,
      itemMinLabelWidth: 70,
      padding: { top: 35, left: 10, right: 10, bottom: 10 },
      size: { height: 100, width: 50 },
      itemOverflow: true,
      attrs: {
        root: {
          magnet: false,
        },
        header: {
          fill: "#31d0c6",
        },
        footer: {
          height: 10,
          x: 0,
          refDy: -10,
          refWidth: "100%",
          fill: "#31d0c6",
          stroke: "black",
        },
        headerLabel: {
          fontFamily: "Sans-serif",
          fontWeight: "bold",
          textWrap: {
            ellipsis: true,
            height: 30,
          },
        },
        group_0: {
          scrollTop: 0,
        },
        buttonsGroups: {
          stroke: "black",
        },
        forksGroups: {
          stroke: "lightgray",
        },
        itemBodies: {
          itemHighlight: {
            stroke: "#000000",
          },
        },
        itemLabels: {
          magnet: "true",
          cursor: "pointer",
          fontSize: 12,
          fontFamily: "Sans-serif",
          itemHighlight: {
            fill: "#fe854f",
          },
        },
        itemLabels_disabled: {
          magnet: null,
          fill: "#aaaaaa",
          cursor: "not-allowed",
        },
      },
      items: [
        [
          {
            id: "file",
            label: "Standard: Record",

            highlighted: true,
            items: [
              {
                id: "order",
                label: "Order",
                items: [
                  {
                    id: "order_id",
                    label: "id",
                  },
                  {
                    id: "order_name",
                    label: "name",
                  },
                  {
                    id: "order_email",
                    label: "email",
                  },
                  {
                    id: "order_entry_date",
                    label: "entry_date",

                    items: [
                      {
                        id: "entry_date_year",
                        label: "year",
                      },
                      {
                        id: "entry_date_month",
                        label: "month",
                      },
                      {
                        id: "entry_date_day",
                        label: "day",
                      },
                    ],
                  },
                  {
                    id: "address",
                    label: "address",
                    items: [
                      {
                        id: "address_city",
                        label: "city",
                      },
                      {
                        id: "address_street",
                        label: "street",
                      },
                      {
                        id: "address_number",
                        label: "number",
                      },
                      {
                        id: "address_shipping",
                        label: "shipping",
                      },
                      {
                        id: "address_billing",
                        label: "billing",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      ],
    });
    //order.setName('Order');
    order2.position(500, 200);
    order2.addTo(graph);

    // Using Type Script Definition
    var order3 = new MyRecord({
      itemHeight: 20,
      itemOffset: 15,
      itemMinLabelWidth: 70,
      padding: { top: 35, left: 10, right: 10, bottom: 10 },
      size: { height: 100, width: 50 },
      itemOverflow: true,
      attrs: {
        root: {
          magnet: false,
        },
        header: {
          fill: "#31d0c6",
        },
        footer: {
          height: 10,
          x: 0,
          refDy: -10,
          refWidth: "100%",
          fill: "#31d0c6",
          stroke: "black",
        },
        headerLabel: {
          fontFamily: "Sans-serif",
          fontWeight: "bold",
          textWrap: {
            ellipsis: true,
            height: 30,
          },
        },
        group_0: {
          scrollTop: 0,
        },
        buttonsGroups: {
          stroke: "black",
        },
        forksGroups: {
          stroke: "lightgray",
        },
        itemBodies: {
          itemHighlight: {
            stroke: "#000000",
          },
        },
        itemLabels: {
          magnet: "true",
          cursor: "pointer",
          fontSize: 12,
          fontFamily: "Sans-serif",
          itemHighlight: {
            fill: "#fe854f",
          },
        },
        itemLabels_disabled: {
          magnet: null,
          fill: "#aaaaaa",
          cursor: "not-allowed",
        },
      },
      items: [
        [
          {
            id: "TypeScriptNew",
            label: "TS:Import (new)",

            highlighted: true,
            items: [
              {
                id: "order",
                label: "Order",
                items: [
                  {
                    id: "order_id",
                    label: "id",
                  },
                  {
                    id: "order_name",
                    label: "name",
                  },
                  {
                    id: "order_email",
                    label: "email",
                  },
                  {
                    id: "order_entry_date",
                    label: "entry_date",

                    items: [
                      {
                        id: "entry_date_year",
                        label: "year",
                      },
                      {
                        id: "entry_date_month",
                        label: "month",
                      },
                      {
                        id: "entry_date_day",
                        label: "day",
                      },
                    ],
                  },
                  {
                    id: "address",
                    label: "address",
                    items: [
                      {
                        id: "address_city",
                        label: "city",
                      },
                      {
                        id: "address_street",
                        label: "street",
                      },
                      {
                        id: "address_number",
                        label: "number",
                      },
                      {
                        id: "address_shipping",
                        label: "shipping",
                      },
                      {
                        id: "address_billing",
                        label: "billing",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      ],
    });

    order3.position(700, 200);
    order3.addTo(graph);

    // Attempt to new directly from type

    //@ts-ignore
    var order4 = new shapes.mynamespace.MyRecord({
      itemHeight: 20,
      itemOffset: 15,
      itemMinLabelWidth: 70,
      padding: { top: 35, left: 10, right: 10, bottom: 10 },
      size: { height: 100, width: 50 },
      itemOverflow: true,
      attrs: {
        root: {
          magnet: false,
        },
        header: {
          fill: "#31d0c6",
        },
        footer: {
          height: 10,
          x: 0,
          refDy: -10,
          refWidth: "100%",
          fill: "#31d0c6",
          stroke: "black",
        },
        headerLabel: {
          fontFamily: "Sans-serif",
          fontWeight: "bold",
          textWrap: {
            ellipsis: true,
            height: 30,
          },
        },
        group_0: {
          scrollTop: 0,
        },
        buttonsGroups: {
          stroke: "black",
        },
        forksGroups: {
          stroke: "lightgray",
        },
        itemBodies: {
          itemHighlight: {
            stroke: "#000000",
          },
        },
        itemLabels: {
          magnet: "true",
          cursor: "pointer",
          fontSize: 12,
          fontFamily: "Sans-serif",
          itemHighlight: {
            fill: "#fe854f",
          },
        },
        itemLabels_disabled: {
          magnet: null,
          fill: "#aaaaaa",
          cursor: "not-allowed",
        },
      },
      items: [
        [
          {
            id: "file4",
            label: "MySpace:JS: via namespace",

            highlighted: true,
            items: [
              {
                id: "order",
                label: "Order",
                items: [
                  {
                    id: "order_id",
                    label: "id",
                  },
                  {
                    id: "order_name",
                    label: "name",
                  },
                  {
                    id: "order_email",
                    label: "email",
                  },
                  {
                    id: "order_entry_date",
                    label: "entry_date",

                    items: [
                      {
                        id: "entry_date_year",
                        label: "year",
                      },
                      {
                        id: "entry_date_month",
                        label: "month",
                      },
                      {
                        id: "entry_date_day",
                        label: "day",
                      },
                    ],
                  },
                  {
                    id: "address",
                    label: "address",
                    items: [
                      {
                        id: "address_city",
                        label: "city",
                      },
                      {
                        id: "address_street",
                        label: "street",
                      },
                      {
                        id: "address_number",
                        label: "number",
                      },
                      {
                        id: "address_shipping",
                        label: "shipping",
                      },
                      {
                        id: "address_billing",
                        label: "billing",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      ],
    });

    order4.position(900, 200);
    order4.addTo(graph);
  }

  public mounted(): void {
    const {
      scroller,
      paper,
      $refs: { canvas },
    } = this;

    canvas.appendChild(this.scroller.el);
    //scroller.center();
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
      border: 1px solid #a0a0a0;
    }
  }
}
</style>
