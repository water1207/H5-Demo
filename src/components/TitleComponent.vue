<template>
    <div>
      <h2 v-if="!isEditing" @click="isEditing = true">{{ title }}</h2>
      <div v-else>
        <input v-model="editTitle" @keyup.enter="saveEdit" />
        <button @click="saveEdit">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['title'],
    name: "TitleComponent",
    data() {
      return {
        isEditing: false,
        editTitle: this.title,
      };
    },
    methods: {
      saveEdit() {
        this.$emit('update:title', this.editTitle);
        this.isEditing = false;
      },
      cancelEdit() {
        this.editTitle = this.title;
        this.isEditing = false;
      },
    }
  };
  </script>
  