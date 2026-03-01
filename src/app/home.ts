import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from './translation.service';
import { SupabaseService } from './supabase.service';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="p-6 pb-24 min-h-screen bg-[#120F1A] text-white relative">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <mat-icon class="text-white">auto_awesome</mat-icon>
          </div>
          <h1 class="text-2xl font-semibold tracking-tight">CreatorAI</h1>
        </div>
        <div class="flex items-center gap-4">
          <button (click)="toggleSearch()" class="text-gray-400 hover:text-white transition-colors">
            <mat-icon>search</mat-icon>
          </button>
          <button (click)="toggleNotifications()" class="text-gray-400 hover:text-white transition-colors relative">
            <mat-icon>notifications</mat-icon>
            <span class="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
          </button>
          <div class="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-purple-500/30">
            <img [src]="avatarUrl()" alt="Avatar" referrerpolicy="no-referrer" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Search Bar (Conditional) -->
      @if (isSearchActive()) {
        <div class="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div class="relative">
            <button (click)="performSearch(searchInput.value)" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors z-10">
              <mat-icon>search</mat-icon>
            </button>
            <input #searchInput type="text" [placeholder]="i18n.t().searchPlaceholder" 
                   (keyup.enter)="performSearch(searchInput.value)"
                   class="w-full h-14 bg-[#1A1625] border border-purple-500/30 rounded-xl pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
          </div>
          
          <!-- Search Results -->
          @if (isSearching()) {
            <div class="mt-4 text-center text-purple-400">
              <mat-icon class="animate-spin">sync</mat-icon>
            </div>
          } @else if (searchResults().length > 0) {
            <div class="mt-4 space-y-3">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{{ i18n.t().searchResults }}</h3>
              @for (result of searchResults(); track result.id) {
                <div class="bg-[#1A1625] border border-white/5 rounded-xl p-4 hover:bg-[#231d33] transition-colors cursor-pointer">
                  <h4 class="font-medium text-purple-300 mb-1">{{ result.title }}</h4>
                  <p class="text-sm text-gray-400 line-clamp-2">{{ result.content }}</p>
                </div>
              }
            </div>
          } @else if (hasSearched()) {
            <div class="mt-4 text-center text-gray-400 text-sm">
              <p>{{ i18n.t().noResults }}</p>
            </div>
          }
        </div>
      }

      <!-- Notifications Dropdown (Conditional) -->
      @if (isNotificationsActive()) {
        <div class="absolute top-20 right-6 w-72 bg-[#1A1625] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div class="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 class="font-semibold">{{ i18n.t().notifications }}</h3>
            <button (click)="toggleNotifications()" class="text-gray-500 hover:text-white transition-colors">
              <mat-icon class="text-[18px] w-[18px] h-[18px]">close</mat-icon>
            </button>
          </div>
          <div class="p-6 text-center text-gray-400 text-sm">
            <mat-icon class="text-gray-600 mb-2 text-3xl w-8 h-8">notifications_off</mat-icon>
            <p>{{ i18n.t().noNotifications }}</p>
          </div>
        </div>
        <!-- Backdrop for notifications -->
        <button class="fixed inset-0 z-40 bg-black/20 w-full h-full cursor-default" (click)="toggleNotifications()" aria-label="Close notifications"></button>
      }

      <!-- Hero Card -->
      <div class="bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-lg shadow-purple-900/20">
        <div class="absolute right-0 top-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
          <mat-icon style="font-size: 160px; width: 160px; height: 160px;">bolt</mat-icon>
        </div>
        <div class="relative z-10">
          <h2 class="text-3xl font-bold mb-2">{{ i18n.t().hello }}, {{ userName() }}!</h2>
          <p class="text-purple-100 mb-6 max-w-[80%]">{{ i18n.t().readyToTurn }}</p>
          <button routerLink="/generator" class="bg-white text-purple-700 font-semibold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-md">
            <mat-icon class="text-purple-600">add_circle</mat-icon>
            {{ i18n.t().createNewProject }}
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex justify-between items-end mb-4">
        <h3 class="text-xl font-semibold">{{ i18n.t().quickActions }}</h3>
        <button class="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors">{{ i18n.t().seeAll }}</button>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Action 1 -->
        <button routerLink="/generator" [queryParams]="{type: 'instagram'}" class="bg-[#1A1625] border border-white/5 rounded-2xl p-5 text-left hover:bg-[#231d33] transition-colors group">
          <div class="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
            <mat-icon class="text-pink-500">photo_camera</mat-icon>
          </div>
          <h4 class="font-semibold text-lg mb-1">{{ i18n.t().instagramPost }}</h4>
          <p class="text-gray-400 text-sm">{{ i18n.t().socialFeed }}</p>
        </button>

        <!-- Action 2 -->
        <button routerLink="/generator" [queryParams]="{type: 'youtube'}" class="bg-[#1A1625] border border-white/5 rounded-2xl p-5 text-left hover:bg-[#231d33] transition-colors group">
          <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
            <mat-icon class="text-red-500">play_circle</mat-icon>
          </div>
          <h4 class="font-semibold text-lg mb-1">{{ i18n.t().youtubeScript }}</h4>
          <p class="text-gray-400 text-sm">{{ i18n.t().videoContent }}</p>
        </button>

        <!-- Action 3 -->
        <button routerLink="/generator" [queryParams]="{type: 'tiktok'}" class="bg-[#1A1625] border border-white/5 rounded-2xl p-5 text-left hover:bg-[#231d33] transition-colors group">
          <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
            <mat-icon class="text-cyan-500">music_note</mat-icon>
          </div>
          <h4 class="font-semibold text-lg mb-1">{{ i18n.t().tiktokShort }}</h4>
          <p class="text-gray-400 text-sm">{{ i18n.t().shortForm }}</p>
        </button>

        <!-- Action 4 -->
        <button routerLink="/generator" [queryParams]="{type: 'shopify'}" class="bg-[#1A1625] border border-white/5 rounded-2xl p-5 text-left hover:bg-[#231d33] transition-colors group">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
            <mat-icon class="text-emerald-500">shopping_bag</mat-icon>
          </div>
          <h4 class="font-semibold text-lg mb-1">{{ i18n.t().shopifyDesc }}</h4>
          <p class="text-gray-400 text-sm">{{ i18n.t().ecommerce }}</p>
        </button>
      </div>

      <!-- Action 5 (Full width) -->
      <button routerLink="/generator" [queryParams]="{type: 'ad'}" class="w-full bg-[#1A1625] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:bg-[#231d33] transition-colors group">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <mat-icon class="text-purple-500">campaign</mat-icon>
          </div>
          <div class="text-left">
            <h4 class="font-semibold text-lg">{{ i18n.t().salesAd }}</h4>
            <p class="text-gray-400 text-sm">{{ i18n.t().marketing }}</p>
          </div>
        </div>
        <mat-icon class="text-gray-500">chevron_right</mat-icon>
      </button>
    </div>
  `
})
export class HomeComponent implements OnInit {
  i18n = inject(TranslationService);
  private supabase = inject(SupabaseService);

  isSearchActive = signal(false);
  isNotificationsActive = signal(false);
  
  isSearching = signal(false);
  hasSearched = signal(false);
  searchResults = signal<SearchResult[]>([]);

  userName = signal<string>('Alex');
  avatarUrl = signal<string>('https://picsum.photos/seed/avatar/100/100');

  async ngOnInit() {
    const { data: { session } } = await this.supabase.getSession();
    if (session?.user) {
      const fullName = session.user.user_metadata?.['full_name'];
      if (fullName) {
        // Get just the first name
        this.userName.set(fullName.split(' ')[0]);
      }
      if (session.user.user_metadata?.['avatar_url']) {
        this.avatarUrl.set(session.user.user_metadata['avatar_url']);
      }
    }
  }

  toggleSearch() {
    this.isSearchActive.set(!this.isSearchActive());
    if (this.isSearchActive()) {
      this.isNotificationsActive.set(false);
    } else {
      // Reset search state when closing
      this.searchResults.set([]);
      this.hasSearched.set(false);
    }
  }

  toggleNotifications() {
    this.isNotificationsActive.set(!this.isNotificationsActive());
    if (this.isNotificationsActive()) {
      this.isSearchActive.set(false);
    }
  }

  async performSearch(query: string) {
    if (!query || query.trim().length === 0) return;
    
    this.isSearching.set(true);
    this.hasSearched.set(true);
    
    try {
      // Save the search query to history
      await this.supabase.saveSearchQuery(query);
      
      // Perform the search
      const results = await this.supabase.searchHistory(query);
      this.searchResults.set(results || []);
    } catch (error) {
      console.error('Search failed:', error);
      this.searchResults.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }
}
