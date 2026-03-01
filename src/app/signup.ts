import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from './supabase.service';
import { TranslationService } from './translation.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="p-6 min-h-screen bg-[#120F1A] text-white flex flex-col justify-center">
      <div class="absolute top-6 right-6">
        <button (click)="i18n.toggle()" class="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
          <mat-icon class="text-[18px] w-[18px] h-[18px]">language</mat-icon>
          {{ i18n.lang() === 'en' ? 'PT' : 'EN' }}
        </button>
      </div>

      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-6 mx-auto shadow-lg shadow-purple-900/50">
        <mat-icon class="text-white text-3xl w-8 h-8">person_add</mat-icon>
      </div>
      
      <h1 class="text-2xl font-bold text-center mb-2">{{ i18n.t().createAccount }}</h1>
      <p class="text-gray-400 text-center mb-8">CreatorAI</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().name }}</label>
          <input id="name" type="text" formControlName="name" 
                 class="w-full bg-[#1A1625] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().email }}</label>
          <input id="email" type="email" formControlName="email" 
                 class="w-full bg-[#1A1625] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().phone }}</label>
          <div class="flex gap-2">
            <select id="countryCode" formControlName="countryCode" class="w-1/3 bg-[#1A1625] border border-white/10 rounded-xl px-2 py-3.5 text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
              <option value="+55">🇧🇷 +55</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+351">🇵🇹 +351</option>
              <option value="+44">🇬🇧 +44</option>
            </select>
            <input id="phone" type="tel" formControlName="phone" 
                   class="w-2/3 bg-[#1A1625] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().password }}</label>
          <input id="password" type="password" formControlName="password" 
                 class="w-full bg-[#1A1625] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().confirmPassword }}</label>
          <input id="confirmPassword" type="password" formControlName="confirmPassword" 
                 class="w-full bg-[#1A1625] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
          @if (form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched) {
            <p class="text-red-400 text-xs mt-1">Passwords do not match</p>
          }
        </div>

        @if (error()) {
          <div class="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20">
            {{ error() }}
          </div>
        }

        <button type="submit" [disabled]="form.invalid || isLoading()" 
                class="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed mt-8">
          @if (isLoading()) {
            <mat-icon class="animate-spin">sync</mat-icon>
          } @else {
            {{ i18n.t().signup }}
          }
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-gray-400 text-sm">
          {{ i18n.t().haveAccount }} 
          <a routerLink="/login" class="text-purple-400 hover:text-purple-300 font-medium ml-1">{{ i18n.t().login }}</a>
        </p>
      </div>

      <!-- Email Confirmation Modal -->
      @if (showConfirmation()) {
        <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div class="bg-[#1A1625] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <div class="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-emerald-400 text-3xl w-8 h-8">mark_email_read</mat-icon>
            </div>
            <h3 class="text-xl font-bold mb-2">{{ i18n.t().emailConfirmationTitle }}</h3>
            <p class="text-gray-400 mb-6">{{ i18n.t().emailConfirmationMessage }}</p>
            <button (click)="router.navigate(['/login'])" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
              {{ i18n.t().ok }}
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  router = inject(Router);
  i18n = inject(TranslationService);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    countryCode: ['+55', Validators.required],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  isLoading = signal(false);
  error = signal<string | null>(null);
  showConfirmation = signal(false);

  async onSubmit() {
    if (this.form.invalid) return;
    
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const { email, password, name, countryCode, phone } = this.form.value;
      const { error } = await this.supabase.signUp(email!, password!, {
        full_name: name,
        phone: `${countryCode}${phone}`
      });
      
      if (error) throw error;
      
      this.showConfirmation.set(true);
    } catch (err: unknown) {
      this.error.set((err as Error).message || 'An error occurred during sign up');
    } finally {
      this.isLoading.set(false);
    }
  }
}
