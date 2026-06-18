import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import pickle

def train_and_save_models():
    print("Loading data...")
    df = pd.read_csv('WA_Fn-UseC_-Telco-Customer-Churn.csv')

    # Data Preprocessing
    print("Preprocessing data...")
    # Drop customerID as it's not useful for prediction
    if 'customerID' in df.columns:
        df = df.drop('customerID', axis=1)

    # TotalCharges is object type because of blank spaces. Convert to numeric.
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    # Fill NaN values with 0 (usually these are new customers with 0 tenure)
    df['TotalCharges'] = df['TotalCharges'].fillna(0)

    # Separate features and target
    X = df.drop('Churn', axis=1)
    y = df['Churn'].map({'Yes': 1, 'No': 0})

    # One-hot encode categorical variables
    X = pd.get_dummies(X, drop_first=True)

    # Save the feature columns so the UI knows exactly what inputs are expected
    feature_columns = X.columns.tolist()
    with open('feature_columns.pkl', 'wb') as f:
        pickle.dump(feature_columns, f)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Scale the features (Important for SVM)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Save the scaler for use in the UI
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)

    # 1. Train Random Forest
    print("Training Random Forest model...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train_scaled, y_train)
    rf_pred = rf_model.predict(X_test_scaled)
    rf_accuracy = accuracy_score(y_test, rf_pred)
    print(f"Random Forest Accuracy: {rf_accuracy * 100:.2f}%")

    # Save Random Forest Model
    with open('rf_model_telco.pkl', 'wb') as f:
        pickle.dump(rf_model, f)

    # 2. Train SVM Model
    # probability=True is needed so we can get churn probability scores in the UI
    print("Training SVM model...")
    svm_model = SVC(kernel='linear', probability=True, random_state=42)
    svm_model.fit(X_train_scaled, y_train)
    svm_pred = svm_model.predict(X_test_scaled)
    svm_accuracy = accuracy_score(y_test, svm_pred)
    print(f"SVM Accuracy: {svm_accuracy * 100:.2f}%")

    # Save SVM Model
    with open('svm_model_telco.pkl', 'wb') as f:
        pickle.dump(svm_model, f)

    print("Models and preprocessors saved successfully!")

if __name__ == "__main__":
    train_and_save_models()
