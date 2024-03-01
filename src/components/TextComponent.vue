<template>
    <div>
      <p v-if="!isEditing" @click="isEditing = true">{{ text }}</p>
      <div v-else>
        <textarea v-model="editText" @keyup.enter="saveEdit" />
        <button @click="saveEdit">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['text'],
    name: "TextComponent",
    data() {
      return {
        isEditing: false,
        editText: this.text,
      };
    },
    methods: {
      saveEdit() {
        this.$emit('update:text', this.editText);
        this.isEditing = false;
      },
      cancelEdit() {
        this.editText = this.text;
        this.isEditing = false;
      },
    }
  };
  </script>
  