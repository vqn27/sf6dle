import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../item.model';
import { SF6_ROSTER } from '../roster';

@Component({
  selector: 'app-search',
  standalone: true, // Modern Angular format
  imports: [
    CommonModule,   // Enables *ngIf, @for
    FormsModule     // Enables [(ngModel)]
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit {
  // === UI State ===
  searchTerm = signal('');
  isDropdownOpen = signal(false);
  
  // === Data State ===
  fullItemList: Item[] = SF6_ROSTER;

  selectedItem = signal<Item | undefined>(undefined);
  // store a separately chosen random item (not automatically selected)
  randomItem = signal<Item | undefined>(undefined);
  // history of recent selections (most recent first)
  selectionHistory = signal<Item[]>([]);

  /**
   * Computed signal to filter the list in real-time based on the searchTerm.
   */
  filteredItemList = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    // Exclude recently selected items (present in selectionHistory)
    const recentIds = new Set(this.selectionHistory().map(i => i.id));

    // If no term, return all items except recent ones (for browsing)
    const source = this.fullItemList.filter(i => !recentIds.has(i.id));
    if (!term) return source;

    // Filter by name (case-insensitive) from the non-recent list
    return source.filter(item => item.name.toLowerCase().includes(term));
  });

  ngOnInit() {
    // Pick a random item on startup and store it separately; fall back to first item selection if none found
    const picked = this.selectRandomItem();
    if (!picked && this.fullItemList.length > 0) {
      // keep previous behavior: select the first item if random pick failed
      this.selectItem(this.fullItemList[0]);
    }
  }

  /**
   * Selects an item, updates the input field, and closes the dropdown.
   * @param item The Item object to select.
   */
  selectItem(item: Item): void {
    this.selectedItem.set(item);
    this.searchTerm.set(item.name); // Set the input value to the selected name
    this.isDropdownOpen.set(false); // Close the dropdown
    // record in history, keep unique and cap at 8
    const prev = this.selectionHistory();
    const filtered = prev.filter(p => p.id !== item.id);
    this.selectionHistory.set([item, ...filtered].slice(0, 29));
  }

  clearHistory(): void {
    this.selectionHistory.set([]);
  }

  /**
   * Opens the dropdown when the input is focused.
   */
  onInputFocus(): void {
    this.isDropdownOpen.set(true);
  }

  /**
   * Closes the dropdown after a short delay (crucial for click events to register).
   */
  onInputBlur(): void {
    setTimeout(() => {
      this.isDropdownOpen.set(false);
    }, 200);
  }

  /**
   * Return a random id from `fullItemList`, or undefined when the list is empty.
   */
  getRandomId(): number | undefined {
    if (!this.fullItemList || this.fullItemList.length === 0) return undefined;
    const idx = Math.floor(Math.random() * this.fullItemList.length);
    return this.fullItemList[idx].id;
  }

  /**
   * Pick a random item from the list and select it (updates signals). Returns the selected Item or undefined.
   */
  selectRandomItem(): Item | undefined {
    const id = this.getRandomId();
    if (id === undefined) {
      this.randomItem.set(undefined);
      return undefined;
    }
    const item = this.fullItemList.find(i => i.id === id);
    // instead of auto-selecting, store the random item separately so caller can decide what to do with it
    this.randomItem.set(item);
    return item;
  }
}
