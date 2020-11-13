<template>
  <div>
    <el-card>
      <div slot="header">
        <el-row :gutter="10">
          <el-col :xs="10" :sm="10" :md="12" :xl="12">
            <span style="float:left" class="main-header"> 
            <i class="el-icon-user"></i>
            Users
            </span>
          </el-col>
          <el-col :xs="10" :sm="10" :md="10" :xl="10">
        <span>        
        <el-input
          v-model="search"
          size="small"
          placeholder="Type to search">
           <i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>
        </span>
          </el-col>
          <el-col :xs="2" :sm="2" :md="2" :xl="2">
        <el-button size="small" type="warning"  icon="el-icon-plus" @click="addUser">Add New</el-button>
          </el-col>
        </el-row>
      </div>
    <el-row>
     <el-table
      ref="filterTable"
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"> 
      <el-table-column
        prop="name"
        label="NAME"
        >
      </el-table-column>
      <el-table-column
        prop="emailPersonal"
        label="EMAIL"
        
        >
    </el-table-column>
    <el-table-column
      prop="roleType"
      label="ROLE TYPE"
      >
    </el-table-column>
    <el-table-column
      prop="status"
      label="STATUS"
      align="center"
     >
      <template slot-scope="scope">
        <el-tag 
         size="small"
         effect="dark"
        :type="scope.row.status.toLowerCase() === 'pending' ? 'warning' :(scope.row.status.toLowerCase() === 'inactive'? 'danger': 'success')">
          {{scope.row.status.toUpperCase()}}</el-tag>
        
      </template>
    </el-table-column>
     <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          type="primary"          
          plain
          size="small"
          icon="el-icon-edit" 
          @click="handleEdit(scope.$index, scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-row>
    <el-row v-if="totalDataCount>0">
      <el-col style="padding:2%">
      <el-pagination
          background
          :page-size="5"
          layout="prev, pager, next"
          :total="totalDataCount"
          @next-click=nextClick
          @prev-click=prevClick
          @current-change=currentPageChange>
        </el-pagination>
      </el-col>
    </el-row>
    </el-card>

  <el-dialog
  title="Add User"
  :visible.sync="dialogVisible"
   :width="maxWidth < 1040 ? '50%' : '30%'"
   append-to-body
  >
  <el-card>
     <ValidationObserver ref="observer" v-slot="{ invalid , handleSubmit}" >
    <el-form ref="form">
    <el-row>
      <el-col :span="24">
        <validation-provider  v-slot="{errors}" name="name" rules="required" mode="eager" > 
        <el-form-item :error="errors[0]"> 
          <el-input
            placeholder="Enter Name Here"
            v-model="userModel.name"
            clearable
            size="small"
            name="name">
            </el-input>
       </el-form-item>
        </validation-provider>
        </el-col>
         <el-col :span="24">
       <validation-provider name="email" rules="required|email" mode="eager" v-slot="{errors}">
        <el-form-item :error="errors[0]">
       <el-input
        placeholder="Enter Email Here"
        v-model="userModel.emailPersonal"
        clearable
        size="small"
        name="email">
        </el-input>      
       </el-form-item>
       </validation-provider>
       </el-col>
       <el-col :span="24">
         <el-row type="flex" justify="start">
        <validation-provider name="role" rules="required" mode="eager" v-slot="{errors}">
        <el-form-item :error="errors[0]">
       <el-radio v-model="userModel.roleType" label="Admin" border size="small">Admin</el-radio>
       <el-radio v-model="userModel.roleType" label="Customer Executive" border size="small">Customer Executive</el-radio>
       <el-radio v-model="userModel.roleType" label="Customer" border size="small">Customer</el-radio>
       </el-form-item>
       </validation-provider>
       </el-row>
        </el-col>
         <el-col :span="24">
        <el-form-item>
     
       <el-input
        placeholder="Enter MobileNo Here"
        v-model="userModel.mobileNo"
        clearable
        size="small">
        </el-input>
      
       </el-form-item>
       </el-col>
       <el-col :span="24">
       <el-row type="flex" justify="end">
       <el-form-item>         
        <el-button @click="clear" size="small">Cancel</el-button>
        <el-button type="primary" :disabled="invalid || isSaveButtonDisable" @click="handleSubmit(saveUser)" size="small">Save</el-button>
       </el-form-item>
       </el-row>
       </el-col>
      </el-row>
    </el-form>
     </ValidationObserver>
  </el-card>
</el-dialog>
  </div>
</template>

<script>
 import { ValidationProvider, ValidationObserver  } from 'vee-validate';
  export default {
  components: {ValidationProvider, ValidationObserver },
    data() {
      return {
        tableData: [],
        search: '',
        dialogVisible: false,
        userModel: {},
        baseUrl: "https://localhost:44370",
        userId: "",
          pageNo: 1,
          perPage: 5,
          totalDataCount: 0,
          isSaveButtonDisable: false,
          maxWidth: window.innerWidth         
      }
    },
    mounted() {
      this.initUser();
      this.fetchUsers();      
     
    },
    methods: {
      initUser() {
        this.userModel = {
          name: "",
          emailPersonal: "",
          mobileNo: "",
          roleType: "",
          status: "inActive",
          createdAt: new Date(),
          LastUpdatedAt: new Date(),
          id: 0
        }
        this.fetchUsers();
      },
      fetchUsers: function () {
      const url  = this.baseUrl + '/api/user/getAll?pageNo=' + this.pageNo + "&perPage=" +this.perPage;
      this.$http.get(url)
      .then((result) => {
        this.tableData = result.data.data;
        this.totalDataCount = result.data.count;        
      }).catch(error => {          
          this.$message({message: error.response, type: 'error'});         
        });
    },
      resetDateFilter() {
        this.$refs.filterTable.clearFilter('date');
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      formatter(row) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      addUser(){
        this.initUser();
        this.dialogVisible = true;
      },
      saveUser() {
     
        var url  = this.baseUrl + '/api/user/add';
        this.isSaveButtonDisable = true;
        if( this.userId >0) {
          url = this.baseUrl + '/api/user/updatedetail?id='+ this.userId;
          this.$http.put(url,this.userModel)
          .then((result) => {
            if(result.status === 201)
            { 
              this.$message({
              message: 'Updated successfully!!',
              type: 'success',
              center: true
              });
              setTimeout(() => {
                this.fetchUsers();
              }, 2000);
            } else {
              this.$message({
              message: 'Failed!!',
              type: 'error',
              center: true
              });
            }
          })
        } else {
          this.$http.post(url,this.userModel)
          .then((result) => {
          if(result.status === 201)
          {  
            this.$message({
            message: 'Saved successfully!!',
            type: 'success',
            center: true
            });
            setTimeout(() => {
                this.fetchUsers();
              }, 2000);
          } else {
              this.$message({
              message: 'Failed!!',
              type: 'error',
              center: true
              });
            }
          })
        } 
        this.clear(); 
        this.isSaveButtonDisable = false;     
      },
      handleEdit(index, row) {
        this.userId = row.id;
        console.log(row.id);
        const url  = this.baseUrl + "/api/user/getdetail?id="+ this.userId +"";
        this.$http.get(url)
        .then((result) => {
          this.userModel = result.data;
          this.dialogVisible = true;
        })
      },
      clear() {
        this.initUser();
        this.dialogVisible = false;
      },
      nextClick(page) {       
        this.pageNo = page ;
        this.fetchUsers();
      },
      prevClick(page) {
        this.pageNo = page;
        this.fetchUsers();
      },
      currentPageChange(page) {
         this.pageNo = page;
        this.fetchUsers();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-header {
  font-weight: bold;
  font-size: large;
}
</style>