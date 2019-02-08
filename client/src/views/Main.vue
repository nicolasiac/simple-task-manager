<template>
  <div>
    <h1>Project Status</h1>
    <div class="progress" style="height:30px">
      <div
        id="totalStatus"
        class="progress-bar"
        role="progressbar"
        style="width: 0%"
        aria-valuenow="0"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Object</th>
          <th>
            <div class="progress" style="height:30px">
              <div
                id="totalStatusDesign"
                class="progress-bar bg-success"
                role="progressbar"
                style="width: 0%"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>Design
          </th>
          <th>
            <div class="progress" style="height:30px">
              <div
                id="totalStatusDB"
                class="progress-bar bg-success"
                role="progressbar"
                style="width: 0%"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>Database
          </th>
          <th>
            <div class="progress" style="height:30px">
              <div
                id="totalStatusAPI"
                class="progress-bar bg-success"
                role="progressbar"
                style="width: 0%"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>API
          </th>
          <th>
            <div class="progress" style="height:30px">
              <div
                id="totalStatusUI"
                class="progress-bar bg-success"
                role="progressbar"
                style="width: 0%"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>Front End
          </th>
          <th>
            <div class="progress" style="height:30px">
              <div
                id="totalStatusTest"
                class="progress-bar bg-success"
                role="progressbar"
                style="width: 0%"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>Test
          </th>
        </tr>
      </thead>
      <tbody v-for="item in items">
        <tr class="grouplabel">
          <th colspan="6">{{ item.categoryname }} <button v-on:click="addNewTask(item)">Add+</button></th>
        </tr>
        <tr v-for="task in item.Tasks">{{task.taskname}}</tr>
      </tbody>
    </table>
  </div>
</template>
 <style>  
        .grouplabel {
            background-color: #007bff;
            color: #fff;
            text-align: center;
        }
    </style>
<script>
import axios from "axios";

export default {
  name: "Register",
  components: {},
  data() {
    return {
      items: []
    };
  },
  methods: {
    addNewTask: function(category){
      
    }
  },
  mounted() {
    axios
      .get(`http://localhost:3128/data`, {
        headers: { "x-access-token": localStorage.getItem("token") }
      })
      .then(res => {
        if (res.data.status == true) {
          this.items = res.data.items;
        } else {
          //this.status = res.data.message;
        }
      });
  }
};
</script>