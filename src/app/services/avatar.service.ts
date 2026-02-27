import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

////////////////////VEJA VIDIN
//https://www.youtube.com/watch?v=2LCo926NFLI
//https://www.youtube.com/watch?v=-CoVmNvp_1g

interface StoredUser {
  id: string;
  name: string;
  email: string;
  type?: string;
  picture?: string | null;
}

/**
 * Shared avatar state & actions.
 * Any component can update the avatar via this service, and others can react by subscribing.
 */
@Injectable({ providedIn: 'root' })
export class AvatarService {
  /** Emits a data URL when an image is available, undefined when using emoji fallback */
  readonly avatarUrl$ = new BehaviorSubject<string | undefined>(undefined);
  /** Simple emoji fallback that we toggle so users see a change even without backend */
  readonly emoji$ = new BehaviorSubject<string>('👤');

  constructor(private http: HttpClient) {
    console.log('[AvatarService] - constructor: Avatar service initialized');
  }

  /**
   * Syncs avatar with the stored user data from localStorage.
   * Reads the user's picture ID and fetches the image if available.
   * If no picture exists, resets to emoji fallback.
   */
  async syncWithStoredUser(): Promise<void> {
    console.log('[AvatarService] - syncWithStoredUser: Syncing avatar with stored user');
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('[AvatarService] - syncWithStoredUser: No user found in localStorage, resetting to emoji');
        this.avatarUrl$.next(undefined);
        this.emoji$.next('👤');
        return;
      }

      const user: StoredUser = JSON.parse(userStr);
      console.log('[AvatarService] - syncWithStoredUser: User loaded:', user.name, 'picture:', user.picture);

      if (user.picture) {
        await this.loadPicture(user.picture);
      } else {
        console.log('[AvatarService] - syncWithStoredUser: No picture ID, using emoji fallback');
        this.avatarUrl$.next(undefined);
        this.emoji$.next('👤');
      }
    } catch (e) {
      console.error('[AvatarService] - syncWithStoredUser: Error syncing avatar:', e);
      this.avatarUrl$.next(undefined);
      this.emoji$.next('👤');
    }
  }

  /**
   * Loads a picture from the backend by its ID and converts it to a data URL.
   * @param pictureId The ID of the picture to load
   */
  private async loadPicture(pictureId: string): Promise<void> {
    console.log('[AvatarService] - loadPicture: Loading picture:', pictureId);
    try {
      const url = `${environment.apiUrl}/pictures/${pictureId}`;
      console.log('[AvatarService] - loadPicture: Fetching from:', url);
      
      this.http.get(url, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          console.log('[AvatarService] - loadPicture: Received blob, size:', blob.size);
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            console.log('[AvatarService] - loadPicture: Converted to data URL, length:', dataUrl.length);
            this.avatarUrl$.next(dataUrl);
          };
          reader.onerror = (error) => {
            console.error('[AvatarService] - loadPicture: Error reading blob:', error);
            this.avatarUrl$.next(undefined);
            this.emoji$.next('👤');
          };
          reader.readAsDataURL(blob);
        },
        error: (err) => {
          console.error('[AvatarService] - loadPicture: HTTP error:', err);
          this.avatarUrl$.next(undefined);
          this.emoji$.next('👤');
        }
      });
    } catch (e) {
      console.error('[AvatarService] - loadPicture: Error loading picture:', e);
      this.avatarUrl$.next(undefined);
      this.emoji$.next('👤');
    }
  }

  /**
   * Attempts to load a new avatar from the backend; on failure or empty result,
   * flips the emoji to visually indicate a change.
   *
   * How this makes one component change another:
   * - Components display (subscribe to) avatarUrl$/emoji$ using the async pipe.
   * - When this method updates those BehaviorSubjects, all subscribers update (e.g., Navbar).
   * 
   * @deprecated Use syncWithStoredUser() instead
   */
  async changePic(): Promise<void> {
    console.log('[AvatarService] - changePic: Attempting to change avatar picture');
    await this.syncWithStoredUser();
  }
}
