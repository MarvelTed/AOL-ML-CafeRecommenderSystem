export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface RecommendationItem {
  id: string;
  score: number;
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
  cart?: string[];
}

export interface RecommendationRequest {
  items: string[];
  top_k?: number;
}
