import React, { useRef, useState, useEffect} from 'react';
import "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import 'ace-builds/src-noconflict/mode-javascript'; // Import desired language modes
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai'; // Import desired theme
import './CodeEditor.css'
import axios from 'axios';

const javaBoilerplateCode = `public class Progman {
  public static void main(String[] args) {
      // Your code here
  }
}`;

function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [lanNumber, setLanNumber] = useState('5');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    // Retrieve code and language from local storage if available
    const storedLanguage = localStorage.getItem('language');
    const storedCode = localStorage.getItem('code');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      setLanNumber(getLanguageNumber(storedLanguage));
    }
    if (storedCode) {
      setCode(storedCode);
    } else {
      // Set default code for the selected language
      setCode(defaultCode[selectedLanguage]);
    }
  }, []);
  const getLanguageNumber = (language) => {
    const languageMap = {
      python: '5',
      c: '6',
      java: '4',
      javascript: '17',
    };
    return languageMap[language] || '5';
  };

  const defaultCode = {
    python: `from math import sqrt
from collections import Counter

# Function to calculate Euclidean distance between two points
def euclidean_distance(point1, point2):
    distance = 0.0
    for i in range(len(point1)):
        distance += (point1[i] - point2[i]) ** 2
    return sqrt(distance)

# K-Nearest Neighbors classifier
class KNN:
    def __init__(self, k=3):  # Use k=3 by default
        self.k = k
        self.X_train = []
        self.y_train = []
    
    # Fit the training data (X_train, y_train)
    def fit(self, X_train, y_train):
        self.X_train = X_train
        self.y_train = y_train
    
    # Predict the class labels for test data
    def predict(self, X_test):
        predictions = [self._predict(x) for x in X_test]
        return predictions
    
    # Helper function to predict a single instance
    def _predict(self, x):
        # Compute distances between x and all examples in the training set
        distances = [euclidean_distance(x, x_train) for x_train in self.X_train]
        
        # Get the nearest k neighbors
        k_indices = sorted(range(len(distances)), key=lambda i: distances[i])[:self.k]
        k_nearest_labels = [self.y_train[i] for i in k_indices]
        
        # Majority vote (most common label)
        most_common = Counter(k_nearest_labels).most_common(1)
        return most_common[0][0]

# Function to calculate accuracy
def accuracy(y_true, y_pred):
    correct = 0
    for true_label, pred_label in zip(y_true, y_pred):
        if true_label == pred_label:
            correct += 1
    return correct / len(y_true)

# Main function to test the custom KNN implementation
if __name__ == "__main__":
    # Sample dataset: Iris-like format (sepal length, sepal width, petal length, petal width)
    X_train = [
        [5.1, 3.5, 1.4, 0.2],  # Setosa
        [4.9, 3.0, 1.4, 0.2],  # Setosa
        [5.0, 3.6, 1.4, 0.2],  # Setosa
        [6.4, 3.2, 4.5, 1.5],  # Versicolour
        [6.9, 3.1, 4.9, 1.5],  # Versicolour
        [6.5, 2.8, 4.6, 1.5],  # Versicolour
        [7.1, 3.0, 5.9, 2.1],  # Virginica
        [6.3, 3.4, 5.6, 2.4],  # Virginica
        [6.9, 3.1, 5.1, 2.3]   # Virginica
    ]

    # Labels (0: Setosa, 1: Versicolour, 2: Virginica)
    y_train = [0, 0, 0, 1, 1, 1, 2, 2, 2]
    
    # Test set
    X_test = [
        [6.8, 3.2, 5.9, 2.3],  # Virginica
        [5.0, 3.4, 1.5, 0.2],  # Setosa
        [6.5, 3.0, 5.2, 2.0]   # Virginica
    ]
    
    # Actual labels for the test set
    y_test = [2, 0, 2]

    # Create the KNN classifier instance with k=3
    knn = KNN(k=3)
    
    # Train the model
    knn.fit(X_train, y_train)
    
    # Predict the labels for test data
    y_pred = knn.predict(X_test)
    
    # Output the predicted labels and actual labels
    print("Predicted labels:", y_pred)
    print("Actual labels:   ", y_test)
    
    # Calculate and print the accuracy
    acc = accuracy(y_test, y_pred)
    print(f"Accuracy of the model: {acc * 100:.2f}%")
`,
    javascript: '// Your JavaScript code here\n\nconsole.log("Hello, World!");',
    c: '#include <stdio.h>;\n\nint main() {\n    // Your C code here\n    printf("Hello, World!\\n");\n    return 0;\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        // Your Java code here\n        System.out.println("Hello, World!");\n    }\n}'
  };
  useEffect(() => {
    const handleClick = () => {
      if (terminalOpen) {
        setTerminalOpen(false);
      }
    };

    // Add event listener to detect clicks inside the editor area
    if (editorRef.current && editorRef.current.editor) {
      editorRef.current.editor.container.addEventListener('click', handleClick);
    }

    return () => {
      // Remove event listener on cleanup
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.container.removeEventListener('click', handleClick);
      }
    };
  }, [terminalOpen]);

  
  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    setLanNumber(getLanguageNumber(language));
    setCode(defaultCode[language]);
    localStorage.setItem('language', language);
    localStorage.setItem('code', defaultCode[language]);
  };

  const handleTerminalClick = () => {
    setTerminalOpen(!terminalOpen);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem('code', newCode);
  };

  const apiKeys = [
    process.env.REACT_APP_RAPIDAPI_KEY_1,
    process.env.REACT_APP_RAPIDAPI_KEY_2,
    process.env.REACT_APP_RAPIDAPI_KEY_3,
    // Add all 10 API keys here
  ];
  let currentKeyIndex = 0;
  
  const handleRun = async () => {
    if (!terminalOpen) {
      setTerminalOpen(!terminalOpen);
    }
  
    const encodedParams = new URLSearchParams();
    encodedParams.set('LanguageChoice', lanNumber);
    encodedParams.set('Program', code);
  
    const makeRequest = async () => {
      const options = {
        method: 'POST',
        url: 'https://code-compiler.p.rapidapi.com/v2',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': apiKeys[currentKeyIndex], // Use the current API key
          'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com'
        },
        data: encodedParams,
      };
  
      try {
        setLoading(true);
        const response = await axios.request(options);
        console.log(response.data);
        if (response.data?.Result) {
          setOutput(response.data.Result);
        } else if (response.data.Errors) {
          setOutput(response.data.Errors);
        } else {
          setOutput('No output or errors available.');
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
  
        // Check for rate limit error or similar API limit error
        if (error.response && error.response.status === 429) {
          console.log('Rate limit reached, switching API key...');
          
          // Switch to the next API key if available
          currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  
          // Retry the request with the new key
          if (currentKeyIndex !== 0) {
            await makeRequest(); // Retry recursively until a valid key is used
          } else {
            setOutput('All API keys have reached their rate limits.');
          }
        } else {
          setOutput('Error occurred during code execution.');
        }
      }
    };
  
    await makeRequest();
  };
  
  
  return (
    <div className='code-container'>
      <div className='code-editor'>
        <div className='custom-select'> 
        <select value={selectedLanguage} onChange={handleLanguageChange} className='lan_options'>
          <option value="python" className='opt'>Python</option>
          <option value="javascript" className='opt'>JavaScript</option>
          <option value="c" className='opt'>C</option>
          <option value="java" className='opt'>Java</option> 
        </select>
        <button className='button pulse' onClick={handleRun}>Run</button>
        <div>

        </div>
        </div>
        <AceEditor
          mode={selectedLanguage.toLowerCase()}
          theme="chrome"
          name="code-editor"
          editorProps={{ $blockScrolling: true }}
          style={{ height: '63vh', width: '70vw', borderRadius: '5px'}}
          showPrintMargin={false}
          onChange={handleCodeChange}
          value={code}
          ref={editorRef}
          className='ace-editor'
        />      

      </div>
      
        <div className={`reverse-terminal ${terminalOpen ? 'open' : ''}`} >
          <p onClick={handleTerminalClick}>Output</p>
          <div className='button-center'>
          </div>
          {terminalOpen && (
            <div className='output-container'>
              {loading ?(  <div className="loader"></div> ):(<pre className='output'>{output}</pre>)}
            </div>
          )}
        </div>    
    </div>
  );
}

export default CodeEditor