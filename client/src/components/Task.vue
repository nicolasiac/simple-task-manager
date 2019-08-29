<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for>Task Name:</label>
      <input type="text" required class="form-control" v-model="model.taskname">
    </div>

    <div class="form-group">
      <label for>Description:</label>
      <input type="text" required class="form-control" v-model="model.description">
    </div>

    <div class="form-group">
      <button class="btn btn-success btn-large">Save</button>
    </div>
  </form>
</template>

<script>
import axios from "axios";

export default {
  name: "Task",
  props: ["category_id"],
  data() {
    return {
      model: {
        taskname: "",
        description: ""
      }
    };
  },
  methods: {
    save() {
      axios
        .post(
          "http://localhost:3128/task",
          {
            category_id: this.category_id,
            taskname: this.model.taskname,
            description: this.model.description
          },
          { headers: { "x-access-token": localStorage.getItem("token") } }
        )
        .then(res => {
          // Post a status message
          console.log(res);
          if (res.data.status == true) {
           this.$emit("taskSaved");
          } else {
            this.status = res.data.message;
          }
        });
    }
  }
};
</script>