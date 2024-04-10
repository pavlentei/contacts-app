import { defineStore } from "pinia";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  select: string;
}

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    contacts: [] as Contact[],
    lastId: 0,
    isOpen: 'list',
    isEdited: {} as Contact,
  }),
  actions: {
    addContact(contact: Contact) {
      const newContact: Contact = { ...contact, id: ++this.lastId };
      this.contacts.push(newContact);
    },
    removeContact(contactIndex: number) {
      this.contacts.splice(contactIndex, 1);
    },
    changeWindow(windowName: string) {
      this.isOpen = windowName;
    },
    editContact(contact: Contact) {
      this.isEdited = contact;
    },
    updateContact(updatedContact: Contact) {
      const index = this.contacts.findIndex(contact => contact.id === updatedContact.id);
      if (index !== -1) {
        this.contacts.splice(index, 1, updatedContact);
      }
    }
  }
});