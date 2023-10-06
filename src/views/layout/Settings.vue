<script setup lang="ts">
import {useSettingsStore} from "@/stores/settings";
import {storeToRefs} from "pinia";

const settingStore = useSettingsStore();
const {historyExpiredHours} = storeToRefs(settingStore);
</script>

<template>
  <div class="settings">
    <el-card shadow="never">
      <el-form>
       <el-tooltip content="记录数过多可能导致卡顿、加载缓慢">
         <el-form-item label="记录保留时长：">
           <el-radio-group v-model="historyExpiredHours">
             <el-radio label="12" >12小时</el-radio>
             <el-radio label="24">24小时</el-radio>
             <el-radio label="48">48小时</el-radio>
           </el-radio-group>
         </el-form-item>
       </el-tooltip>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.settings {
  flex: 1;
  padding: 16px;
  .el-form-item:last-child{
    margin-bottom: 0;
  }
}
</style>
