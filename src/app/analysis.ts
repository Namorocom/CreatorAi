import { Component, inject } from '@angular/core';
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
      <div class="flex items-center justify-between mb-8">
        <button routerLink="/" class="text-gray-400 hover:text-white transition-colors">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-xl font-semibold tracking-tight">{{ i18n.t().analysisGrowth }}</h1>
        <button class="text-gray-400 hover:text-white transition-colors">
          <mat-icon>share</mat-icon>
        </button>
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
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-lg font-semibold mb-1">{{ i18n.t().engagementForecast }}</h3>
            <p class="text-sm text-gray-400">{{ i18n.t().projectedInteractions }}</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold">2.4k</span>
            <p class="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{{ i18n.t().estimatedReach }}</p>
          </div>
        </div>
        
        <!-- Mock Chart -->
        <div class="h-40 w-full relative mb-4 flex items-end">
          <svg viewBox="0 0 100 40" class="w-full h-full preserve-aspect-ratio-none stroke-purple-500 stroke-[1.5] fill-none">
            <path d="M0,30 Q5,10 10,15 T20,25 T30,10 T40,28 T50,18 T60,35 T70,5 T80,25 T90,10 T100,15" />
          </svg>
          <div class="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-purple-500/20 to-transparent pointer-events-none" style="clip-path: polygon(0 30%, 10% 15%, 20% 25%, 30% 10%, 40% 28%, 50% 18%, 60% 35%, 70% 5%, 80% 25%, 90% 10%, 100% 15%, 100% 100%, 0 100%);"></div>
        </div>
        
        <div class="flex justify-between text-xs font-bold text-gray-500 tracking-widest uppercase">
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
}
