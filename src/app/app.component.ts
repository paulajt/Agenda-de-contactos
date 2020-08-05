import { Component, VERSION } from "@angular/core";

//Font-awesoma
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  //****Iconos****//
  faCheck = faCheck;
  faEyeSlash = faEyeSlash;
  faTrash = faTrash;
  faEye = faEye;
  faEdit = faEdit;
  faPlus = faPlus;
  faSearch = faSearch;
  faAddressBook = faAddressBook
  //****Iconos****//

  nameValid = new RegExp(/^[A-Za-záÁÉéÍíÓóÚú ]+$/i);
  emailValid = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  //phoneValid = new RegExp(/^([+0-9 ]{9,})*$/);

  contacts: any[] = JSON.parse(localStorage.getItem('contactos'));
  name: string;
  phone: number;
  email: string;
  oldPhone: number;
  oldEmail: string;
  oldName: string;
  errorInName: boolean = false;
  errorInPhone: boolean = false;
  errorInEmail: boolean = false;
  nameErrorMesagge: string = "";
  phoneErrorMesagge: string = "";
  emailErrorMesagge: string = "";
  contactSave: boolean = false;
  showContactsStored: boolean = false;
  contactFound: any[] = [];
  showContactFound: boolean = false;
  contactToSearch: string;
  editingContact: boolean = false;
  newContact: any = {};
  

  validateName() {
    if (this.name.length < 6) {
      this.errorInName = true;
      this.nameErrorMesagge = "Debe contener 6 letras como mínimo.";
    } else if (!this.nameValid.test(this.name)) {
      this.errorInName = true;
      this.nameErrorMesagge = "No puede tener números.";
    } else {
      this.errorInName = false;
      this.nameErrorMesagge = "";
    }
  }

  validateEmail() {
    if (!this.emailValid.test(this.email)) {
      this.errorInEmail = true;
      this.emailErrorMesagge = "Debe estar formado por usuario@servidor.";
    } else if (this.contacts.some(contact => contact.email == this.email)) {
      this.errorInEmail = true;
      this.emailErrorMesagge = "Esta dirección de correo ya existe";
    } else {
      this.errorInEmail = false;
      this.emailErrorMesagge = "";
    }
  }

  validatePhone() {
    //if (!this.phoneValid.test(this.phone)) {
    if (this.phone.toString().length < 9) {
      this.errorInPhone = true;
      this.phoneErrorMesagge = "Debe contener más de 8 números.";
    } else {
      this.errorInPhone = false;
      this.phoneErrorMesagge = "";
    }
  }

  nameOnFocus() {
    this.errorInName = false;
    this.nameErrorMesagge = "";
  }

  emailOnFocus() {
    this.errorInEmail = false;
    this.emailErrorMesagge = "";
  }

  phoneOnFocus() {
    this.errorInPhone = false;
    this.phoneErrorMesagge = "";
  }

  saveContact() {
    if(this.contacts == null) this.contacts = [];
    if (
        this.errorInName == false &&
        this.errorInEmail == false &&
        this.errorInPhone == false &&
        this.name.length > 0 &&
        this.phone != null &&
        this.email.length > 0
      ) {
        this.newContact = {
          name: this.name,
          phone: this.phone,
          email: this.email,
          wasContacted: false,
          hide: false,
          edit: false
        };
        this.contacts.push(this.newContact);
        localStorage.setItem('contactos', JSON.stringify(this.contacts));
        this.contactSave = true;
        this.name = "";
        this.phone = null;
        this.email = "";
        setTimeout(() => (this.contactSave = false), 2000);
      }
  }

  deleteAll() {
    this.contacts = [];
    this.showContactsStored = false;
    localStorage.setItem('contactos', JSON.stringify(this.contacts));
  }

  delete(contactPicked) {
    this.contacts.forEach(contact => {
      if (contact.email == contactPicked.email) {
        let index = this.contacts.indexOf(contact)
        this.contacts.splice(index,1);
      }
    });
    this.contactFound.forEach(contact => {
      if (contact.email == contactPicked.email) {
        let index = this.contactFound.indexOf(contact)
        this.contactFound.splice(index,1);
      }
    });
    localStorage.setItem('contactos', JSON.stringify(this.contacts));
  }

  contacted(contactPicked) {
    this.contacts.forEach(contact => {
      if (contact.email == contactPicked.email) {
        contact.wasContacted = !contact.wasContacted;
      }
    });
    localStorage.setItem('contactos', JSON.stringify(this.contacts));
  }

  contactedAll() {
    this.contacts.forEach(contact => {
      contact.wasContacted = true;
    });
    localStorage.setItem('contactos', JSON.stringify(this.contacts));
  }

  hide(contactPicked) {
    this.contacts.forEach(contact => {
      if (contact.email == contactPicked.email) {
        contact.hide = true;
      }
    });
    localStorage.setItem('contactos', JSON.stringify(this.contacts));
  }

  hideContacted() {
    this.contacts.forEach(contact => {
      if (contact.wasContacted == true) {
        contact.hide = true;
      }
    });
    localStorage.setItem('contactos', JSON.stringify(this.contacts));
  }

  showAll() {
    this.contacts.forEach(contact => {
      contact.hide = false;
    });
    localStorage.setItem('contactos', JSON.stringify(this.contacts));
  }

  searchContact(){
    this.contactFound = [];
    this.contacts.forEach(contact => {
      if(contact.name.includes(this.contactToSearch) || 
         contact.email.includes(this.contactToSearch)){
           this.contactFound.push(contact);
         }
    });
    this.showContactsStored = false;
    this.showContactFound = true;
  }

  back(){
    this.showContactsStored = true;
    this.showContactFound = false;
    this.contactFound = [];
  }

  showContacts(){
    this.showContactsStored = true;
  }

  storeNewContact(){
    this.showContactsStored = false;
  }

  edit(contactPicked){
    this.contacts.forEach(contact => {
      if (contact.email == contactPicked.email){
        this.oldName=contact.name;
        this.oldPhone=contact.phone;
        this.oldEmail=contact.email;
        this.name=contact.name;
        this.phone=contact.phone;
        this.email=contact.email;
        contact.edit = true;
        this.editingContact = true;
      }
    });
  }

  updateContact(contactPicked){
    if (
      this.errorInName == false &&
      this.errorInEmail == false &&
      this.errorInPhone == false
    ) {
      this.contacts.forEach(contact => {
        if (contact.email == contactPicked.email){
          if (this.name != this.oldName){
            contact.name = this.name;
          } else {
            contact.name = this.oldName;
          }
          if (this.phone != this.oldPhone){
            contact.phone = this.phone;
          } else {
            contact.phone = this.oldPhone;
          }
          if (this.email != this.oldEmail){
            contact.email = this.email;
          } else {
            contact.email = this.oldEmail;
          }
          contact.edit = false;
        }      
      });
    }
      localStorage.setItem('contactos', JSON.stringify(this.contacts));
      this.editingContact=false;
      this.oldName = "";
      this.oldPhone = null;
      this.oldEmail = "";
      this.name = "";
      this.phone = null;
      this.email = "";
  }

}