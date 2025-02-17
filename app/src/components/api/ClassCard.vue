<template>
  <div class="card mb-4">
    <div class="card-header text-uppercase small border-bottom-0 py-1 px-3">
      class
    </div>
    <div class="card-body pb-0">
      <h5 class="mb-3">
        <code v-html="className"></code>
      </h5>
      <CodeBlock lang="js" class="mb-3">
        <pre>
import { {{ apiElement.name }} } from '@camptocamp/ogc-client';</pre
        >
      </CodeBlock>
      <div class="row">
        <div
          class="col-3 text-uppercase text-secondary fw-bold pt-1"
          style="font-size: 0.8em"
        >
          📦 constructor
        </div>
        <div class="col">
          <code class="mb-2" v-html="constructorSignature"></code>
          <MarkdownBlock
            v-if="apiElement.constructor.description"
            class="mb-2 small"
            :text="apiElement.constructor.description"
          />
        </div>
      </div>
      <div class="row" v-for="property in apiElement.properties">
        <div
          class="col-3 text-uppercase text-secondary fw-bold pt-1"
          style="font-size: 0.8em"
        >
          💡 property
        </div>
        <div class="col">
          <code class="mb-2" v-html="formatProperty(property)"></code>
          <MarkdownBlock
            v-if="property.description"
            class="mb-2 small"
            :text="property.description"
          />
        </div>
      </div>
      <div class="row" v-for="method in apiElement.methods">
        <div
          class="col-3 text-uppercase text-secondary fw-bold pt-1"
          style="font-size: 0.8em"
        >
          ⚡ method
        </div>
        <div class="col">
          <code class="mb-2" v-html="formatMethod(method)"></code>
          <div class="row pb-2">
            <div
              class="col-3 text-uppercase text-secondary fw-bold pt-1"
              style="font-size: 0.8em"
            >
              🌱️ returns
            </div>
            <div class="col">
              <code v-html="formatMethodReturned(method)"></code>
            </div>
          </div>
          <MarkdownBlock
            v-if="method.description"
            class="mb-2 small"
            :text="method.description"
          />
        </div>
      </div>
      <MarkdownBlock class="mb-3 mt-2 small" :text="apiElement.description" />
    </div>
  </div>
</template>

<script>
import MarkdownBlock from '../presentation/MarkdownBlock.vue';
import CodeBlock from '../presentation/CodeBlock.vue';
import * as marked from 'marked';
import {
  formatClassToString,
  formatConstructorToString,
  formatFunctionToString,
  formatTypeToString,
} from '../../api-utils';

export default {
  name: 'ClassCard',
  components: { MarkdownBlock, CodeBlock },
  props: {
    apiElement: Object,
  },
  methods: {
    formatMethod(method) {
      return marked.parseInline(formatFunctionToString(method));
    },
    formatMethodReturned(method) {
      return marked.parseInline(formatTypeToString(method.return));
    },
    formatProperty(property) {
      return marked.parseInline(
        `${property.name}: ${formatTypeToString(property)}`
      );
    },
  },
  computed: {
    className() {
      return marked.parseInline(formatClassToString(this.apiElement));
    },
    constructorSignature() {
      return marked.parseInline(formatConstructorToString(this.apiElement));
    },
  },
};
</script>

<style scoped>
.card-header {
  color: rgb(234, 108, 0);
  background: rgba(234, 108, 0, 0.03);
  letter-spacing: 2.5px;
  opacity: 0.6;
}
</style>
