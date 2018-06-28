<template>
  <div class="<%=entity.name%>-add">
    <el-form ref="form" :model="formData" label-width="80px">
      <%_entity.body.forEach(prop => {_%>
      <%_var rules = prop.validations.map(validate => {
        if (validate.key === 'required') return {required: true, message: `${prop.javadoc}不能为空`} 
        else if (validate.key === 'maxlength') return {max: validate.value, message: `${prop.javadoc}长度最多${validate.value}个字符`} 
        else if (validate.key === 'minlength') return {min: validate.value, message: `${prop.javadoc}长度最少${validate.value}个字符`} 
        else if (validate.key === 'pattern') return {pattern: `/${validate.value}/`, message: `${prop.javadoc}需匹配${validate.value}`} 
        else return {[validate.key]: validate.value}
      })_%>
      <el-form-item label="<%=prop.javadoc%>" prop="<%=prop.name%>" :rules="<%-JSON.stringify(rules).replace(/"/g, '\'').replace(/'\/(.*?)\/'/g, '/$1/')%>">
        <%_if (prop.type === 'String') {_%>
        <el-input v-model="formData.<%=prop.name%>" clearable></el-input>
        <%_}_%>
        <%_if (prop.type === 'Date') {_%>
        <el-date-picker v-model="formData.<%=prop.name%>" type="datetime" placeholder="选择日期"></el-date-picker>
        <%_}_%>
        <%if (prop.type === 'Integer' || prop.type === 'Long' || prop.type === 'BigDecimal' || prop.type === 'Float' || prop.type === 'Double') {%>
        <el-input v-model.number="formData.<%=prop.name%>" clearable></el-input>
        <%_}_%>
        <%_if (prop.type === 'Boolean') {_%>
        <el-select v-model="formData.<%=prop.name%>" placeholder="请选择活动区域">
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
        <%_}_%>
        <%_if (enums.find(enumItem => enumItem.name === prop.type)) {_%>
        <el-select v-model="formData.<%=prop.name%>" placeholder="请选择">
          <%_enums.find(enumItem => enumItem.name === prop.type).values.forEach((enumVal, index) => {_%>
          <el-option label="<%=enumVal%>" :value="<%=index%>"></el-option>
          <%_})_%>
        </el-select>
        <%_}_%>
      </el-form-item>
      <%_})_%>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <!-- <el-button @click="onCancle">取消</el-button> -->
        <el-button @click="$refs.form.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AV from 'leancloud-storage';
export default {
  name: '<%=entity.name%>-add',
  data() {
    return {
      formData: {
        <%_entity.body.forEach(prop => {_%>
        <%=prop.name%>: '',
        <%_})_%>
      }
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const <%=entity.name.toLowerCase()%> = new AV.Object('<%=entity.name%>')
            <%_entity.body.forEach(prop => {_%>
            <%=entity.name.toLowerCase()%>.set('<%=prop.name%>', <%=prop.type === 'Date' ? `new Date(this.formData.${prop.name})` : `this.formData.${prop.name}`%>)
            <%_})_%>
            await <%=entity.name.toLowerCase()%>.save();
            this.$message.success('创建成功');
          } catch (error) {
            this.$message.error(`创建失败,${error.code}:${error.message}`);
          }
        } else {
          this.$message.warning('请将表单填写完整');
        }
      });
    },
    onCancle() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.el-form {
  margin: 20px;
}
</style>
