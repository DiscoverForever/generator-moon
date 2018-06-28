function getTableHeader(props) {
  let str = '';
  props.forEach(prop => {
    str += `<el-table-column width="120" prop="${prop.name}" label="${prop.javadoc}"></el-table-column>`
  });
  return str;
}
module.exports.generateEntityTable = (entity) => {
  return `<template>
  <div>
    <el-button-group>
      <el-button type="primary" size="medium" :plain="true">添加行</el-button>
      <el-button type="primary" size="medium" :plain="true">删除行</el-button>
      <el-button type="primary" size="medium" :plain="true">添加列</el-button>
      <el-button type="primary" size="medium" :plain="true">查询</el-button>
      <el-button type="primary" size="medium" :plain="true">刷新</el-button>
      <el-button type="primary" size="medium" :plain="true">其他</el-button>
    </el-button-group>
    <el-table class="table" ref="multipleTable" :stripe="true" :border="true" :data="tableData" height="550" tooltip-effect="dark" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      ${getTableHeader(entity.body)}
    </el-table>
    <div class="block">
      <el-pagination background layout="prev, pager, next" :total="20">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AV from 'leancloud-storage';

export default {
  data() {
    return {
      tableData: [],
    }
  },
  props: {
    entityName: {
      type: String,
      required: true,
      default: '${entity.name}'
    }
  },
  created() {
    this.queryEntityData();
  },
  methods: {
    async queryEntityData() {
      const ${entity.name}Query = new AV.Query('${entity.name}');
      const tableDataList = await ${entity.name}Query.find();
      this.tableData = tableDataList.filter(item => item.toJSON());
    }
  }
}
</script>

<style scoped>
.block {
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-wrapper {
  padding: 20px;
  box-sizing: border-box;
}
.el-button-group {
  padding: 10px 20px;
}
</style>`;
}

