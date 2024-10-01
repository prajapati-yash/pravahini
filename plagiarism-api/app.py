import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack
import io
# Import your existing functions
from dHash import difference_hash, hamming_distance

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return 'Home'

@app.route('/compare-hash', methods=['POST'])
def compare_hash():
    try:
        # Get the file from the request
        file = request.files['file']

        # Read the file content
        file_content = file.read().decode('utf-8')

        # Generate the hash using difference_hash
        file_hash = difference_hash(file_content)
        # print(file_hash)

        # Get the static hash(es) from the request data
        static_hashes = request.form.getlist('static_hashes')
        # print(static_hashes)

        # Calculate the combined similarity for each static hash
        results = []
        for static_hash in static_hashes:
            hamming_dist = hamming_distance(file_hash, static_hash)
            # print(hamming_dist)

            result = {
                'file_hash': file_hash,
                'hamming_distance': hamming_dist
            }
            results.append(result)

        # Return the results as JSON
        return jsonify(results)

    except Exception as e:
        # Log the error
        print(f"Error: {e}")
        print(traceback.format_exc())

        # Return an error response
        return jsonify({"error": str(e)}), 500


# New route for dataset category prediction
@app.route('/predict-category', methods=['POST'])
def predict_category():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        if 'description' not in request.form:
            return jsonify({'error': 'Description is required'}), 400

        # Extract the file and description from the request
        file = request.files['file']
        description = request.form['description']  # Passed from frontend

        filename = file.filename
        file_extension = filename.split('.')[-1].lower()

        # Handle different file types
        if file_extension == 'csv':
            df = pd.read_csv(file)
        elif file_extension == 'json':
            df = pd.read_json(file)
        elif file_extension == 'xlsx':
            df = pd.read_excel(file)
        else:
            return jsonify({'error': 'Unsupported file format. Please upload CSV, JSON, or XLSX files.'}), 400

        # Calculate file information
        num_columns = df.shape[1]
        columns = ', '.join(df.columns)
        file_size_mb = file.content_length / (1024 * 1024)

        # Prepare data for prediction
        X = pd.DataFrame({
            'num_columns': [num_columns],
            'columns': [columns],
            'file_size_mb': [file_size_mb],
            'description': [description]
        })

        # Load the necessary models and transformers
        rf_model = joblib.load('rf_model.joblib')
        tfidf_desc = joblib.load('tfidf_desc.joblib')
        tfidf_cols = joblib.load('tfidf_cols.joblib')
        le = joblib.load('label_encoder.joblib')

        # Apply the transformations
        X_desc = tfidf_desc.transform(X['description'])
        X_cols = tfidf_cols.transform(X['columns'])

        X_combined = hstack([X[['num_columns', 'file_size_mb']].values, X_desc, X_cols])

        # Make the prediction
        prediction = rf_model.predict(X_combined)
        predicted_category = le.inverse_transform(prediction)[0]
        print(f'predicted category', predicted_category)
        return jsonify({'predicted_category': predicted_category})

    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
