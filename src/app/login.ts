import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from './supabase.service';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-login',
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

      <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-8 mx-auto shadow-lg shadow-purple-900/50">
        <mat-icon class="text-white text-4xl w-10 h-10">auto_awesome</mat-icon>
      </div>
      
      <h1 class="text-3xl font-bold text-center mb-2">CreatorAI</h1>
      <p class="text-gray-400 text-center mb-10">{{ i18n.t().welcomeBack }}</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().email }}</label>
          <input id="email" type="email" formControlName="email" 
                 class="w-full bg-[#1A1625] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().password }}</label>
          <input id="password" type="password" formControlName="password" 
                 class="w-full bg-[#1A1625] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
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
            {{ i18n.t().login }}
          }
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-gray-400 text-sm">
          {{ i18n.t().noAccount }} 
          <a routerLink="/signup" class="text-purple-400 hover:text-purple-300 font-medium ml-1">{{ i18n.t().signup }}</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  i18n = inject(TranslationService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = signal(false);
  error = signal<string | null>(null);

  async onSubmit() {
    if (this.form.invalid) return;
    
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const { email, password } = this.form.value;
      const { error } = await this.supabase.signIn(email!, password!);
      
      if (error) throw error;
      
      this.router.navigate(['/']);
    } catch (err: unknown) {
      this.error.set((err as Error).message || 'An error occurred during login');
    } finally {
      this.isLoading.set(false);
    }
  }
}
