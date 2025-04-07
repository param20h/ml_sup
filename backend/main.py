# 📦 Imports
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score, roc_curve
from sklearn.model_selection import train_test_split

# 📁 Load datasets
train_df = pd.read_csv('train_dataset.csv', on_bad_lines='skip')
test_df = pd.read_csv('test_dataset.csv', on_bad_lines='skip')

# 🧼 Clean missing values (fill numeric with median)
train_df.fillna(train_df.median(numeric_only=True), inplace=True)
test_df.fillna(test_df.median(numeric_only=True), inplace=True)

# Combine both for consistent label encoding
combined_df = pd.concat([train_df, test_df], axis=0)

# Encode categorical features on combined data
label_enc = LabelEncoder()
for col in ['source', 'tld']:
    combined_df[col] = label_enc.fit_transform(combined_df[col].astype(str))

# Split them back
train_df = combined_df.iloc[:len(train_df)].copy()
test_df = combined_df.iloc[len(train_df):].copy()


# 🚫 Drop non-useful columns
train_df.drop(['url'], axis=1, inplace=True)
test_df.drop(['url'], axis=1, inplace=True)

# 📊 Features & Labels
X_train = train_df.drop('label', axis=1)
y_train = train_df['label']
X_test = test_df.drop('label', axis=1)
y_test = test_df['label']

# 📈 DMatrix for XGBoost
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# 🔧 XGBoost parameters
params = {
    'objective': 'binary:logistic',
    'eval_metric': 'logloss',
    'max_depth': 4,
    'learning_rate': 0.05,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'seed': 42
}

# 🚀 Train model
xgb_model = xgb.train(params, dtrain, num_boost_round=100)

# 🎯 Predictions
y_pred_prob = xgb_model.predict(dtest)
y_pred = (y_pred_prob > 0.5).astype(int)

# 📋 Evaluation
print("✅ Accuracy:", accuracy_score(y_test, y_pred))
print("✅ ROC-AUC:", roc_auc_score(y_test, y_pred_prob))
print("✅ Classification Report:\n", classification_report(y_test, y_pred))

# --------------------------------------------
# 📊 Visualizations on 5% sample data
# --------------------------------------------

# Take 5% sample from training data
sample_df = train_df.sample(frac=0.05, random_state=42)

# 🎨 Correlation heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(sample_df.corr(numeric_only=True), cmap='coolwarm', vmax=1.0, vmin=-1.0)
plt.title("Correlation Heatmap (5% Sample)")
plt.show()

# 🎯 Class-wise URL length distribution
plt.figure(figsize=(10, 5))
sns.histplot(data=sample_df, x='url_len', hue='label', kde=True, bins=50)
plt.title("URL Length Distribution (Malicious vs Benign)")
plt.xlabel("URL Length")
plt.ylabel("Frequency")
plt.show()

# 📊 Feature importance (plot top 20)
xgb.plot_importance(xgb_model, max_num_features=20, importance_type='gain', height=0.5)
plt.title("Top 20 Feature Importances")
plt.show()

# 🚀 ROC Curve
fpr, tpr, _ = roc_curve(y_test, y_pred_prob)
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f"ROC Curve (AUC = {roc_auc_score(y_test, y_pred_prob):.2f})")
plt.plot([0, 1], [0, 1], linestyle="--")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve")
plt.legend()
plt.grid(True)
plt.show()