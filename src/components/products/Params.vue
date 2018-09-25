<template>
  <div class="params">
        <el-radio v-model="isPromis" label="true">是11</el-radio>
        <el-radio v-model="isPromis" label="false">否11</el-radio>

      <!-- <el-radio v-model="radio" label="1">备选项</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // is_promote: 1
      isPromis: 'false'
    }
  }
}
</script>


<style>
</style>
