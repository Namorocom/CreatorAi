import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="p-6 pb-24 min-h-screen bg-[#120F1A] text-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8 relative">
        <button routerLink="/" class="text-gray-400 hover:text-white transition-colors">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-xl font-semibold tracking-tight">{{ i18n.t().analysisGrowth }}</h1>
        <button (click)="isShareMenuOpen.set(!isShareMenuOpen())" class="text-gray-400 hover:text-white transition-colors">
          <mat-icon>share</mat-icon>
        </button>

        <!-- Share Menu -->
        @if (isShareMenuOpen()) {
          <div class="absolute right-0 top-10 w-56 bg-[#1A1625] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
            <button (click)="share('facebook')" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
              <mat-icon class="text-[18px] w-[18px] h-[18px] text-blue-500">facebook</mat-icon>
              Facebook
            </button>
            <button (click)="share('whatsapp')" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
              <mat-icon class="text-[18px] w-[18px] h-[18px] text-green-500">chat</mat-icon>
              WhatsApp
            </button>
            <button (click)="share('instagram')" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
              <mat-icon class="text-[18px] w-[18px] h-[18px] text-pink-500">camera_alt</mat-icon>
              Instagram
            </button>
            <div class="h-px bg-white/10 my-1"></div>
            <button (click)="share('quickshare')" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
              <mat-icon class="text-[18px] w-[18px] h-[18px] text-purple-400">bolt</mat-icon>
              {{ i18n.lang() === 'pt' ? 'Partilha Rápida' : 'Quick Share' }}
            </button>
            <button (click)="share('bluetooth')" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
              <mat-icon class="text-[18px] w-[18px] h-[18px] text-blue-400">bluetooth</mat-icon>
              Bluetooth
            </button>
          </div>
        }
      </div>

      <!-- Top Stats -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-5">
          <h4 class="text-sm font-medium text-gray-400 mb-2">{{ i18n.t().engagementPotential }}</h4>
          <div class="flex items-end gap-2 mb-2">
            <span class="text-4xl font-bold tracking-tight">88</span>
            <span class="text-gray-500 font-medium pb-1">/100</span>
          </div>
          <div class="flex items-center gap-1 text-emerald-400 text-sm font-medium">
            <mat-icon class="text-[16px] w-4 h-4">trending_up</mat-icon>
            +12%
          </div>
        </div>

        <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-5">
          <h4 class="text-sm font-medium text-gray-400 mb-2">{{ i18n.t().contentQuality }}</h4>
          <div class="flex items-end gap-2 mb-2">
            <span class="text-4xl font-bold tracking-tight">94</span>
            <span class="text-gray-500 font-medium pb-1">/100</span>
          </div>
          <div class="flex items-center gap-1 text-emerald-400 text-sm font-medium">
            <mat-icon class="text-[16px] w-4 h-4">verified</mat-icon>
            Top 5%
          </div>
        </div>
      </div>

      <!-- Chart Card -->
      <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-6 mb-6">
        <div class="flex justify-between items-start mb-8">
          <div class="max-w-[65%]">
            <h3 class="text-lg font-bold mb-1 text-white">{{ i18n.t().engagementForecast }}</h3>
            <p class="text-sm text-gray-400 leading-snug">{{ i18n.t().projectedInteractions }}</p>
          </div>
          <div class="text-right flex flex-col items-end shrink-0">
            <span class="text-3xl font-bold text-white mb-1 leading-none">2.4k</span>
            <p class="text-[10px] font-medium text-gray-400 tracking-widest uppercase text-right w-24 leading-tight">{{ i18n.t().estimatedReach }}</p>
          </div>
        </div>
        
        <!-- Mock Chart -->
        <div class="h-40 w-full relative mb-4">
          <svg viewBox="0 0 100 50" class="w-full h-full preserve-aspect-ratio-none overflow-visible">
            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(168, 85, 247, 0.2)" />
                <stop offset="100%" stop-color="rgba(168, 85, 247, 0)" />
              </linearGradient>
            </defs>
            <path d="M0,40 C2,40 4,15 7,15 C10,15 12,20 15,20 C18,20 20,35 22,35 C24,35 26,18 29,18 C32,18 34,35 36,35 C38,35 40,25 43,25 C46,25 48,18 51,18 C54,18 56,38 58,38 C60,38 62,45 65,45 C68,45 70,10 73,10 C76,10 78,30 81,30 C84,30 86,40 88,40 C90,40 92,15 95,15 L100,15 L100,50 L0,50 Z" fill="url(#chart-gradient)" />
            <path d="M0,40 C2,40 4,15 7,15 C10,15 12,20 15,20 C18,20 20,35 22,35 C24,35 26,18 29,18 C32,18 34,35 36,35 C38,35 40,25 43,25 C46,25 48,18 51,18 C54,18 56,38 58,38 C60,38 62,45 65,45 C68,45 70,10 73,10 C76,10 78,30 81,30 C84,30 86,40 88,40 C90,40 92,15 95,15 L100,15" class="stroke-[#A855F7] stroke-[2.5] fill-none" style="filter: drop-shadow(0 0 6px rgba(168,85,247,0.5)); stroke-linecap: round; stroke-linejoin: round;" />
          </svg>
        </div>
        
        <div class="flex justify-between text-xs font-bold text-gray-300 tracking-widest uppercase px-1">
          <span>6AM</span>
          <span>12PM</span>
          <span>6PM</span>
          <span>12AM</span>
        </div>
      </div>

      <!-- Best Time -->
      <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        
        <div class="flex items-center gap-4 mb-6 relative z-10">
          <div class="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <mat-icon class="text-white">schedule</mat-icon>
          </div>
          <div>
            <h3 class="text-lg font-semibold">{{ i18n.t().bestTimeToPost }}</h3>
            <p class="text-sm text-gray-400">{{ i18n.t().basedOnFollower }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 relative z-10">
          <div class="bg-gray-800/50 rounded-xl p-4 text-center">
            <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">{{ i18n.t().today }}</p>
            <p class="text-xl font-bold">6:45 PM</p>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4 text-center">
            <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">{{ i18n.t().tomorrow }}</p>
            <p class="text-xl font-bold">11:20 AM</p>
          </div>
        </div>
      </div>

      <!-- Improvement Suggestions -->
      <h3 class="text-xl font-semibold mb-4">{{ i18n.t().improvementSuggestions }}</h3>
      
      <div class="space-y-4">
        <!-- Suggestion 1 -->
        <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-5 flex gap-4">
          <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <span class="text-blue-400 font-bold">T</span>
          </div>
          <div>
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-semibold">{{ i18n.t().optimizeHook }}</h4>
              <span class="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-0.5 rounded">+5%</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">{{ i18n.t().optimizeHookDesc }}</p>
          </div>
        </div>

        <!-- Suggestion 2 -->
        <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-5 flex gap-4">
          <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
            <span class="text-amber-400 font-bold">#</span>
          </div>
          <div>
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-semibold">{{ i18n.t().nicheHashtag }}</h4>
              <span class="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-0.5 rounded">+8%</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">{{ i18n.t().nicheHashtagDesc }}</p>
          </div>
        </div>

        <!-- Suggestion 3 -->
        <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-5 flex gap-4">
          <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <mat-icon class="text-emerald-400 text-[20px] w-5 h-5">chat_bubble</mat-icon>
          </div>
          <div>
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-semibold">{{ i18n.t().interactiveElements }}</h4>
              <span class="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-0.5 rounded">+15%</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed">{{ i18n.t().interactiveElementsDesc }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalysisComponent {
  i18n = inject(TranslationService);
  isShareMenuOpen = signal(false);

  async share(platform: string) {
    this.isShareMenuOpen.set(false);
    
    const isPt = this.i18n.lang() === 'pt';
    const title = isPt ? 'Minha Análise de Engajamento' : 'My Engagement Analysis';
    const text = isPt 
      ? `📊 Análise de Engajamento\nPotencial: 88/100\nQualidade: 94/100\nPrevisão: 2.4k alcance\nMelhor horário: Hoje às 6:45 PM`
      : `📊 Engagement Analysis\nPotential: 88/100\nQuality: 94/100\nForecast: 2.4k reach\nBest time: Today at 6:45 PM`;
    const shareUrl = window.location.href;

    if (platform === 'quickshare' || platform === 'bluetooth') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: text,
            url: shareUrl
          });
        } catch (err) {
          console.error('Error sharing', err);
        }
      } else {
        alert(isPt ? 'Compartilhamento nativo não suportado neste navegador.' : 'Native sharing not supported in this browser.');
      }
      return;
    }

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(text + '\n\n' + shareUrl);
        alert(isPt ? 'Texto e link copiados! Abra o Instagram para colar e compartilhar.' : 'Text and link copied! Open Instagram to paste and share.');
        url = 'https://instagram.com';
        break;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
