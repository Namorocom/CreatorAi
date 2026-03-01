import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from './supabase.service';
import { TranslationService } from './translation.service';

interface HistoryItem {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="p-6 pb-24 min-h-screen bg-[#120F1A] text-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <button routerLink="/profile" class="text-gray-400 hover:text-white transition-colors">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-xl font-semibold tracking-tight">{{ i18n.t().generationHistory }}</h1>
        <div class="w-6"></div> <!-- Spacer for alignment -->
      </div>

      <!-- History List -->
      <div class="space-y-4">
        @if (isLoading()) {
          <div class="flex justify-center py-8">
            <mat-icon class="animate-spin text-purple-500">sync</mat-icon>
          </div>
        } @else if (history().length > 0) {
          @for (item of history(); track item.id) {
            <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-5 hover:bg-[#231d33] transition-colors">
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <mat-icon class="text-purple-500 text-[18px] w-[18px] h-[18px]">{{ getIconForType(item.type) }}</mat-icon>
                  </div>
                  <span class="text-xs font-medium text-purple-400 uppercase tracking-wider">{{ item.type }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(item.created_at) }}</span>
              </div>
              <h3 class="text-lg font-bold mb-2">{{ item.title }}</h3>
              <p class="text-sm text-gray-400 line-clamp-3">{{ item.content }}</p>
              <div class="mt-4 flex justify-end">
                <button class="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors flex items-center gap-1">
                  {{ i18n.t().viewDetails }}
                  <mat-icon class="text-[16px] w-4 h-4">chevron_right</mat-icon>
                </button>
              </div>
            </div>
          }
        } @else {
          <div class="text-center py-12 bg-[#1A1625] border border-white/5 rounded-2xl">
            <mat-icon class="text-gray-600 text-4xl mb-3 w-10 h-10">history</mat-icon>
            <p class="text-gray-400">{{ i18n.t().noHistory }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  private supabase = inject(SupabaseService);
  i18n = inject(TranslationService);
  
  history = signal<HistoryItem[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    await this.loadHistory();
  }

  async loadHistory() {
    this.isLoading.set(true);
    try {
      const data = await this.supabase.getHistory();
      if (data) {
        this.history.set(data as HistoryItem[]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  getIconForType(type: string): string {
    switch (type?.toLowerCase()) {
      case 'instagram': return 'photo_camera';
      case 'youtube': return 'play_circle';
      case 'tiktok': return 'music_note';
      case 'shopify': return 'shopping_bag';
      case 'ad': return 'campaign';
      default: return 'article';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(this.i18n.lang() === 'pt' ? 'pt-BR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
}
