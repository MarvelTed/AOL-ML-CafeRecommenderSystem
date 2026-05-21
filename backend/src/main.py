from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import json
from typing import Any

app = FastAPI(title="Cafe Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "knn_recommendations.json"
try:
    with open(MODEL_PATH, 'r', encoding='utf-8') as f:
        rekomendasi_model = json.load(f)
except FileNotFoundError as e:
    rekomendasi_model = {}
    print(f"Recommendation model file not found: {e}")


def normalize_key(value: str) -> str:
    return value.strip().lower()


def singularize(value: str) -> str:
    value = value.strip()
    if value.endswith('ies'):
        return value[:-3] + 'y'
    if value.endswith('s') and not value.endswith('ss'):
        return value[:-1]
    return value


recommendation_index: dict[str, list] = {
    normalize_key(key): value
    for key, value in rekomendasi_model.items()
}


def resolve_recommendations(item_name: str) -> list:
    normalized = normalize_key(item_name)
    recommendations = recommendation_index.get(normalized)
    if recommendations is not None:
        return recommendations

    singular = normalize_key(singularize(item_name))
    if singular != normalized:
        return recommendation_index.get(singular, [])

    return []


class CartRequest(BaseModel):
    items: list[str]
    top_k: int = 9

@app.post("/recommend")
def get_recommendations(request: CartRequest):
    cart_items = [item.strip() for item in request.items if item and item.strip()]

    if not cart_items:
        return {"recommendations": []}
    
    def normalize_recommendation(entry: Any) -> tuple[str, float] | None:
        if isinstance(entry, str):
            return entry.strip(), 1.0
        if isinstance(entry, dict):
            item_id = entry.get("id") or entry.get("item") or entry.get("name")
            score = entry.get("score", 1.0)
            if isinstance(item_id, str):
                try:
                    return item_id.strip(), float(score)
                except (TypeError, ValueError):
                    return item_id.strip(), 1.0
        return None

    score_map: dict[str, float] = {}

    for item in cart_items:
        recommendations = resolve_recommendations(item)
        for entry in recommendations:
            normalized = normalize_recommendation(entry)
            if not normalized:
                continue
            rec_id, rec_score = normalized
            if rec_id in cart_items:
                continue
            score_map[rec_id] = score_map.get(rec_id, 0.0) + rec_score

    sorted_recommendations = sorted(
        score_map.items(),
        key=lambda pair: (-pair[1], pair[0])
    )

    final_recommendations = [
        {"id": rec_id, "score": score}
        for rec_id, score in sorted_recommendations[:request.top_k]
    ]

    return {
        "cart": cart_items,
        "recommendations": final_recommendations
    }