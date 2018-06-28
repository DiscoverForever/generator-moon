<template>
  <div>
    <el-button-group>
      <el-button type="primary" size="medium" :plain="false" icon="el-icon-circle-plus-outline" @click="handleCreate">创建</el-button>
      <el-button type="primary" size="medium" :plain="false" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button type="primary" size="medium" :plain="false" icon="el-icon-search" @click="handleSearch">查询</el-button>
      <el-button type="primary" size="medium" :plain="false" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </el-button-group>
    <div class="table-wrapper">
    <el-table class="table" ref="multipleTable" :stripe="true" :border="true" :data="tableData" height="650" tooltip-effect="dark" highlight-current-row @selection-change="handleSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="250" prop="objectId" label="objectId"></el-table-column>
      <%_ entity.body.forEach(prop => { _%>
      <el-table-column width="120" prop="<%=prop.type.startsWith('Pointer_') ? `${prop.name}.objectId` : prop.name%>" label="<%=prop.javadoc%>" <%-prop.type==='Date' ? ':formatter="formatterDate"': ''%> sortable="custom"></el-table-column>
      <%_ })_%>
      <el-table-column width="200" prop="createdAt" label="创建时间" :formatter="formatterDate" sortable="custom"></el-table-column>
      <el-table-column width="200" prop="updatedAt" label="更新时间" :formatter="formatterDate" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="$router.push({path: '/entities/<%=entity.name%>/<%=entity.name%>-edit.g.vue', query: {objectId: scope.row.objectId}})" type="text" size="small">查看</el-button>
          <el-button @click="$router.push({path: '/entities/<%=entity.name%>/<%=entity.name%>-edit.g.vue', query: {objectId: scope.row.objectId}})" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>  
    </div>
    <div class="block">
      <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-sizes="[20, 50, 100, 200, 300, 400]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </div>
    <dialog-search :visiable="searchDialogVisiable" @close="searchDialogVisiable = false" @confirm="onConfirm"></dialog-search>
  </div>
</template>

<script>
import AV from 'leancloud-storage';
import DialogSearch from './dialog-search.g';
export default {
  data() {
    return {
      tableData: [],
      pageNumber: 1,
      pageSize: 20,
      total: 0,
      selectedRows: [],
      searchDialogVisiable: false,
      sortBy: 'createdAt',
      sortType: 'ascending'
    }
  },
  components: {DialogSearch},
  created() {
    this.queryEntityData();
  },
  methods: {
    async queryEntityData(skip = 0, limit = 20, sortBy = 'createdBy', sortType = 'ascending', conditions = []) {
      const <%=entity.name%>Query = new AV.Query('<%=entity.name%>');
      <%=entity.name%>Query.skip(skip);
      <%=entity.name%>Query.limit(limit);
      //if (sortType === 'ascending') <%=entity.name%>Query.ascending(sortBy);
      //if (sortType === 'descending') <%=entity.name%>Query.descending(sortBy);
      <%=entity.name%>Query[sortType](sortBy);
      conditions.forEach(condition => <%=entity.name%>Query[condition.condition](condition.key, condition.value));
      const tableDataList = await <%=entity.name%>Query.find();
      this.tableData = tableDataList.map(item => item.toJSON());
      this.total = await (new AV.Query('<%=entity.name%>').count());
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows;
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    formatterDate(row, column, cellValue) {
      return cellValue && cellValue.split('.')[0].replace(/[a-zA-Z]/g, '\n')
    },
    handleCreate() {
      this.$router.push({ path: '/entities/<%=entity.name%>/<%=entity.name%>-add.g.vue' })
    },
    async handleDelete() {
      await this.$confirm('确认删除？')
      const promiseList = this.selectedRows.map(selectedRow => AV.Object.createWithoutData('<%=entity.name%>', selectedRow.objectId));
      await AV.Object.destroyAll(promiseList);
      await this.handleRefresh();
    },
    handleSearch() {
      this.searchDialogVisiable = true;
    },
    handleRefresh() { 
      this.queryEntityData((this.pageNumber - 1) * this.pageSize, this.pageSize, this.sortBy, this.sortType);
    },
    onSortChange({ column, prop, order }) {
      this.sortBy = prop;
      this.sortType = order;
      this.handleRefresh();
    },
    onConfirm(params) {
      this.queryEntityData((this.pageNumber - 1) * this.pageSize, this.pageSize, this.sortBy, this.sortType, params)
    }
  },
  watch: {
    'pageSize'() {
      this.handleRefresh();
    },
    'pageNumber'() {
      this.handleRefresh();
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
</style>