import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../chat/models/user';
import { AuthService } from '../../services/auth.service';
import { ChatStateService } from '../../../chat/services/chat-state.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NgIf, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {

  //=========[ INDEPENDENCY INJECTION ]=================

    private readonly formBuilder = inject(FormBuilder)
    private readonly authService = inject(AuthService)
    private readonly destroy$ = new Subject<void>()
    private readonly router = inject(Router)
    private readonly stateService = inject(ChatStateService)

    errorMessage: any
    isLoading = false
    private readonly snackBar = inject(MatSnackBar)
  
    signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.maxLength(6)]],
      email: ['', [ Validators.required, Validators.email]]
    })
  
    onSignUp(): void {
     console.info('Init onSignUp')

     this.isLoading = true
      
      let username = this.signupForm.value.username
      let password = this.signupForm.value.password
      let email = this.signupForm.value.email
  
      if (username && password && email) {
        this.authService.signUp(username, password, email).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: ((user: User) => {
            
            this.isLoading = false
                                           
            this.snackBar.open('Inscription réussie ! Bienvenue, ' + user.username, 'OK', {
              duration: 5000, 
              horizontalPosition: 'center',
              verticalPosition: 'top'
            })
            window.location.reload()
            this.router.navigate(['/connect'])
                  
            console.info('Fin onSignUp')
          }),
          error: (err) => {
            this.isLoading = false
            this.snackBar.open('Erreur lors de l’inscription : ' + err.error, 'Fermer', {
              duration: 8000,
              panelClass: ['error-snackbar'] // Style personnalisé pour les erreurs
            })
            console.error('Erreur lors de la connexion', err)
            this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect!'
          }
        })
      } else {
        console.error('Formulaire non valid')
      }
    }
  
    ngOnDestroy(): void {
      this.destroy$.next()
      this.destroy$.complete()
    }
  
  
    // ============[ Material fields ]===================
    hide = signal(true)
    clickEvent(event: MouseEvent) {
      this.hide.set(!this.hide());
      event.stopPropagation();
    }
  }
