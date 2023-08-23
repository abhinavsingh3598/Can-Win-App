import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  profilePic: File | null = null; // Track the selected profile picture file
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  registrationSuccess: boolean = false;


  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      firstName: ['', Validators.required], // Added First Name field
      lastName: ['', Validators.required] ,
      email: ['', [Validators.required, Validators.email]]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
  }

  checkPasswords(group: FormGroup) {
    let password = group.controls['password']?.value;
    let confirmPassword = group.controls['confirmPassword']?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onPictureChange(event: any): void {
    this.profilePic = event.target.files[0] || null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const user: User = {
        firstName: formValue.firstName,
        lastName:formValue.lastName,
        username: formValue.username,
        password: formValue.password,
        role: 'user', // You need to handle roles somehow
        email: formValue.email,
        phoneNum: formValue.phoneNumber,
        // profilePic: formValue.profilePic
        profilePic: this.profilePic ? this.profilePic.name : undefined
      };
      this.userService.register(user).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          this.registrationSuccess = true; // Set registration success flag
          // handle successful response, e.g. navigate to the login page after a delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000); // Delay of 2 seconds (adjust as needed)
        },
        error: (error) => {
          console.log('Failed to register user', error);
          // handle error, e.g. display error message
          this.registrationSuccess = false; // Set registration success flag to false
        }
      });
      
    }
  }
}

// register.component.ts
