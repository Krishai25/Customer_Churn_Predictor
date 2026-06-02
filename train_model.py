import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

df = pd.read_csv('churn_data.csv')

X = df[['tenure','monthly_charges','num_complaints','plan_type']]
Y = df['churn']

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size = 0.3, random_state = 42)

model = RandomForestClassifier(n_estimators = 100, random_state = 42)
model.fit(X_train, Y_train)

Y_pred = model.predict(X_test)
accuracy = accuracy_score(Y_test, Y_pred)

print(f"Model Accuracy: {accuracy * 100:.2f}%")

with open('churn_predictor_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Model saved as churn_predictor_model.pkl")