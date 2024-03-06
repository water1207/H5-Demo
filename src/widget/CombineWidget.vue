<template>
  <div>
    <h2> {{ title }} </h2>
    <p> {{ content }} </p>
    <img :src="src" :alt="alt" style="max-width: 100%;">
    <el-button @click="openDialog">编辑</el-button>

    <el-dialog
      title="编辑内容"
      v-model="dialogVisible"
      @close="reset">
      <el-form>
        <el-form-item label="标题">
          <el-input v-model="editableTitle"></el-input>
          <el-switch v-model="switchStates[0]" active-text="添加备注"></el-switch>
          <el-input v-if="switchStates[0]" v-model="notes[0]" placeholder="请输入标题备注"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="editableContent"></el-input>
          <el-switch v-model="switchStates[1]" active-text="添加备注"></el-switch>
          <el-input v-if="switchStates[1]" v-model="notes[1]" placeholder="请输入内容备注"></el-input>
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="editableSrc"></el-input>
          <el-switch v-model="switchStates[2]" active-text="添加备注"></el-switch>
          <el-input v-if="switchStates[2]" v-model="notes[2]" placeholder="请输入图片URL备注"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    content: String,
    src: String,
    alt: String,
  },
  data() {
    return {
      dialogVisible: false,
      editableTitle: '',
      editableContent: '',
      editableSrc: '',
      switchStates: [false, false, false], // 初始状态为所有开关关闭
      notes: ['', '', ''], // 初始备注为空
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.editableTitle = this.title;
      this.editableContent = this.content;
      this.editableSrc = this.src;
    },
    reset() {
      // 重置开关状态和备注为初始值
      this.switchStates = [false, false, false];
      this.notes = ['', '', ''];
    },
    save() {
      this.$emit('update:content', {
        content: {
          title: this.editableTitle,
          content: this.editableContent,
          src: this.editableSrc,
        },
        switchStates: this.switchStates, // 将开关状态数组传递给父组件
        notes: this.notes, // 将备注数组传递给父组件
      });
      this.dialogVisible = false;
      this.reset();
    }
  },
};
</script>
