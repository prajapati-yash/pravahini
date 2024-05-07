import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS

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

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
