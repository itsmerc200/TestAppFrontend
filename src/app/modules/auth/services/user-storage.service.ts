import { Injectable } from '@angular/core';

// Define a constant key to store user data in localStorage
const USER = 'q_user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  // Method to save user data in localStorage
  static saveUser(user: any) {
    // First, remove any existing user data
    window.localStorage.removeItem(USER);
    // Then, store the new user data as a JSON string
    window.localStorage.setItem(USER, JSON.stringify(user));
  }


  // Method to retrieve user data from localStorage
  static getUser(): any {
    // Get the stored user data and parse it from JSON to an object
    return JSON.parse(localStorage.getItem(USER));
  }


  // Method to get the user ID
  static grtUserId(): string {  // (There's a typo, should be "getUserId")
    const user = this.getUser(); // Get the user object

    // If no user is found, return an empty string
    if (user == null) { return ''; }

    // Otherwise, return the user ID
    return user.id;
  }


  // Method to get the user role
  static grtUserRole(): string {  // (There's a typo, should be "getUserRole")
    const user = this.getUser(); // Get the user object

    // If no user is found, return an empty string
    if (user == null) { return ''; }

    // Otherwise, return the user role
    return user.role;
  }


  // Method to check if an admin user is logged in
  static isAdminLoggedIn(): boolean {
    const role: string = this.grtUserRole(); // Get the user role
    return role == 'ADMIN'; // Return true if the role is 'ADMIN', otherwise false
  }


  // Method to check if a normal user (not admin) is logged in
  static isUserLoggedIn(): boolean {  // (There's a typo, should be "isUserLoggedIn")
    const role: string = this.grtUserRole(); // Get the user role
    return role == 'USER'; // Return true if the role is 'USER', otherwise false
  }
  

  // Method to sign out the user (remove user data)
  static signOut(): void {
    // Remove user data from localStorage
    window.localStorage.removeItem(USER);

  }
}
