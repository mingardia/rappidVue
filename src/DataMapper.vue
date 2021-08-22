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
export default class DataMapper extends Vue {
      public $refs!: {
      canvas: HTMLDivElement;
    }
}