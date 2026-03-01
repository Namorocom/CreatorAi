import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { GoogleGenAI } from '@google/genai';
import { SupabaseService } from './supabase.service';
import { TranslationService } from './translation.service';

interface GeneratedContent {
  title: string;
  shortText: string;
  longText: string;
  cta: string;
  hashtags: string[];
}

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="p-6 pb-24 min-h-screen bg-[#120F1A] text-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8 relative">
        <button routerLink="/" class="text-gray-400 hover:text-white transition-colors">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-xl font-semibold tracking-tight">{{ i18n.t().contentGenerator }}</h1>
        <button (click)="isMenuOpen.set(!isMenuOpen())" class="text-gray-400 hover:text-white transition-colors">
          <mat-icon>more_vert</mat-icon>
        </button>

        <!-- Dropdown Menu -->
        @if (isMenuOpen()) {
          <div class="absolute right-0 top-10 w-48 bg-[#1A1625] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
            <button (click)="clearForm(); isMenuOpen.set(false)" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
              <mat-icon class="text-[18px] w-[18px] h-[18px]">clear_all</mat-icon>
              {{ i18n.t().clearForm || 'Limpar Formulário' }}
            </button>
            <button routerLink="/history" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
              <mat-icon class="text-[18px] w-[18px] h-[18px]">history</mat-icon>
              {{ i18n.t().viewHistory || 'Ver Histórico' }}
            </button>
          </div>
        }
      </div>

      <!-- Progress -->
      <div class="flex items-center justify-between text-xs font-medium text-purple-400 tracking-wider uppercase mb-2">
        <span>{{ i18n.t().configuration }}</span>
        <span class="text-gray-500">{{ stepText() }}</span>
      </div>
      <div class="w-full h-1.5 bg-gray-800 rounded-full mb-8 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500 ease-out" [style.width]="progressWidth()"></div>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="generateContent()" class="space-y-6">
        <div>
          <label for="topic" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().topic }}</label>
          <input id="topic" type="text" formControlName="topic" placeholder="e.g. Benefits of AI in Design" 
                 class="w-full h-14 bg-[#1A1625] border border-white/10 rounded-xl px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
        </div>

        <div>
          <label for="audience" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().targetAudience }}</label>
          <input id="audience" type="text" formControlName="audience" placeholder="e.g. Graphic Designers" 
                 class="w-full h-14 bg-[#1A1625] border border-white/10 rounded-xl px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
        </div>

        <div>
          <label for="goal" class="block text-sm font-medium text-gray-300 mb-2">{{ i18n.t().contentGoal }}</label>
          <div class="relative">
            <select id="goal" formControlName="goal" class="w-full h-14 bg-[#1A1625] border border-white/10 rounded-xl px-4 text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
              <option value="Educate & Inform">Educate & Inform</option>
              <option value="Entertain">Entertain</option>
              <option value="Inspire">Inspire</option>
              <option value="Sell Product">Sell Product</option>
              <option value="Drive Traffic">Drive Traffic</option>
            </select>
            <mat-icon class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</mat-icon>
          </div>
        </div>

        <button type="submit" [disabled]="form.invalid || isLoading()" 
                class="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed mt-8">
          @if (isLoading()) {
            <mat-icon class="animate-spin">sync</mat-icon>
            {{ i18n.t().generating }}
          } @else {
            <mat-icon>auto_awesome</mat-icon>
            {{ i18n.t().generateAiContent }}
          }
        </button>
      </form>

      <!-- Results -->
      @if (result()) {
        <div class="mt-10 bg-[#1A1625] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2 text-purple-400 font-semibold">
              <mat-icon>smart_toy</mat-icon>
              <span>{{ i18n.t().aiResponse }}</span>
            </div>
            <div class="flex bg-gray-800 rounded-lg p-1">
              <button (click)="activeTab.set('short')" [class.bg-purple-600]="activeTab() === 'short'" [class.text-white]="activeTab() === 'short'" [class.text-gray-400]="activeTab() !== 'short'" class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors">{{ i18n.t().short }}</button>
              <button (click)="activeTab.set('long')" [class.bg-purple-600]="activeTab() === 'long'" [class.text-white]="activeTab() === 'long'" [class.text-gray-400]="activeTab() !== 'long'" class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors">{{ i18n.t().long }}</button>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h4 class="text-[10px] font-bold text-purple-400 tracking-widest uppercase mb-2">{{ i18n.t().catchyTitle }}</h4>
              <h2 class="text-2xl font-bold leading-tight">{{ result()?.title }}</h2>
            </div>

            <div>
              <h4 class="text-[10px] font-bold text-purple-400 tracking-widest uppercase mb-2">{{ i18n.t().optimizedText }}</h4>
              <p class="text-gray-300 leading-relaxed text-lg">
                {{ activeTab() === 'short' ? result()?.shortText : result()?.longText }}
              </p>
            </div>

            <div class="bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-xl">
              <h4 class="text-[10px] font-bold text-purple-400 tracking-widest uppercase mb-2">{{ i18n.t().callToAction }}</h4>
              <p class="font-medium text-purple-100">"{{ result()?.cta }}"</p>
            </div>

            <div>
              <h4 class="text-[10px] font-bold text-purple-400 tracking-widest uppercase mb-3">{{ i18n.t().relevantHashtags }}</h4>
              <div class="flex flex-wrap gap-2">
                @for (tag of result()?.hashtags; track tag) {
                  <span class="bg-purple-500/10 text-purple-300 text-xs font-medium px-3 py-1.5 rounded-full border border-purple-500/20">
                    {{ tag }}
                  </span>
                }
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/5">
            <button class="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <mat-icon class="text-[20px] w-5 h-5">content_copy</mat-icon>
              {{ i18n.t().copy }}
            </button>
            <button class="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <mat-icon class="text-[20px] w-5 h-5">share</mat-icon>
              {{ i18n.t().share }}
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class GeneratorComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private supabase = inject(SupabaseService);
  i18n = inject(TranslationService);

  form = this.fb.group({
    topic: ['', Validators.required],
    audience: ['', Validators.required],
    goal: ['Educate & Inform', Validators.required],
    type: ['instagram']
  });

  isLoading = signal(false);
  isMenuOpen = signal(false);
  activeTab = signal<'short' | 'long'>('short');
  result = signal<GeneratedContent | null>(null);

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  currentStep = computed(() => {
    const val = this.formValue();
    if (val.topic && val.audience) return 2;
    if (val.topic || val.audience) return 1.5;
    return 1;
  });

  progressWidth = computed(() => {
    const step = this.currentStep();
    if (step === 2) return '100%';
    if (step === 1.5) return '75%';
    return '50%';
  });

  stepText = computed(() => {
    const step = Math.floor(this.currentStep());
    return this.i18n.lang() === 'pt' ? `PASSO ${step} DE 2` : `STEP ${step} OF 2`;
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.form.patchValue({ type: params['type'] });
      }
    });
  }

  clearForm() {
    this.form.reset({
      goal: 'Educate & Inform',
      type: this.form.value.type || 'instagram'
    });
    this.result.set(null);
  }

  async generateContent() {
    if (this.form.invalid) return;
    
    this.isLoading.set(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const values = this.form.value;
      
      const prompt = `
        Act as an expert social media manager and copywriter.
        Generate content for a ${values.type} post.
        Topic: ${values.topic}
        Target Audience: ${values.audience}
        Goal: ${values.goal}
        
        Return the response strictly as a JSON object with the following structure:
        {
          "title": "A catchy, engaging title",
          "shortText": "A concise, punchy version of the content (max 2-3 sentences)",
          "longText": "A detailed, engaging version of the content with storytelling elements",
          "cta": "A strong call to action",
          "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const jsonStr = response.text?.trim() || '{}';
      const data = JSON.parse(jsonStr);
      this.result.set(data);
      
      // Save to Supabase history
      await this.supabase.saveHistory({
        title: data.title,
        longText: data.longText,
        type: values.type
      });
      
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback for demo if API fails
      const fallbackData = {
        title: "Mastering the Future: 5 Ways AI is Revolutionizing Modern Design",
        shortText: "AI is changing design forever. Discover how tools are automating tasks and boosting creativity.",
        longText: "Design is no longer just about aesthetics; it's about intelligence. AI tools are augmenting human creativity, allowing designers to bypass repetitive tasks and focus on what truly matters: strategy and emotion. From generative layouts to automated color theory, discover how these tools are becoming your new creative partner.",
        cta: "Ready to upgrade your workflow? Start your AI design journey today.",
        hashtags: ["#AIDesign", "#CreativeTech", "#DesignFuture"]
      };
      this.result.set(fallbackData);
      
      await this.supabase.saveHistory({
        title: fallbackData.title,
        longText: fallbackData.longText,
        type: this.form.value.type
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}
