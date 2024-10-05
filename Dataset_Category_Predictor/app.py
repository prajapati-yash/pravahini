from flask import Flask, request, jsonify
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack

app = Flask(__name__)

# Load the trained model and necessary transformers
rf_model = joblib.load('rf_model.joblib')
tfidf_desc = joblib.load('tfidf_desc.joblib')
tfidf_cols = joblib.load('tfidf_cols.joblib')
le = joblib.load('label_encoder.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # Prepare the input data
    X = pd.DataFrame({
        'num_columns': [data['num_columns']],
        'columns': [data['columns']],
        'file_size_mb': [data['file_size_mb']],
        'description': [data['description']]
    })
    
    X_desc = tfidf_desc.transform(X['description'])
    X_cols = tfidf_cols.transform(X['columns'])
    
    X_combined = hstack([
        X[['num_columns', 'file_size_mb']].values,
        X_desc,
        X_cols
    ])
    
    # Make prediction
    prediction = rf_model.predict(X_combined)
    predicted_category = le.inverse_transform(prediction)[0]
    
    return jsonify({'predicted_category': predicted_category})

if __name__ == '__main__':
    app.run(debug=True)