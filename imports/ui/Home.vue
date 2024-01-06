<template>
  <div class="my-2">
    <input ref="fileInput" type="file" @change="handleFileChange" multiple />
  </div>
  <button type="button" @click="upload" class="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
    :class="{ 'bg-green-50': isUploaded }" :disabled="isUploaded">{{ isUploaded
      ? 'Uploading ...' : 'Upload' }}</button>
  <div class="mt-2">
    <ul v-if="images">
      <template v-for="image in images" :key="image.asset_id">
        <li class="my-1">
          <CloudinaryImage :public-id="image.public_id" :name="image.public_id" :quality="100" />
        </li>
        <button type="button" @click="remove(image.public_id)"
          class="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">Delete</button>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Meteor } from 'meteor/meteor';
import { onMounted, ref } from 'vue'
import ConvertFile from '../utils/convert-file'
import CloudinaryImage from './components/CloudinaryImage.vue';

const isUploaded = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const files = ref()

const images = ref()

onMounted(() => {
  Meteor.callAsync('cloudinary.find').then(result => {
    images.value = result.data.resources;
  }).catch(error => {
    console.log("error", error)
  })
})

function handleFileChange() {
  files.value = fileInput.value?.files
}

async function upload() {
  // copy files array
  const tempFiles = files.value;
  // validation required
  if (tempFiles == undefined) return alert('Hey, look like you forgot choose file to upload.')
  isUploaded.value = true
  //convert file to base64
  const base64Files: object[] = [];
  for (let index = 0; index < tempFiles.length; index++) {
    const tf = tempFiles[index];
    const base64 = await ConvertFile.toBase64(tf)
    base64Files.push({ base64: base64, name: tf.name })
  }
  // upload
  Meteor.callAsync('cloudinary.upload', { base64Files: base64Files }).then(result => {
    isUploaded.value = false;
    images.value = [...result.data];
    alert(result.message)
  }).catch(error => {
    isUploaded.value = false;
    alert(error.message)
  })
}
const remove = (publicId: string) => {
  Meteor.callAsync('cloudinary.remove', { publicId }).then((result) => {
    if (images.value) {
      images.value = images.value.filter((i: any) => i.public_id !== publicId)
    }
    alert(result.message)
  }).catch(error => {
    alert(error.message)
  })
}

</script>

<style scoped></style>