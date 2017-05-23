import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
 
@Injectable()
export class AuthenticationService {
  public user: any;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  logout() {
    localStorage.removeItem("user");
    //this.router.navigate(['home']);
  }

  login(user){
    localStorage.setItem("user", user);
    //this.router.navigate(['home']);
    
  }
 
  checkCredentials(){
    if (localStorage.getItem("user") === null){
        this.router.navigate(['login']);
    }
  } 

  check(){
    if (localStorage.getItem("user") === null){
      return false;
    }
    return true;
  } 

}


