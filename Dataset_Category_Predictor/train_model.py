import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from scipy.sparse import hstack
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Load the data
train_df = pd.read_csv('train_dataset.csv')
test_df = pd.read_csv('test_dataset.csv')

# Prepare features
features = ['num_columns', 'columns', 'file_size_mb', 'description']
X_train = train_df[features]
X_test = test_df[features]

# Prepare target
le = LabelEncoder()
y_train = le.fit_transform(train_df['category'])
y_test = le.transform(test_df['category'])

# Convert 'description' and 'columns' to TF-IDF features
tfidf_desc = TfidfVectorizer(max_features=1000)
X_train_desc = tfidf_desc.fit_transform(X_train['description'])
X_test_desc = tfidf_desc.transform(X_test['description'])

tfidf_cols = TfidfVectorizer(max_features=500)
X_train_cols = tfidf_cols.fit_transform(X_train['columns'])
X_test_cols = tfidf_cols.transform(X_test['columns'])

# Combine numerical features with TF-IDF features
X_train_combined = hstack([
    X_train[['num_columns', 'file_size_mb']].values,
    X_train_desc,
    X_train_cols
])

X_test_combined = hstack([
    X_test[['num_columns', 'file_size_mb']].values,
    X_test_desc,
    X_test_cols
])

# Train a Random Forest Classifier
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_combined, y_train)

# Make predictions
y_pred = rf_model.predict(X_test_combined)

# Evaluate the model
print(classification_report(y_test, y_pred, target_names=le.classes_))

import joblib

joblib.dump(rf_model, 'rf_model.joblib')
joblib.dump(tfidf_desc, 'tfidf_desc.joblib')
joblib.dump(tfidf_cols, 'tfidf_cols.joblib')
joblib.dump(le, 'label_encoder.joblib')