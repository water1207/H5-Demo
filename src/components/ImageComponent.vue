<template>
    <div v-if="!isEditing" @click="isEditing = true">
      <img :src="src" :alt="alt" style="max-width: 100%;">
    </div>
    <div v-else>
      <label>Image URL:</label>
      <input v-model="editSrc" />
      <label>Alt Text:</label>
      <input v-model="editAlt" />
      <button @click="saveEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['src', 'alt'],
    name: "ImageComponent",
    data() {
      return {
        isEditing: false,
        editSrc: this.src,
        editAlt: this.alt,
      };
    },
    methods: {
      saveEdit() {
        this.$emit('update:src', this.editSrc);
        this.$emit('update:alt', this.editAlt);
        this.isEditing = false;
      },
      cancelEdit() {
        this.editSrc = this.src;
        this.editAlt = this.alt;
        this.isEditing = false;
      },
    }
  };
  </script>
  