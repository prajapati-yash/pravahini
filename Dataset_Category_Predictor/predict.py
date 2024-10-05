import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack

# Load the trained model and necessary transformers
rf_model = joblib.load('rf_model.joblib')
tfidf_desc = joblib.load('tfidf_desc.joblib')
tfidf_cols = joblib.load('tfidf_cols.joblib')
le = joblib.load('label_encoder.joblib')

# Function to prepare a single dataset for prediction
def prepare_dataset(num_columns, columns, file_size_mb, description):
    X = pd.DataFrame({
        'num_columns': [num_columns],
        'columns': [columns],
        'file_size_mb': [file_size_mb],
        'description': [description]
    })
    
    X_desc = tfidf_desc.transform(X['description'])
    X_cols = tfidf_cols.transform(X['columns'])
    
    X_combined = hstack([
        X[['num_columns', 'file_size_mb']].values,
        X_desc,
        X_cols
    ])
    
    return X_combined

# Example usage
num_columns = 100
columns = "id, date, value, experiment_id, voltage, current, resistance, frequency, wavelength"
file_size_mb = 5.2
description = "THis is science and tech dataset"

X_new = prepare_dataset(num_columns, columns, file_size_mb, description )
prediction = rf_model.predict(X_new)
predicted_category = le.inverse_transform(prediction)[0]

print(f"Predicted category: {predicted_category}")