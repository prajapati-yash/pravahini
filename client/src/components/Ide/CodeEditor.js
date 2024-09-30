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
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [lanNumber, setLanNumber] = useState('5');
  const editorRef = useRef(null);

  useEffect(() => {
    // Retrieve code from local storage if available
    const storedCode = localStorage.getItem('code');
    if (storedCode) {
      setCode(storedCode);
    }
  }, []);

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

    // Map language to language number
    const languageMap = {
      python: '5',
      c: '6',
      java: '4',
      javascript: '17',
    };

    setLanNumber(languageMap['python']);

    if (language === 'java') {
      setCode(javaBoilerplateCode);
    } else {
      setCode('');
    }
  };

  const handleTerminalClick = () => {
    setTerminalOpen(!terminalOpen);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem('code', newCode);
  };

  const handleRun = async () => {
    if (!terminalOpen) {
      setTerminalOpen(!terminalOpen);
    }

    const encodedParams = new URLSearchParams();
    encodedParams.set('LanguageChoice', lanNumber);
    encodedParams.set('Program', code);
    const options = {
      method: 'POST',
      url: 'https://code-compiler.p.rapidapi.com/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com'
      },
      data: encodedParams,
    };
    try {
      const response = await axios.request(options);
      if (response.data.Result) {
        setOutput(response.data.Result);
      } else if (response.data.Errors) {
        setOutput(response.data.Errors);
      } else {
        setOutput('No output or errors available.');
      }
    } catch (error) {
      console.error(error);
      setOutput('Error occurred during code execution.');
    }
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
        </div>
        <AceEditor
          mode={selectedLanguage.toLowerCase()}
          theme="monokai"
          name="code-editor"
          editorProps={{ $blockScrolling: true }}
          style={{ height: '63vh', width: '70vw', borderRadius: '5px'}}
          showPrintMargin={false}
          onChange={handleCodeChange}
          value={code}
          ref={editorRef}
        />      
      </div>
      
        <div className={`reverse-terminal ${terminalOpen ? 'open' : ''}`} >
          <p onClick={handleTerminalClick}>Output</p>
          <button className='run' onClick={handleRun}>Run</button>
          {terminalOpen && (
            <div className='output-container'>
              <pre className='output'>{output}</pre>
            </div>
          )}
        </div>    
    </div>
  );
}

export default CodeEditor