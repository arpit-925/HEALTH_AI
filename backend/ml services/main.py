from pyexpat import features

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os

app = FastAPI()

# Absolute path setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# Load models
diabetes_model = joblib.load(os.path.join(MODEL_DIR, "diabetes.pkl"))
heart_model = joblib.load(os.path.join(MODEL_DIR, "heart.pkl"))
# pcos_model = joblib.load(os.path.join(MODEL_DIR, "pcos.pkl"))
# kidney_model = joblib.load(os.path.join(MODEL_DIR, "kidney.pkl"))

print("Expected number of features:", diabetes_model.n_features_in_)




from pydantic import BaseModel

class DiabetesInput(BaseModel):
    age: float
    hypertension: int
    heart_disease: int
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float

    gender_Male: int
    gender_Other: int

    smoking_history_current: int
    smoking_history_ever: int
    smoking_history_never: int
    smoking_history_not_current: int

    is_smoker_Smoker: int



class HeartInput(BaseModel):
    Age: int
    Sex: int
    ChestPainType: int
    RestingBP: int
    Cholesterol: int
    FastingBS: int
    RestingECG: int
    MaxHR: int
    ExerciseAngina: int
    Oldpeak: float
    ST_Slope: int

# print(pcos_model.n_features_in_)

@app.get("/")
def home():
    return {"message": "ML Service Running"}


@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):

    features = [[
        data.age,
        data.hypertension,
        data.heart_disease,
        data.bmi,
        data.HbA1c_level,
        data.blood_glucose_level,
        data.gender_Male,
        data.gender_Other,
        data.smoking_history_current,
        data.smoking_history_ever,
        data.smoking_history_never,
        data.smoking_history_not_current,
        data.is_smoker_Smoker
    ]]

    expected = diabetes_model.n_features_in_
    received = len(features[0])

    if received != expected:
        return {
            "error": "Feature count mismatch",
            "expected_features": expected,
            "received_features": received
        }

    prediction = diabetes_model.predict(features)
    probability = diabetes_model.predict_proba(features)[0][1]

    return {
        "prediction": int(prediction[0]),
        "risk_probability": round(float(probability), 3)
    }


@app.post("/predict/heart")
def predict_heart(data: HeartInput):

    prediction = heart_model.predict([[
        data.Age,
        data.Sex,
        data.ChestPainType,
        data.RestingBP,
        data.Cholesterol,
        data.FastingBS,
        data.RestingECG,
        data.MaxHR,
        data.ExerciseAngina,
        data.Oldpeak,
        data.ST_Slope
    ]])

    return {"prediction": int(prediction[0])}


# @app.post("/predict/pcos")
# def predict_pcos(data: InputData):
#     prediction = pcos_model.predict([[data.age, data.bmi, data.glucose]])
#     return {"prediction": int(prediction[0])}


# @app.post("/predict/kidney")
# def predict_kidney(data: InputData):
#     prediction = kidney_model.predict([[data.age, data.bmi, data.glucose]])
#     return {"prediction": int(prediction[0])}