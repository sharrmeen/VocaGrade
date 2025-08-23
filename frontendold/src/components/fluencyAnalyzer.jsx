import React, {useState,useRef} from "react";
import { analyzeFluency } from "../api/fluency";

function FluencyAnalyzer(){
    const [audioFile,setAudioFile]=useState(null);
    const [result,setResult] = useState(null);
    const [loading,setLoading] = useState(false);
    const fileInputRef = useRef();

    const handleFileChange =  (e) => {
        setAudioFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if(!audioFile) return;
        setLoading(true);
        try{
            const analysis = await analyzeFluency(audioFile);
            setResult(analysis);
        }catch(err){
            alert("Error analzing audio");
        }finally{
            setLoading(false);
            setAudioFile(null);
            fileInputRef.current.value = null; //Clears file input
    
        }
    };

    return(
        <div style={{padding:"1rem"}}>
            <h2>Fluency Analyzer</h2>
            <input type="file" accept="audio/*" onChange={handleFileChange} ref={fileInputRef}/>
            <button onClick={handleSubmit} disabled={!audioFile || loading}>
            {loading ? "Analyzing..." : "Analyze"}
            </button>

            {
                result && (
                    <div style={{marginTop:"1rem"}}>
                        <h3>Results:</h3>
                        <p><strong>Transcript</strong>{result.transcript}</p>
                        <p><strong>Word Count</strong>{result.total_words}</p>
                        <p><strong>WPM</strong>{result.wpm}</p>
                        <p><strong>Filler Words</strong>{result.filler_words_total}</p>
                        <ul>
                            {Object.entries(result.filler_words).map(([word,count])=>(
                                <li key={word}>{word}:{count}</li>
                            ))}
                        </ul>
                    </div>
                )}
        </div>
    );

}

export default FluencyAnalyzer;