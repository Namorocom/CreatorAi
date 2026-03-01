import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  async signUp(email: string, password: string, metadata: Record<string, unknown>) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  }

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async updateProfile(metadata: Record<string, unknown>) {
    return this.supabase.auth.updateUser({
      data: metadata
    });
  }

  async uploadAvatar(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = this.supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  }

  async saveHistory(data: { title: string; longText: string; type?: string | null }) {
    const historyItem = { 
      id: Math.random().toString(36).substring(2, 9),
      title: data.title,
      content: data.longText,
      type: data.type || 'post',
      created_at: new Date().toISOString()
    };

    try {
      const { data: result, error } = await this.supabase
        .from('history')
        .insert([historyItem]);
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error saving to Supabase, falling back to localStorage:', error);
      // Fallback to localStorage
      const localHistory = JSON.parse(localStorage.getItem('creatorai_history') || '[]');
      localHistory.unshift(historyItem);
      localStorage.setItem('creatorai_history', JSON.stringify(localHistory));
      return [historyItem];
    }
  }

  async getHistory() {
    try {
      const { data, error } = await this.supabase
        .from('history')
        .select('*')
        .neq('type', 'search')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching from Supabase, using localStorage:', error);
      const localHistory = JSON.parse(localStorage.getItem('creatorai_history') || '[]');
      return localHistory.filter((item: { type: string }) => item.type !== 'search').slice(0, 10);
    }
  }

  async searchHistory(query: string) {
    try {
      // Escape double quotes in the query to prevent injection
      const safeQuery = query.replace(/"/g, '""');
      const { data, error } = await this.supabase
        .from('history')
        .select('*')
        .neq('type', 'search')
        .or(`title.ilike."%${safeQuery}%",content.ilike."%${safeQuery}%"`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching history, using localStorage:', error);
      const localHistory = JSON.parse(localStorage.getItem('creatorai_history') || '[]');
      const lowerQuery = query.toLowerCase();
      return localHistory
        .filter((item: { type: string; title: string; content: string }) => item.type !== 'search' && 
          (item.title.toLowerCase().includes(lowerQuery) || item.content.toLowerCase().includes(lowerQuery)))
        .slice(0, 20);
    }
  }

  async saveSearchQuery(query: string) {
    const searchItem = { 
      id: Math.random().toString(36).substring(2, 9),
      title: query,
      content: 'Search Query',
      type: 'search',
      created_at: new Date().toISOString()
    };

    try {
      const { data: result, error } = await this.supabase
        .from('history')
        .insert([searchItem]);
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error saving search query, falling back to localStorage:', error);
      const localHistory = JSON.parse(localStorage.getItem('creatorai_history') || '[]');
      localHistory.unshift(searchItem);
      localStorage.setItem('creatorai_history', JSON.stringify(localHistory));
      return [searchItem];
    }
  }
}
