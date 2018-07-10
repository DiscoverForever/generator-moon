<template>
  <el-dialog title="查询条件" :visible.sync="dialogVisiable" @close="$emit('close')">
    <el-form>
      <el-form-item v-for="formItem in formItems" :key="formItem.id">
        <el-col :span="5">
          <el-select v-model="formItem.key" @change="formItem.type = fileds.find(filed => filed.name === formItem.key).type" placeholder="请选择">
            <el-option v-for="filed in fileds" :key="filed.id" :label="filed.label" :value="filed.value">
            </el-option>
          </el-select>

        </el-col>
        <el-col :span="5">
          <el-select v-model="formItem.condition" placeholder="请选择">
            <el-option v-for="condition in options.find(option => option.type === formItem.type).conditions" :key="condition.id" :label="condition.label" :value="condition.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-input width="100" v-model="formItem.value" placeholder="请输入内容">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleAddCondition">添加条件</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
const options = [
  {
    type: 'Number',
    conditions: [
      { label: '等于', value: 'equalTo' },
      { label: '不等于', value: 'notEqualTo' },
      { label: '大于', value: 'greaterThan' },
      { label: '大于等于', value: 'greaterThanOrEqualTo' },
      { label: '小于', value: 'lessThan' },
      { label: '小于等于', value: 'lessThanOrEqualTo' },
      { label: '存在', value: 'exists' },
      { label: '不存在', value: 'doesNotexists' },
    ]
  },
  {
    type: 'String',
    conditions: [
      { label: '等于', value: 'equalTo' },
      { label: '不等于', value: 'notEqualTo' },
      { label: '大于', value: 'greaterThan' },
      { label: '大于等于', value: 'greaterThanOrEqualTo' },
      { label: '小于', value: 'lessThan' },
      { label: '小于等于', value: 'lessThanOrEqualTo' },
      { label: '存在', value: 'exists' },
      { label: '不存在', value: 'doesNotexists' },
    ]
  },
  {
    type: 'Boolean',
    conditions: [
      { label: '等于', value: 'equalTo' },
      { label: '不等于', value: 'notEqualTo' },
      { label: '存在', value: 'exists' },
      { label: '不存在', value: 'doesNotexists' },
    ]
  },
  {
    type: 'Date',
    conditions: [
      { label: '等于', value: 'equalTo' },
      { label: '不等于', value: 'notEqualTo' },
      { label: '大于', value: 'greaterThan' },
      { label: '大于等于', value: 'greaterThanOrEqualTo' },
      { label: '小于', value: 'lessThan' },
      { label: '小于等于', value: 'lessThanOrEqualTo' },
      { label: '存在', value: 'exists' },
      { label: '不存在', value: 'doesNotexists' },
    ]
  },
  {
    type: 'Pointer',
    conditions: [
      { label: '等于', value: 'equalTo' }
    ]
  }
];
export default {
  name: 'dialog-search',
  data() {
    return {
      options,
      formItems: [
        { key: '', value: '', condition: '', type: 'String' }
      ],
      dialogVisiable: false
    }
  },
  props: {
    fileds: {
      type: Array,
      required: false,
      default() {
        return [{
          label: 'objectId',
          type: 'String',
          name: 'objectId',
          value: 'objectId'
        },
        <%entity.body.forEach(prop => {%>
        {
          label: '<%=prop.javadoc%>',
          type: '<%=prop.type%>',
          name: '<%=prop.name%>',
          value: '<%=prop.name%>'
        },
        <%})%>
        ]
      }
    },
    visiable: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    visiable() {
      this.dialogVisiable = this.visiable;
    }
  },
  methods: {
    handleAddCondition() {
      this.formItems.push({ key: '', value: '', condition: '', type: 'String' });
    },
    handleConfirm() {
      this.dialogVisiable = false;
      this.$emit('confirm', this.formItems)
    }
  }
}
</script>

<style scoped>
.el-col {
  border-radius: 4px;
  padding: 0 10px;
}
</style>
