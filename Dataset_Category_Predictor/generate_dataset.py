import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

def generate_column_names(category):
    common_columns = ['id', 'date', 'value']
    
    if category == 'education':
        return common_columns + ['student_id', 'grade', 'subject', 'score', 'attendance', 'teacher_id']
    elif category == 'medicines':
        return common_columns + ['patient_id', 'drug_name', 'dosage', 'side_effects', 'efficacy', 'treatment_duration']
    elif category == 'earth & nature':
        return common_columns + ['latitude', 'longitude', 'temperature', 'humidity', 'species', 'habitat_type']
    elif category == 'science & tech':
        return common_columns + ['experiment_id', 'voltage', 'current', 'resistance', 'frequency', 'wavelength']
    else:
        return common_columns

def generate_synthetic_dataset(num_samples=1000):
    categories = ['education', 'medicines', 'earth & nature', 'science & tech']
    
    data = []
    for _ in range(num_samples):
        category = np.random.choice(categories)
        
        columns = generate_column_names(category)
        num_columns = len(columns)
        
        # Generate synthetic features
        if category == 'education':
            num_students = np.random.randint(10, 1000)
            avg_score = np.random.uniform(60, 100)
            subjects = np.random.choice(['math', 'science', 'literature', 'history'], size=np.random.randint(1, 5))
            description = f"Educational dataset with {num_students} students, average score of {avg_score:.2f}, covering {', '.join(subjects)}"
        
        elif category == 'medicines':
            num_patients = np.random.randint(50, 5000)
            efficacy_rate = np.random.uniform(0.5, 0.99)
            drug_type = np.random.choice(['antibiotic', 'antiviral', 'painkiller', 'vaccine'])
            description = f"Medical study with {num_patients} patients, {efficacy_rate:.2%} efficacy rate, testing {drug_type}"
        
        elif category == 'earth & nature':
            location = np.random.choice(['forest', 'ocean', 'mountain', 'desert'])
            num_species = np.random.randint(5, 1000)
            temp_range = f"{np.random.randint(-20, 40)}°C to {np.random.randint(0, 50)}°C"
            description = f"Ecological study in {location} environment, observing {num_species} species, temperature range: {temp_range}"
        
        elif category == 'science & tech':
            tech_area = np.random.choice(['AI', 'robotics', 'quantum computing', 'renewable energy'])
            num_experiments = np.random.randint(10, 1000)
            success_rate = np.random.uniform(0.1, 0.9)
            description = f"Tech research in {tech_area}, conducted {num_experiments} experiments with {success_rate:.2%} success rate"
        
        # Common features
        file_size_mb = np.random.uniform(0.1, 1000)
        last_updated = pd.Timestamp.now() - pd.Timedelta(days=np.random.randint(1, 365))
        
        data.append({
            'category': category,
            'num_columns': num_columns,
            'columns': ', '.join(columns),
            'file_size_mb': file_size_mb,
            'last_updated': last_updated,
            'description': description
        })
    
    return pd.DataFrame(data)

# Generate the dataset
df = generate_synthetic_dataset(2000)

# Split into train and test sets
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)

# Save to CSV files
train_df.to_csv('train_dataset.csv', index=False)
test_df.to_csv('test_dataset.csv', index=False)

print(f"Training set shape: {train_df.shape}")
print(f"Test set shape: {test_df.shape}")
print("\nSample data:")
print(train_df.head())