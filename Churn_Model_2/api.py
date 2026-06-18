from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
from groq import Groq

app = Flask(__name__)
CORS(app)

print("Loading models and assets...")
try:
    with open('rf_model_telco.pkl', 'rb') as f:
        rf_model = pickle.load(f)
    with open('svm_model_telco.pkl', 'rb') as f:
        svm_model = pickle.load(f)
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    with open('feature_columns.pkl', 'rb') as f:
        feature_columns = pickle.load(f)
    print("Assets loaded successfully!")
except Exception as e:
    print(f"Error loading assets: {e}")

groq_client = Groq(api_key="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")

def get_retention_recommendation(customer_data, rf_prob, svm_prob):
    avg_prob = (rf_prob + svm_prob) / 2
    risk_level = "High" if avg_prob > 0.7 else "Medium" if avg_prob > 0.4 else "Low"
    
    prompt = f"""You are a telecom customer retention specialist.
A customer has been flagged with a {risk_level} churn risk ({avg_prob*100:.1f}% average probability).

Customer Profile:
{customer_data}

Give a specific, actionable retention recommendation in 2-3 sentences.
Focus on what offer or action would most likely retain this specific customer based on their profile.
Be direct and practical. Do not use bullet points."""

    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
        max_tokens=200,
        temperature=0.7
    )
    return chat_completion.choices[0].message.content

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # We no longer need model_type from the request, we run both.
        data.pop('model_type', None)
        
        input_df = pd.DataFrame([data])
        input_encoded = pd.get_dummies(input_df)
        
        for col in feature_columns:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
                
        input_encoded = input_encoded[feature_columns]
        input_scaled = scaler.transform(input_encoded)
        
        # Random Forest Prediction
        rf_pred = int(rf_model.predict(input_scaled)[0])
        rf_prob = float(rf_model.predict_proba(input_scaled)[0][1])
        
        # SVM Prediction
        svm_pred = int(svm_model.predict(input_scaled)[0])
        svm_prob = float(svm_model.predict_proba(input_scaled)[0][1])
        
        recommendation = get_retention_recommendation(data, rf_prob, svm_prob)
        
        return jsonify({
            'rf_prediction': rf_pred,
            'rf_probability': rf_prob,
            'svm_prediction': svm_pred,
            'svm_probability': svm_prob,
            'recommendation': recommendation,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
