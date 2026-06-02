import numpy as np
import pandas as pd
import random

np.random.seed(42)
random.seed(42)

n=1000

tenure = np.random.randint(1,72,n)
monthly_charges=np.random.uniform(20,120,n).round(2)
num_complaints = np.random.randint(0,8,n)
plan_type = [random.choice([0,1,2]) for _ in range(n)]

churn = []

for i in range(n):
    score = 0
    if tenure[i] < 12:
        score += 2
    if monthly_charges[i] > 70:
        score += 1
    if num_complaints[i] > 1 :
        score += 2

    if score >= 3:
        churn.append(random.choices([1, 0], weights=[85, 15])[0])
    else:
        churn.append(random.choices([0, 1], weights=[85, 15])[0])

df = pd.DataFrame(
    {
        'tenure': tenure,
        'monthly_charges': monthly_charges,
        'num_complaints': num_complaints,
        'plan_type': plan_type,
        'churn': churn
    }
)

df.to_csv('churn_data.csv', index=False)
print(f"Dataset created with {len(df)}")
print(df['churn'].value_counts())
