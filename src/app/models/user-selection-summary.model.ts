// src/app/features/user-selection/models/user-selection-summary.model.ts

export interface UserSelectionSummary {
  id: number;
  userId: number;
  username: string;
  menuDate: string; // La fecha del menú en formato ISO 8601
  selectedCategory: string;
  selectionDateTime: string; // La fecha y hora en que el usuario hizo la selección
  isActive: boolean;
  selectedMenuItemName: string;
  observation: string;
}