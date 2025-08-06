// Shared types for Lead Generation Engine

export type OwnerType = 'individual' | 'company' | 'corporate' | 'trust';

export interface Property {
  id: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  owner_name?: string;
  owner_type?: OwnerType;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: number;
  year_built?: number;
  assessed_value?: number;
  estimated_value?: number;
  equity_percent?: number;
  mortgage_status?: string;
  lien_status?: string;
  tags?: string[];
  status?: string;
  last_updated?: string;
  [key: string]: any; // For extensibility
}

/**
 * Advanced filter condition for layered AND/OR logic
 */
export type FilterField = keyof Property;
export type FilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'not in' | 'contains';

export interface AdvancedFilterCondition {
  field: FilterField;
  operator: FilterOperator;
  value: any;
}

export type FilterLogic = 'AND' | 'OR';

/**
 * Advanced filter group: can contain conditions, logic, or nested groups (for parentheses)
 */
export type AdvancedFilterGroup = (AdvancedFilterCondition | FilterLogic | AdvancedFilterGroup)[];

/**
 * New advanced filter state: supports layered, nested logic
 */
export interface AdvancedFilterState {
  conditions: AdvancedFilterGroup;
}

/**
 * @deprecated Use AdvancedFilterState for new features. This is kept for backward compatibility.
 */
export interface FilterState {
  propertyType?: string[];
  ownerType?: OwnerType[];
  equityPercentMin?: number;
  equityPercentMax?: number;
  mortgageStatus?: string[];
  lienStatus?: string[];
  bedroomsMin?: number;
  bedroomsMax?: number;
  bathroomsMin?: number;
  bathroomsMax?: number;
  squareFeetMin?: number;
  squareFeetMax?: number;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  tags?: string[];
  status?: string[];
  searchText?: string;
  mlsStatus?: string;
  yearsOwnedMin?: number;
  yearsOwnedMax?: number;
  saveSearch?: boolean;
  [key: string]: any; // For extensibility
}

export interface SearchArea {
  type: 'circle' | 'polygon' | 'rectangle' | 'bbox';
  coordinates: number[][]; // Array of [lng, lat] pairs
}

export interface SearchState {
  area?: SearchArea;
  filters: FilterState;
  advancedFilters?: AdvancedFilterState; // New: advanced filter state
  results: Property[];
  loading: boolean;
  error?: string;
  selectedPropertyId?: string;
  page: number;
  pageSize: number;
  totalResults: number;
  searchTerm?: string; // Add searchTerm to track current search
}

// Context actions for reducer (if using useReducer)
export type SearchAction =
  | { type: 'SET_FILTERS'; payload: FilterState }
  | { type: 'SET_ADVANCED_FILTERS'; payload: AdvancedFilterState } // New action
  | { type: 'SET_AREA'; payload: SearchArea }
  | { type: 'SET_RESULTS'; payload: { results: Property[]; total: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SELECT_PROPERTY'; payload: string | undefined }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_SEARCH_TERM'; payload: string } // Add SET_SEARCH_TERM action
  | { type: 'SET_PROPERTIES'; payload: Property[] }; // Add SET_PROPERTIES action 