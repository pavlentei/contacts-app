<template>
  <v-card class="mx-auto" width="450px" height="550px">
    <v-toolbar color="cyan-lighten-1">
      <v-toolbar-title>Создать</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" variant="text" @click="changeWindow"></v-btn>
    </v-toolbar>

    <form @submit.prevent="submit" class="d-flex flex-column px-10 pt-10">
      <v-text-field class="mb-2" v-model="name.value.value" :counter="10" :error-messages="name.errorMessage.value"
        label="Имя"></v-text-field>

      <v-text-field class="mb-2" v-model="phone.value.value" :counter="9" :error-messages="phone.errorMessage.value"
        label="Номер телефона"></v-text-field>

      <v-text-field class="mb-2" v-model="email.value.value" :error-messages="email.errorMessage.value"
        label="E-mail"></v-text-field>

      <v-select class="mb-2" v-model="select.value.value" :error-messages="select.errorMessage.value" :items="items"
        label="Выбрать тип"></v-select>
      <div class="d-flex">
        <v-btn class="me-4" type="submit">
          Сохранить
        </v-btn>

        <v-btn @click="handleReset">
          Очистить
        </v-btn>
      </div>
    </form>
  </v-card>
</template>

<script lang="ts" setup>
import { useUserStore } from '../store/userStore'
import { ref, Ref } from 'vue'
import { useField, useForm, FieldValues } from 'vee-validate'

interface FormData {
  name: ReturnType<typeof useField>;
  phone: ReturnType<typeof useField>;
  email: ReturnType<typeof useField>;
  select: ReturnType<typeof useField>;
}
const isObjectEmpty = (obj: any): boolean => {
  return Object.keys(obj).length === 0;
}
const store = useUserStore()

const changeWindow = () => {
  store.editContact({})
  store.changeWindow('list')
}


const { handleSubmit, handleReset } = useForm<FormData>({
  validationSchema: {
    name(value: string | undefined) {
      if (value && value.length >= 2) return true

      return 'Имя должно состоять как минимум из 2 символов.'
    },
    phone(value: string | undefined) {
      if (value && value.length > 9 && /^[0-9-]+$/.test(value)) return true

      return 'Номер телефона должен состоять как минимум из 9 цифр.'
    },
    email(value: string | undefined) {
      if (value && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)) return true 

      return 'Должен быть действительный адрес электронной почты.'
    },
  },
})

const name = useField('name')
const phone = useField('phone')
const email = useField('email')
const select = useField('select')

const items: Ref<string[]> = ref([
  'Не выбрано',
  'Семья',
  'Друзья',
  'Работа',
  'Читательный клуб',
])

if (!isObjectEmpty(store.isEdited)) {
  name.setValue(store.isEdited.name);
  phone.setValue(store.isEdited.phone);
  email.setValue(store.isEdited.email);
  select.setValue(store.isEdited.select);
}


const submit = handleSubmit((values: FieldValues<FormData>) => {
  if (values.select === 'Не выбрано') {
    return 'Пожалуйста, выберите тип.'
  }

  const contact = {
    name: values.name,
    phone: values.phone,
    email: values.email,
    select: values.select
  }
  if (!isObjectEmpty(store.isEdited)) {
    const updatedContact = {
      id: store.isEdited.id,
      ...contact
    };
    store.updateContact(updatedContact);

  } else {
    store.addContact(contact)
  }
  store.editContact({})
  store.changeWindow('list')
})
</script>