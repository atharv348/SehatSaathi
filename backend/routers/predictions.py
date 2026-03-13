from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
import torch
from PIL import Image
import io
import os
import uuid
from datetime import datetime, timezone

from database import get_db, User, Prediction
from .users import get_current_user
from pydantic import BaseModel
import sys
from services.groq_service import generate_ai_content
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.image_preprocessor import preprocess_for_diagnosis

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

# Schemas
class PredictionResponse(BaseModel):
    id: int
    user_id: int
    body_part: str
    predicted_class: str
    predicted_name: str
    confidence: float
    priority: str
    image_path: str
    status: str
    ai_advice: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Mock Model Path (since the actual .pth file was deleted, we'll simulate or use a dummy)
MODEL_PATH = "models/skin_lesion_model.pth"

# Body part class names and risk levels
BODY_PART_DISEASES = {
    'skin': {
        'akiec': 'Actinic Keratoses',
        'bcc': 'Basal Cell Carcinoma',
        'bkl': 'Benign Keratosis',
        'df': 'Dermatofibroma',
        'mel': 'Melanoma',
        'nv': 'Melanocytic Nevi',
        'vasc': 'Vascular Lesions',
        'eczema': 'Eczema',
        'psoriasis': 'Psoriasis',
        'rosacea': 'Rosacea',
        'acne': 'Acne Vulgaris'
    },
    'eye': {
        'cataract': 'Cataract',
        'diabetic_retinopathy': 'Diabetic Retinopathy',
        'glaucoma': 'Glaucoma',
        'macular_degeneration': 'Age-Related Macular Degeneration',
        'conjunctivitis': 'Conjunctivitis',
        'normal': 'Normal Eye'
    },
    'oral': {
        'caries': 'Dental Caries',
        'gingivitis': 'Gingivitis',
        'ulcer': 'Oral Ulcer',
        'leukoplakia': 'Leukoplakia',
        'normal': 'Normal Oral Cavity'
    },
    'bone': {
        'fracture': 'Bone Fracture',
        'osteoporosis': 'Osteoporosis',
        'arthritis': 'Arthritis',
        'osteosarcoma': 'Osteosarcoma',
        'normal': 'Normal Bone Structure'
    },
    'lungs': {
        'pneumonia': 'Pneumonia (Bacterial/Viral)',
        'tuberculosis': 'Tuberculosis',
        'covid19': 'COVID-19 Chest Manifestation',
        'lung_cancer': 'Lung Cancer (Malignant Node)',
        'normal': 'Normal Lung X-ray',
        'pleural_effusion': 'Pleural Effusion',
        'atelectasis': 'Atelectasis',
        'pneumothorax': 'Pneumothorax'
    }
}

RISK_LEVELS = {
    'skin': {
        'critical': ['mel'],
        'high': ['bcc', 'akiec'],
        'medium': ['df', 'psoriasis', 'eczema'],
        'low': ['nv', 'bkl', 'vasc', 'rosacea', 'acne']
    },
    'eye': {
        'critical': ['glaucoma', 'diabetic_retinopathy'],
        'high': ['macular_degeneration'],
        'medium': ['cataract'],
        'low': ['conjunctivitis', 'normal']
    },
    'oral': {
        'critical': ['leukoplakia'],
        'high': ['ulcer'],
        'medium': ['caries', 'gingivitis'],
        'low': ['normal']
    },
    'bone': {
        'critical': ['osteosarcoma'],
        'high': ['fracture'],
        'medium': ['arthritis', 'osteoporosis'],
        'low': ['normal']
    },
    'lungs': {
        'critical': ['lung_cancer', 'pneumothorax'],
        'high': ['pneumonia', 'tuberculosis', 'covid19', 'pleural_effusion'],
        'medium': ['atelectasis'],
        'low': ['normal']
    }
}

@router.post("/predict", response_model=PredictionResponse)
async def predict(
    body_part: str = "skin",
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Perform AI diagnosis on uploaded medical image
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Process image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert('RGB')
    
    # Preprocess image using OpenCV (Functional Requirement 3)
    try:
        input_tensor = preprocess_for_diagnosis(image)
        # In a production environment, input_tensor would be passed to the model
    except Exception as e:
        print(f"Preprocessing error: {e}")
    
    # In a real scenario, we'd load the specific model for the body_part
    # For now, we simulate the output based on body_part
    
    import random
    disease_map = BODY_PART_DISEASES.get(body_part, BODY_PART_DISEASES['skin'])
    classes = list(disease_map.keys())
    predicted_class = random.choice(classes)
    predicted_name = disease_map[predicted_class]
    confidence = random.uniform(0.75, 0.98)
    
    # Determine risk/priority
    risk_config = RISK_LEVELS.get(body_part, RISK_LEVELS['skin'])
    if predicted_class in risk_config.get('critical', []):
        priority = "critical"
    elif predicted_class in risk_config.get('high', []):
        priority = "high"
    elif predicted_class in risk_config.get('medium', []):
        priority = "medium"
    else:
        priority = "low"
        
    # Generate AI Advice (Functional Requirement 6)
    ai_advice = None
    try:
        advice_prompt = f"The AI has diagnosed a potential case of {predicted_name} on the {body_part} with {confidence*100:.1f}% confidence and {priority} risk level. Provide immediate, professional, and empathetic medical guidance and next steps for the user. Remind them to consult a specialist."
        ai_advice = generate_ai_content(advice_prompt)
    except Exception as e:
        print(f"AI Advice generation failed: {e}")
        ai_advice = "AI guidance is temporarily unavailable. Please consult a medical professional for advice."
    
    # Save image
    upload_dir = "uploads/predictions"
    os.makedirs(upload_dir, exist_ok=True)
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(upload_dir, file_name)
    
    with open(file_path, "wb") as f:
        f.write(contents)
        
    # Save to DB
    db_prediction = Prediction(
        user_id=current_user.id,
        body_part=body_part,
        predicted_class=predicted_class,
        predicted_name=predicted_name,
        confidence=confidence,
        priority=priority,
        image_path=file_path,
        status="pending",
        ai_advice=ai_advice
    )
    
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    return db_prediction

@router.get("/", response_model=List[PredictionResponse])
def get_predictions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get scan history for user"""
    return db.query(Prediction).filter(Prediction.user_id == current_user.id).order_by(Prediction.created_at.desc()).all()
