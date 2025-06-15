import os
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# models = genai.list_models()
# for model in models:
#     print(model)

model = genai.GenerativeModel("gemini-2.0-flash")

def compare_script_with_transcript(script:str,transcript:str)->dict:
    prompt = f"""
You are an expert communication evaluator. 
Compare the following user speech against the original script.

SCRIPT:
\"\"\"
{script}
\"\"\"

USER SPOKEN RESPONSE:
\"\"\"
{transcript}
\"\"\"

Give your response in the following JSON format:
{{
  "similarity_score": <float between 0 and 1>,
  "missing_points": [list of key points that were in the script but not spoken],
  "extra_content": [list of off-topic or added ideas],
  "feedback": <short paragraph with suggestions>
}}
    """
    try:
        response=model.generate_content(prompt)
        text = response.text.strip()
        
        import json,re
        json_text = re.search(r"\{.*}",text,re.DOTALL)
        if json_text:
            return json.loads(json_text.group())
        else:
            return{"error":"No valid JSON found in Gemini response."}
    except Exception as e:
        return{"error":str(e)}
