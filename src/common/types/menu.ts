export const serviceStatuses = [
  "AVAILABLE",
  "SOLD_OUT",
  "UNAVAILABLE",
] as const;
export type ServiceStatus = (typeof serviceStatuses)[number];

export interface MenuCategory {
  id?: string;
  categoryHandle: string;
  categoryName: string;
  index: number;
  cafeteriaId?: string;
  menus?: Menu[];
}

export interface OptionChoice {
  id?: string;
  cafeteriaId?: string;
  menuOptionHandle?: string;
  choiceHandle: string;
  choiceName: string;
  isDefault?: boolean;
  priceDiff: number;
  index?: number;
}

export interface MenuOption {
  id?: string;
  cafeteriaId?: string;
  optionHandle: string;
  optionName: string;
  choiceList?: OptionChoice[];
  choiceNum: number;
  priority?: number;
}

export interface Menu {
  id?: string;
  cafeteriaId?: string;
  title: string;
  contents: string[];
  price?: number;
  serviceStatus?: ServiceStatus;
  backgroundImageURL?: string;
  categoryHandle: string;
  options?: MenuOption[];
  availableQuantity?: number;
  defaultQuantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDaily: boolean;
  index?: number;
}

// /cafeteria/menu/index-controlで使っている
export class SortedMenuProp {
  id: string;
  name: string;
}

export interface PresetInfo {
  id?: string;
  year: number;
  month: number;
  date: number;
  presetMenus?: PresetMenu[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface PresetMenu {
  id?: string;
  menuId?: string;
  menuRelation?: Menu;

  contents: string[];
  presetInfo?: PresetInfo;
}
