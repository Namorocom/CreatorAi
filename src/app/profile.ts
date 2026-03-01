import { Component, inject, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { TranslationService } from './translation.service';

interface HistoryItem {
  id?: string;
  title: string;
  content?: string;
  type?: string;
  created_at?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="p-6 pb-24 min-h-screen bg-[#120F1A] text-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <button routerLink="/" class="text-gray-400 hover:text-white transition-colors">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-xl font-semibold tracking-tight">{{ i18n.t().userProfile }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="i18n.toggle()" class="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
            <mat-icon class="text-[18px] w-[18px] h-[18px]">language</mat-icon>
            {{ i18n.lang() === 'en' ? 'PT' : 'EN' }}
          </button>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-4">
          <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-purple-500 to-pink-500">
            <img [src]="avatarUrl()" alt="Avatar" referrerpolicy="no-referrer" class="w-full h-full rounded-full object-cover border-4 border-[#120F1A]" />
          </div>
          <button (click)="fileInput.click()" class="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-2 border-[#120F1A] shadow-lg hover:bg-purple-500 transition-colors">
            <mat-icon class="text-white text-[16px] w-4 h-4">edit</mat-icon>
            @if (isUploading()) {
              <mat-icon class="text-white text-[16px] w-4 h-4 animate-spin absolute">sync</mat-icon>
            }
          </button>
          <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)" />
        </div>
        <h2 class="text-2xl font-bold mb-1">{{ userName() }}</h2>
        <p class="text-purple-400 font-medium">{{ userEmail() }}</p>
      </div>

      <!-- Plan Card -->
      <div class="bg-[#1A1625] border border-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div class="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p class="text-sm text-gray-400 mb-1">{{ i18n.t().currentPlan }}</p>
            <h3 class="text-xl font-bold">{{ i18n.t().freeTier }}</h3>
          </div>
          <span class="bg-purple-900/50 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">BASIC</span>
        </div>
        
        <div class="mb-6 relative z-10">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-300">{{ i18n.t().generationCredits }}</span>
            <span class="font-bold">3 / 10 {{ i18n.t().used }}</span>
          </div>
          <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-purple-500 to-purple-400 w-[30%] rounded-full"></div>
          </div>
        </div>
        
        <button class="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-900/30 relative z-10">
          <mat-icon>auto_awesome</mat-icon>
          {{ i18n.t().upgradeToPremium }}
        </button>
      </div>

      <!-- Account Management -->
      <h3 class="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-4">{{ i18n.t().accountManagement }}</h3>
      
      <div class="space-y-3 mb-8">
        <button class="w-full bg-[#1A1625] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#231d33] transition-colors group">
          <div class="flex items-center gap-4">
            <mat-icon class="text-purple-500">person</mat-icon>
            <span class="font-medium">{{ i18n.t().personalInformation }}</span>
          </div>
          <mat-icon class="text-gray-500">chevron_right</mat-icon>
        </button>
        
        <button class="w-full bg-[#1A1625] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#231d33] transition-colors group">
          <div class="flex items-center gap-4">
            <mat-icon class="text-purple-500">payment</mat-icon>
            <span class="font-medium">{{ i18n.t().billingInvoices }}</span>
          </div>
          <mat-icon class="text-gray-500">chevron_right</mat-icon>
        </button>
        
        <button class="w-full bg-[#1A1625] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-[#231d33] transition-colors group">
          <div class="flex items-center gap-4">
            <mat-icon class="text-purple-500">security</mat-icon>
            <span class="font-medium">{{ i18n.t().securityPrivacy }}</span>
          </div>
          <mat-icon class="text-gray-500">chevron_right</mat-icon>
        </button>

        <button (click)="logout()" class="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between hover:bg-red-500/20 transition-colors group">
          <div class="flex items-center gap-4 text-red-400">
            <mat-icon>logout</mat-icon>
            <span class="font-medium">{{ i18n.t().logout }}</span>
          </div>
        </button>
      </div>

      <!-- Generation History -->
      <div class="flex justify-between items-end mb-4">
        <h3 class="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{{ i18n.t().generationHistory }}</h3>
        <button routerLink="/history" class="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors">{{ i18n.t().viewAll }}</button>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        @for (item of history(); track item.id) {
          <div class="bg-[#1A1625] border border-white/5 rounded-2xl overflow-hidden relative group cursor-pointer">
            <div class="aspect-square bg-gray-800 relative">
              <img [src]="'https://picsum.photos/seed/' + item.id + '/300/300'" alt="History" referrerpolicy="no-referrer" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 left-0 w-full p-3">
                <p class="text-xs font-medium text-white truncate">{{ item.title }}</p>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-2 text-center py-8 text-gray-500">
            {{ i18n.t().noHistory }}
          </div>
        }
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private supabase = inject(SupabaseService);
  i18n = inject(TranslationService);
  
  history = signal<HistoryItem[]>([]);
  userName = signal<string>('');
  userEmail = signal<string>('');
  avatarUrl = signal<string>('https://picsum.photos/seed/avatar/200/200');
  isUploading = signal(false);

  async ngOnInit() {
    const { data: { session } } = await this.supabase.getSession();
    if (session?.user) {
      this.userEmail.set(session.user.email || '');
      this.userName.set(session.user.user_metadata?.['full_name'] || 'User');
      if (session.user.user_metadata?.['avatar_url']) {
        this.avatarUrl.set(session.user.user_metadata['avatar_url']);
      }
    }

    const data = await this.supabase.getHistory();
    if (data) {
      this.history.set(data);
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.isUploading.set(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        
        // Update local state
        this.avatarUrl.set(dataUrl);
        
        // Update Supabase user metadata
        await this.supabase.updateProfile({ avatar_url: dataUrl });
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        this.isUploading.set(false);
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      this.isUploading.set(false);
    };
    
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error starting file read:', error);
      this.isUploading.set(false);
    }
  }

  async logout() {
    await this.supabase.signOut();
  }
}


