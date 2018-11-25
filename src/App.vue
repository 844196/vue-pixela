<template>
  <div id="app">
    <pixela-graph :username="username" :graphId="graphId" mode="short" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PixelaGraph from './components/PixelaGraph';

@Component({
  components: {
    PixelaGraph,
  },
})
export default class App extends Vue {
  private username = '';
  private graphId = '';
}
</script>
