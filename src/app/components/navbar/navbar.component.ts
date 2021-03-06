import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FirebaseService, User } from './../../services/firebase.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],    
})
export class NavbarComponent implements OnInit {
  public query: any;
  // nav
  public user: any;
  public imageUrl: any;
  // login
  public loginEmail: string;
  public loginPassword: string;
  public users: any;
  public confirm: boolean;
  public login_exist: boolean;
  public login_user: any; 
  // signup
  public name: string;
  public phone: string;
  public email: string;
  public password: string;
  public confirmation: string;
  public exist: boolean;
  // upload
  public title: string;
  public description: string;
  public image: string;
  // change
  public change_password: string;
  public change_confirmation: string;

  constructor(    
    private flashMessage: FlashMessagesService,
    private firebaseService: FirebaseService,
    private router: Router) {
      this.firebaseService.getUser().subscribe(users => {
      this.users = users;
    })
  }

  ngOnInit() {
    this.query = '';
    // login
    this.loginEmail = '';
    this.loginPassword = ''; 
    // singup
    this.name = '';
    this.phone = '';
    this.email = '';
    this.password = '';
    this.confirmation = ''; 
    // upload
    this.title = '';
    this.description = '';
    this.image = '';  
    // change 
    this.change_confirmation = '';
    this.change_password = '';
    // nav
    this.firebaseService.state.subscribe(state => {
      if(state) {
        this.user = state;
      } else {
        this.user = null;
      }
    })

    this.firebaseService.photo.subscribe(photo => {
      if(photo) {
        this.imageUrl = photo;
      } else {
        this.imageUrl = null;
      }
    })

    if(localStorage.getItem("user") != null) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    if(localStorage.getItem("image")!= null) {
      this.imageUrl = localStorage.getItem("image");
    }

  } 
 
  logout() {
    this.firebaseService.logout();  
    this.flashMessage.show('Success!',
    {cssClass: 'flash-success'});
  }

  login(modal: any){   

    this.login_exist = false;
    this.confirm = false;
    this.users.forEach(user => {     
      if(user.email == modal.loginEmail) {
        this.login_exist = true;      
        if(user.password == modal.loginPassword) {
          this.confirm = true;
          this.login_user = user;
        }
      }
    })

    if(!this.login_exist) {
      this.flashMessage.show('This E-mail does not exist',
      {cssClass: 'flash-message'});
      return;
    }

    if(!this.confirm) {
      this.flashMessage.show('E-mail and Password do not match', 
      {cssClass: 'flash-message'});
      return;
    }

    this.flashMessage.show('Success! You are loggined',
    {cssClass: 'flash-success'});

    this.firebaseService.login(this.login_user);
    //this.refresh();
    this.router.navigate(['home']);     
  }  

  signup(modal: any) {      

    this.exist = false;
    this.users.forEach(user => {
      if(user.email == modal.email) {
        this.exist = true;      
      }
    })

    if(this.exist) {
      this.flashMessage.show('This E-mail is exist', 
      {cssClass: 'flash-message'});
      return;
    }

    if(modal.password != modal.confirmation) {
      this.flashMessage.show('Password should be same', 
      {cssClass: 'flash-message'});
      this.password = '';
      this.confirmation = '';
      return;
    }

    let user = {
      name: modal.name,
      phone: modal.phone,
      email: modal.email,
      password: modal.password,
    }
    this.flashMessage.show('Success! You can login now',
    {cssClass: 'flash-success'});

    this.firebaseService.createUser(user);
    //this.refresh();
    this.router.navigate(['home']);    
  }

  delete() {
    this.firebaseService.deleteUser(this.user.id);
    this.firebaseService.logout();
    this.flashMessage.show('Success!',
    {cssClass: 'flash-success'});
  }

  update(modal: any) {
    if(modal.change_password != modal.change_confirmation) {
      this.flashMessage.show('Password should be same', 
      {cssClass: 'flash-message'});
      this.change_password = '';
      this.change_confirmation = '';
      return;
    }

    let data = {
      password: modal.change_password
    }
    this.firebaseService.updatePassword(this.user.id, data);
    this.firebaseService.logout();
    this.flashMessage.show('Success!',
    {cssClass: 'flash-success'});
  }

  upload(modal: any) {
    let img = (<HTMLInputElement>document.getElementById('image')).files[0];
    if(!img) {
      this.flashMessage.show('You have to provide Image', 
      {cssClass: 'flash-message'});
      return;
    }

    let imageInfo = {
      provider: this.user.name,
      title: modal.title,
      description: modal.description,
      img: img,
      time: new Date().toLocaleString()
    }
    this.flashMessage.show('Success! You upload a image',
    {cssClass: 'flash-success'});

    this.firebaseService.upload(imageInfo);
    this.refresh();
    this.router.navigate(['home']);    
  }

  refresh() {
    // login
    this.loginEmail = '';
    this.loginPassword = ''; 
    // singup
    this.name = '';
    this.phone = '';
    this.email = '';
    this.password = '';
    this.confirmation = ''; 
    // upload
    this.title = '';
    this.description = '';
    this.image = '';  
    // change
    this.change_confirmation = '';
    this.change_password = ''
  }

  search() {
    if(this.query) {
      this.router.navigate(['search'],{ queryParams: { q: this.query }});
      this.query = '';
    } else {
      this.router.navigate(['home']);
    }    
  }
}

