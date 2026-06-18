# Telco Customer Churn Predictor

A Full-Stack AI-powered web application that predicts whether a telecom customer is likely to churn, compares predictions from two ML models, and generates personalized retention recommendations using a Large Language Model.

---

## Project Overview

This project uses real-world IBM Telco customer data to predict churn risk. It runs two machine learning models — Random Forest and SVM — simultaneously and averages their outputs to determine the customer's risk level (Low, Medium, or High). Based on the risk level and customer profile, the Groq API with LLaMA 3.1 generates a specific, actionable retention recommendation for that customer.

The application has a React frontend connected to a Flask REST API backend.

---

## Project Structure

```
Telco-Customer-Churn-Predictor/
│
├── train_telco_models.py          # Trains Random Forest and SVM models and saves them
├── api.py                         # Flask REST API backend with /predict endpoint
├── WA_Fn-UseC_-Telco-Customer-Churn.csv   # IBM Telco dataset (real-world data)
├── rf_model_telco.pkl             # Saved Random Forest model (created after training)
├── svm_model_telco.pkl            # Saved SVM model (created after training)
├── scaler.pkl                     # Saved StandardScaler (created after training)
├── feature_columns.pkl            # Saved feature columns list (created after training)
└── frontend/                      # React frontend application
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Machine Learning | Scikit-learn (Random Forest, SVM) |
| Data Processing | Pandas, NumPy |
| Backend API | Flask, Flask-CORS |
| AI Recommendations | Groq API, LLaMA 3.1-8b-instant |
| Frontend | React |
| Dataset | IBM Telco Customer Churn (Kaggle) |
| Model Persistence | Pickle |

---

## Required Packages

Install the following Python packages:

```
pip install flask
pip install flask-cors
pip install pandas
pip install numpy
pip install scikit-learn
pip install groq
pip install pickle
```

---

## How to Run the Project

Follow these steps in order. Do not skip steps.

**Step 1 — Train the models**

Run this file first. It reads the IBM Telco CSV, preprocesses the data, trains both models, and saves all model files.

```
python train_telco_models.py
```

Expected output:
```
Loading data...
Preprocessing data...
Training Random Forest model...
Random Forest Accuracy: ~80%
Training SVM model...
SVM Accuracy: ~80%
Models and preprocessors saved successfully!
```

After this step, four files will be created:
- `rf_model_telco.pkl`
- `svm_model_telco.pkl`
- `scaler.pkl`
- `feature_columns.pkl`

**Step 2 — Start the Flask API**

```
python api.py
```

Expected output:
```
Loading models and assets...
Assets loaded successfully!
Running on http://127.0.0.1:5000
```

**Step 3 — Start the React Frontend**

Navigate to the frontend folder and run:

```
npm install
npm start
```

The app will open in your browser at:
```
http://localhost:3000
```

---

## How the App Works

1. Open the React frontend in your browser
2. Enter the customer details in the form
3. Click the Predict button
4. The app sends the data to the Flask `/predict` endpoint
5. The backend runs both Random Forest and SVM models simultaneously
6. The average churn probability is calculated and a risk level is assigned
7. The Groq API with LLaMA 3.1 generates a personalized retention recommendation
8. Results are displayed on the frontend showing both model predictions and the AI recommendation

---

## API Endpoint

**POST** `/predict`

**Request Body (JSON):**
```json
{
  "gender": "Male",
  "SeniorCitizen": 0,
  "Partner": "Yes",
  "Dependents": "No",
  "tenure": 12,
  "PhoneService": "Yes",
  "MultipleLines": "No",
  "InternetService": "Fiber optic",
  "OnlineSecurity": "No",
  "OnlineBackup": "Yes",
  "DeviceProtection": "No",
  "TechSupport": "No",
  "StreamingTV": "Yes",
  "StreamingMovies": "Yes",
  "Contract": "Month-to-month",
  "PaperlessBilling": "Yes",
  "PaymentMethod": "Electronic check",
  "MonthlyCharges": 70.35,
  "TotalCharges": 844.2
}
```

**Response (JSON):**
```json
{
  "rf_prediction": 1,
  "rf_probability": 0.78,
  "svm_prediction": 1,
  "svm_probability": 0.72,
  "recommendation": "This customer is at high risk of churning. Consider offering a discounted 1-year contract with added streaming benefits to increase their commitment. A proactive call from the retention team within 48 hours is strongly recommended.",
  "status": "success"
}
```

---

## Risk Level Logic

| Average Churn Probability | Risk Level |
|---|---|
| Above 70% | High |
| 40% to 70% | Medium |
| Below 40% | Low |

---

## Dataset

- **Source:** IBM Telco Customer Churn Dataset (available on Kaggle)
- **Size:** 7,043 customer records
- **Features:** 21 columns including customer demographics, account information, and subscribed services
- **Target:** Churn — Yes or No

---

## ML Pipeline Summary

```
IBM Telco CSV
      |
Data Preprocessing
(Drop customerID, fix TotalCharges, encode categoricals)
      |
Train-Test Split (80/20)
      |
StandardScaler
      |
   ┌──────────────────────┐
   │                      │
Random Forest          SVM (Linear Kernel)
(100 estimators)       (probability=True)
   │                      │
rf_probability        svm_probability
   │                      │
   └──────────┬───────────┘
              │
       Average Probability
              │
         Risk Level
              │
     Groq API + LLaMA 3.1
              │
   Retention Recommendation
```

---

## Important Notes

- Always run `train_telco_models.py` before starting `api.py`
- The Flask API runs on port **5000** and the React frontend on port **3000**
- Make sure your Groq API key is valid and active
- The four `.pkl` files must be in the same directory as `api.py`
- CORS is enabled on the Flask backend to allow React frontend communication

---

## Future Improvements

- Add SHAP explainability to show which features drive the churn prediction
- Deploy the Flask backend on a cloud platform (AWS / Render / Railway)
- Add a customer database to track churn predictions over time
- Include XGBoost as a third model for further comparison
