<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">
      Producto: <small class="text-blue-500">{{ title }}</small>
    </h1>
    <hr class="my-4" />
  </div>

  <form @submit="onSubmit" class="grid grid-cols-1 sm:grid-cols-2 bg-white px-5 gap-5">
    <div class="first-col">
      <div class="mb-4">
        <label for="title" class="form-label">Title</label>
        <custom-input v-model="title" v-bind="titleAttrs" :error="errors.title" />
      </div>

      <div class="mb-4">
        <label for="slug" class="form-label">Slug</label>
        <custom-input v-model="slug" v-bind="slugAttrs" :error="errors.slug" />
      </div>

      <div class="mb-4">
        <label for="description" class="form-label">Description</label>
        <custom-textarea
          v-model="description"
          v-bind="descriptionAttrs"
          :error="errors.description"
        />
      </div>

      <div class="flex flex-row gap-3">
        <div class="mb-4 flex-1">
          <label for="price" class="form-label">Price</label>
          <custom-input v-model.number="price" v-bind="priceAttrs" :error="errors.price" />
        </div>

        <div class="mb-4 flex-1">
          <label for="stock" class="form-label">Stock</label>
          <custom-input v-model.number="stock" v-bind="stockAttrs" :error="errors.stock" />
        </div>
      </div>

      <div class="mb-4">
        <label for="sizes" class="form-label">Sizes</label>
        <div class="flex">
          <button
            v-for="size in allSizes"
            :key="size"
            @click="toggleSize(size)"
            type="button"
            :class="[
              'p-2 rounded w-14 mr-2 flex-1',
              {
                'bg-blue-500 text-white': hasSize(size),
                'bg-blue-100': !hasSize(size),
              },
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <div class="first-col">
      <label for="stock" class="form-label">Images</label>
      <div class="flex p-2 overflow-x-auto space-x-8 w-full h-[265px] bg-gray-200 rounded">
        <div v-for="image in images" :key="image.value" class="flex-shrink-0">
          <img :src="image.value" :alt="title" class="w-[250px] h-[250px] rounded" />
        </div>

        <div v-for="imageFile in imageFiles" :key="imageFile.name" class="flex-shrink-0">
          <img :src="temporalImageUrl(imageFile)" class="w-[250px] h-[250px] rounded" />
        </div>
      </div>
      <!-- Upload image -->
      <div class="col-span-2 my-2">
        <label for="image" class="form-label">Upload image</label>

        <input
          multiple
          type="file"
          id="image"
          class="form-control"
          accept="image/*"
          @change="onFileChanged"
        />
      </div>

      <div class="mb-4">
        <label for="stock" class="form-label">Gender</label>
        <select
          v-model="gender"
          v-bind="genderAttrs"
          class="form-control w-full p-2 border border-gray-200 rounded shadow-sm"
        >
          <option value="">Select one</option>
          <option value="kid">Kid</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
        </select>
        <span class="text-red-400" v-if="errors.gender">{{ errors.gender }}</span>
      </div>

      <div class="my-4 text-right">
        <button
          :disabled="isPending"
          type="submit"
          class="disabled:bg-gray-300 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </form>
  <!-- <div class="grid grid-cols-2 mt-2">
    <pre class="bg-blue-200 p-2">
      {{ JSON.stringify(values, null, 2) }}
    </pre>
    <div class="bg-red-200 p-2">
      {{ JSON.stringify(errors, null, 2) }}
    </div>
    <div class="bg-green-200 p-2 col-span-2">
      {{ JSON.stringify(meta, null, 2) }}
    </div>
  </div> -->
</template>

<script src="./ProductView.ts" lang="ts"></script>

<style scoped>
.form-label {
  @apply block text-gray-700 text-sm font-bold mb-2;
}
</style>
