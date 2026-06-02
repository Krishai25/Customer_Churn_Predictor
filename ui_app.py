import streamlit as st
import pickle
import numpy as np

st.set_page_config(page_title="Customer Churn Predictor", page_icon="📊")

with open('churn_predictor_model.pkl', 'rb') as f:
    model = pickle.load(f)

st.title("📊 Customer Churn Predictor")
st.write("Enter the customer details below to predict whether they will **Churn** or **Stay**.")

st.subheader("Customer Details")

tenure = st.slider("Tenure (Months)", min_value=1, max_value=72, value=12)
monthly_charges = st.slider("Monthly Charges (₹)", min_value=20, max_value=120, value=65)
num_complaints = st.slider("Number of Complaints", min_value=0, max_value=7, value=1)
plan_type = st.selectbox("Plan Type", options=["Basic", "Standard", "Premium"])

plan_map = {"Basic": 0, "Standard": 1, "Premium": 2}
plan_encoded = plan_map[plan_type]

if st.button("Predict"):

    input_data = np.array([[tenure, monthly_charges, num_complaints, plan_encoded]])

    prediction = model.predict(input_data)[0]
    confidence = model.predict_proba(input_data)[0]

    st.subheader("Prediction Result")

    if prediction == 1:
        churn_confidence = confidence[1] * 100
        st.error(f"⚠️ This customer is likely to CHURN with {churn_confidence:.1f}% confidence.")
    else:
        stay_confidence = confidence[0] * 100
        st.success(f"✅ This customer is likely to STAY with {stay_confidence:.1f}% confidence.")

    st.write("---")
    st.write("**Input Summary:**")
    st.write(f"- Tenure: {tenure} months")
    st.write(f"- Monthly Charges: ₹{monthly_charges}")
    st.write(f"- Number of Complaints: {num_complaints}")
    st.write(f"- Plan Type: {plan_type}")