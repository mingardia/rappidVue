import { dia, shapes } from "@clientio/rappid";

export class MyRecord extends shapes.standard.Record {
  defaults() {
    return {
        ...super.defaults,
        type: 'mapping.MyRecord'
    }
  }
}


Object.assign(shapes, {
    mynamespace : {
        MyRecord
    }
});

export default MyRecord;
