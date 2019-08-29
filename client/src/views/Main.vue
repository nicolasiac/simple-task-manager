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
      <tbody v-for="item in items" :key="item.categoryid">
        <tr class="grouplabel">
          <th colspan="6">
            {{ item.categoryname }}
            <button v-on:click="addNewTask(item)">Add+</button>
            <Task
              v-bind:category_id="item.categoryid"
              @taskSaved="taskSaved"
              :class="{hidden:item.categoryid !== selected}"
            ></Task>
          </th>
        </tr>
        <tr v-for="task in item.Tasks" :key="task.taskid">{{task.taskname}}</tr>
      </tbody>
    </table>
  </div>
</template>
 <style>
.hidden {
  display: none;
}
.grouplabel {
  background-color: #007bff;
  color: #fff;
  text-align: center;
}
</style>
<script>
import Task from "@/components/Task.vue";
import axios from "axios";

export default {
  name: "Register",
  components: { Task },
  data() {
    return {
      selected: undefined,
      items: []
    };
  },
  methods: {
    addNewTask: function(category) {
      this.selected = category.categoryid;
    },
    taskSaved: function() {
      this.selected = "";
      this.loadData();
    },
    loadData: function() {
      axios
        .get(`http://localhost:3128/data`, {
          headers: { "x-access-token": localStorage.getItem("token") }
        })
        .then(res => {
          if (res.data.status == true) {
            this.items = res.data.items;
          } else {
            console.log(res.data.message);
          }
        });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>