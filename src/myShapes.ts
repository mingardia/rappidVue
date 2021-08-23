import { dia, shapes } from "@clientio/rappid";

export class MyRecord extends shapes.standard.Record {
  defaults() {
    return {
        ...super.defaults,
        type: 'mynamespace.MyRecord'
    }
  }
}





Object.assign(shapes, {
    mynamespace : {
        MyRecord
    }
});

//@ts-ignore
shapes.mynamespace.MyRecordView = shapes.standard.RecordView.extend({

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

export default MyRecord;
