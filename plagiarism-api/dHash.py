import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

def difference_hash(input_data):
    """
    Computes the difference hash (dHash) for the given input data.
    
    Args:
        input_data (str): The input data as a string.
        
    Returns:
        str: The difference hash value as a hexadecimal string.
    """

    # Split the input data into lines
    lines = input_data.splitlines()

    # Split the lines into columns
    columns = [line.split(',') for line in lines]

    # Create a DataFrame from the columns
    df = pd.DataFrame(columns)

    # Convert string columns to numeric using LabelEncoder
    for col in df.select_dtypes(include=['object']).columns:
        encoder = LabelEncoder()
        df[col] = encoder.fit_transform(df[col])

    # Convert the Pandas DataFrame to a NumPy array
    input_data = df.values

    # Compute the difference between adjacent rows
    differences = np.diff(input_data, axis=0)
    
    # Compute the hash by comparing each difference to zero and making the 1D array
    hash_bits = [1 if diff >= 0 else 0 for diff in differences.flatten()]

    # Convert the hash bits to a hexadecimal string
    hash_value = hex(int(''.join(str(bit) for bit in hash_bits), 2))[2:][:128]
    
    return hash_value

def hamming_distance(hash1, hash2):
    """
    Computes the Hamming distance between two hash values.
    
    Args:
        hash1 (str): The first hash value as a hexadecimal string.
        hash2 (str): The second hash value as a hexadecimal string.
        
    Returns:
        float: The normalized Hamming distance between the two hash values (between 0 and 1).
    """
    # Convert hash strings to integers
    print(hash1, hash2)
    int_hash1 = int(hash1, 16)
    int_hash2 = int(hash2, 16)
    
    # Compute the XOR of the integers
    xor_value = int_hash1 ^ int_hash2
    
    # Count the number of set bits in the XOR value (Hamming distance)
    hamming_dist = bin(xor_value).count('1')
    
    # Calculate the maximum possible Hamming distance
    max_hamming_dist = max(bin(int_hash1).count('1'), bin(int_hash2).count('1'))
    
    # Normalize the Hamming distance to a value between 0 and 1
    normalized_hamming_dist = hamming_dist / max_hamming_dist
    
    return normalized_hamming_dist

# Read datasets from files
def read_file(file_path):
    with open(file_path, 'r') as file:
        text = file.read()
    return text

def count_rows(file_path):
    """
    Counts the number of rows in the given file.
    
    Args:
        file_path (str): The path to the file.
        
    Returns:
        int: The number of rows in the file.
    """
    with open(file_path, 'r') as file:
        row_count = len(file.readlines())
    return row_count