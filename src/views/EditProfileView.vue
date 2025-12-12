<template>
  <div class="edit-profile-view">
    <h1>编辑个人信息</h1>
    <el-form label-width="100px" style="max-width: 600px">
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" placeholder="请输入个人简介" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group>
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
          <el-radio label="保密">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker type="date" placeholder="选择日期" style="width: 100%" />
      </el-form-item>
      <el-form-item label="地区">
        <el-input placeholder="请输入地区" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.edit-profile-view {
  padding: 20px;
}
</style>
