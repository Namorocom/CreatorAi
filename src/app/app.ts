import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from './translation.service';
import { SupabaseService } from './supabase.service';
import { filter } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="relative min-h-screen bg-[#120F1A] font-sans max-w-md mx-auto overflow-hidden shadow-2xl">
      <router-outlet></router-outlet>

      <!-- Bottom Navigation -->
      @if (!isAuthPage()) {
        <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1A1625]/90 backdrop-blur-lg border-t border-white/5 px-6 py-4 z-50">
          <div class="flex justify-between items-center relative">
            
            <a routerLink="/" routerLinkActive="text-purple-400" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-300 transition-colors w-16">
              <mat-icon>home</mat-icon>
              <span class="text-[10px] font-bold uppercase tracking-wider">{{ i18n.t().home }}</span>
            </a>

            <a routerLink="/generator" routerLinkActive="text-purple-400" class="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-300 transition-colors w-16">
              <mat-icon>auto_awesome</mat-icon>
              <span class="text-[10px] font-bold uppercase tracking-wider">{{ i18n.t().create }}</span>
            </a>

            <a routerLink="/analysis" routerLinkActive="text-purple-400" class="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-300 transition-colors w-16">
              <mat-icon>bar_chart</mat-icon>
              <span class="text-[10px] font-bold uppercase tracking-wider">{{ i18n.t().analysis }}</span>
            </a>

            <a routerLink="/profile" routerLinkActive="text-purple-400" class="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-300 transition-colors w-16">
              <mat-icon>person</mat-icon>
              <span class="text-[10px] font-bold uppercase tracking-wider">{{ i18n.t().profile }}</span>
            </a>
            
          </div>
        </nav>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #000;
    }
  `]
})
export class App {
  i18n = inject(TranslationService);
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  
  isAuthPage = signal(false);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.isAuthPage.set(event.url.includes('/login') || event.url.includes('/signup'));
    });

    // Check auth status
    this.supabase.getSession().then(({ data: { session } }) => {
      if (!session && !this.isAuthPage()) {
        this.router.navigate(['/login']);
      }
    });

    this.supabase.onAuthStateChange((_event, session) => {
      if (!session && !this.isAuthPage()) {
        this.router.navigate(['/login']);
      } else if (session && this.isAuthPage()) {
        this.router.navigate(['/']);
      }
    });
  }
}

