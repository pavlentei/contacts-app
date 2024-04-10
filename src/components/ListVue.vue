<template>
  <v-card class="mx-auto" width="450px" height="700px">
    <v-toolbar color="cyan-lighten-1">
      <v-btn icon="mdi-menu" variant="text" @click="toggleGroup"></v-btn>
      <v-toolbar-title>Контакты</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-sort" variant="text" @click="sortByName"></v-btn>
      <v-btn icon="mdi-account-plus" variant="text" @click="changeWindow"></v-btn>
      <v-btn icon="mdi-magnify" variant="text" @click="toggleSearch"></v-btn>
    </v-toolbar>
    <v-toolbar color="cyan-lighten-1" class="pa-2" v-if="isSearch">
      <v-text-field v-model="search" variant="solo" label="Поиск"></v-text-field>
    </v-toolbar>
    <v-toolbar color="cyan-lighten-1" class="pa-2" v-if="isGroup">
      <v-select v-model="selectedGroup" :items="groupOptions" variant="solo" label="Сгруппировать"></v-select>
    </v-toolbar>
    <v-expansion-panels v-if="store.contacts.length">
      <template v-if="!isGroup">
        <v-expansion-panel v-for="(contact, index) in filteredContacts" :key="index">
          <v-expansion-panel-title>{{ index + 1}}) <strong>{{ contact.name }}</strong><v-spacer></v-spacer>
            <v-icon @click="editContact(contact)">mdi-pencil</v-icon>
            <v-icon @click="deleteContact(index)">mdi-delete</v-icon>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div>Номер: {{ contact.phone }}</div>
            <div>Почта: {{ contact.email }}</div>
            <div v-if="contact.select">Тип: {{ contact.select }}</div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </template>

      <template v-else>
        <v-expansion-panel v-for="(contact, index) in filteredContacts" :key="index">
          <v-expansion-panel-title>{{ index + 1}}) <strong>{{ contact.name }}</strong><v-spacer></v-spacer>
            <v-icon @click="editContact(contact)">mdi-pencil</v-icon>
            <v-icon @click="deleteContact(index)">mdi-delete</v-icon>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div>Номер: {{ contact.phone }}</div>
            <div>Почта: {{ contact.email }}</div>
            <div v-if="contact.select">Тип: {{ contact.select }}</div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </template>
     
    </v-expansion-panels>
    <v-alert text="Список контактов пуст" v-else closable variant="tonal"></v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/userStore';
import { ref, computed } from 'vue';

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  select: string;
}

const store = useUserStore();
const search = ref('');
const isSearch = ref(false);
const isGroup = ref(false);
const sortDirection = ref('asc');
const selectedGroup = ref('Нет данных');

const changeWindow = () => {
  store.changeWindow('edit');
};

const deleteContact = (index: number) => {
  store.removeContact(index);
};

const editContact = (contact: Contact) => {
  store.changeWindow('edit');
  store.editContact(contact);
};

const toggleSearch = () => {
  isSearch.value = !isSearch.value;
};

const toggleGroup = () => {
  isGroup.value = !isGroup.value;
};

const filteredContacts = computed(() => {
  let contactsToFilter = store.contacts;
  if (isGroup.value && selectedGroup.value !== 'Нет данных') {
    contactsToFilter = groupedContacts.value[selectedGroup.value] || [];
  }
  return contactsToFilter.filter(contact => {
    return contact.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

const sortByName = () => {
  if (sortDirection.value === 'asc') {
    store.contacts.sort((a, b) => a.name.localeCompare(b.name));
    sortDirection.value = 'desc';
  } else {
    store.contacts.sort((a, b) => b.name.localeCompare(a.name));
    sortDirection.value = 'asc';
  }
};

const groupedContacts = computed(() => {
  const grouped: Record<string, Contact[]> = {};
  store.contacts.forEach(contact => {
    const groupName = contact.select || 'Нет данных'; // Группируем контакты без данных в отдельную группу
    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(contact);
  });
  return grouped;
});

const groupOptions = computed(() => {
  const options = ['Нет данных']; // Вариант для контактов без данных
  store.contacts.forEach(contact => {
    if (contact.select && !options.includes(contact.select)) {
      options.push(contact.select);
    }
  });
  return options;
});
</script>
