import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib

# ----------------------------
# 1️⃣ Load CSV
# ----------------------------
csv_file = "backend_data_large1.csv"  # new large dataset
df = pd.read_csv(csv_file)

print("Dataset loaded. First 5 rows:")
print(df.head())
print("\nData types:")
print(df.info())

# ----------------------------
# 2️⃣ Encode categorical columns
# ----------------------------
categorical_cols = ["job_type", "priority_level", "backend_name", "processor_desc", "status"]
encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col + "_enc"] = le.fit_transform(df[col])
    encoders[col] = le

print("\nCategorical columns encoded.")

# ----------------------------
# 3️⃣ Define features and target
# ----------------------------
feature_cols = [
    "circuit_depth", "gate_count", "error_tolerance", "max_wait_time",
    "queue", "success_rate", "wait_time", "avg_error", "avg_noise",
    "ai_confidence",
    "job_type_enc", "priority_level_enc", "backend_name_enc", "processor_desc_enc"
]

X = df[feature_cols]
y = df["suitability"]

# Split data into train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ----------------------------
# 4️⃣ Train RandomForest model
# ----------------------------
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# ----------------------------
# 5️⃣ Evaluate model
# ----------------------------
y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
print(f"\nModel trained. R² score on test set: {r2:.3f}")

# ----------------------------
# 6️⃣ Save model and encoders
# ----------------------------
joblib.dump(model, "backend_recommender.pkl")
joblib.dump(encoders, "encoders.pkl")

print("\n✅ Model saved as 'backend_recommender.pkl'")
print("✅ Encoders saved as 'encoders.pkl'")
