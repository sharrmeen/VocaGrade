import os
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# models = genai.list_models()
# for model in models:
#     print(model)

model = genai.GenerativeModel("gemini-2.0-flash")

def compare_script_with_transcript(script: str, transcript: str,delivery_metrics:dict,theme:str) -> dict:
    prompt = f"""
You are an expert communication evaluator. 
Your task is to evaluate how well a spoken response matches the original script, 
and also provide highly detailed improvement suggestions.

1. First, identify the main key points from the SCRIPT (focus on important ideas, not minor details).
2. Then, check which of those points appear in the USER SPOKEN RESPONSE (even if phrased differently).
3. Compute coverage as: (key points covered / total key points) * 100.
4. Using SCRIPT, USER SPOKEN RESPONSE, and DELIVERY METRICS, generate very specific improvement tips 
   (e.g., "reduce filler words like 'um' by pausing briefly instead", 
   "restate conclusion more clearly using original phrasing", 
   "maintain a steadier pace in the introduction", etc.).
   - Include tips tailored to delivery metrics (fluency, pauses, clarity, volume consistency).
   - Include tips on content coverage (missed topics, under-explained points).
   - Include at least 2-3 general presentation improvement tips.
5. Additionally, analyze the USER SPOKEN RESPONSE to assess vocabulary, including a diversity score, unique word count, and tone.
   - **Vocabulary Score**: Evaluate the richness and diversity of the language used. A score from 0-100, where a high score indicates varied, complex vocabulary and a low score indicates repetitive or simple words.
   - **Unique Word Count**: A simple count of the total number of distinct words in the response.
   - **Word Repetition**: Identify the top 3-5 most frequently used non-filler words and suggest at least one synonym or alternative for each to improve variety. For example, if "very" is repeated, suggest "exceedingly" or "extremely."
   - **Word Choice Suggestions**: Provide specific tips for replacing weaker or less descriptive words with stronger, more impactful ones. For example, suggest replacing "nice" with "effective" or "beneficial," or "stuff" with a more specific noun.
   - **Tone Assessment**: Briefly analyze the overall tone of the language (e.g., "Formal," "Casual," "Academic"). Suggest whether the tone aligns with the provided THEME and recommend adjustments if needed.
6. Return ONLY valid JSON in this exact structure, with no additional text outside of the JSON:

{{
  "overallCoverage": <integer 0-100>,
  "keyPointsCovered": <integer>,
  "totalKeyPoints": <integer>,
  "missedTopics": ["<string>", "<string>", ...],
  "improvements": {{
      "contentSuggestions": ["<string>", "<string>", ...],
      "deliverySuggestions": ["<string>", "<string>", ...],
      "generalSuggestions": ["<string>", "<string>", ...]
  }},
  "vocabulary": {{
      "vocabularyScore": <integer 0-100>,
      "uniqueWordCount": <integer>,
      "wordRepetition": ["<string>", "<string>", ...],
      "wordChoiceSuggestions": ["<string>", "<string>", "..."],
      "toneAssessment": "<string>"
  }}
}}

SCRIPT:
\"\"\"
{script}
\"\"\"

USER SPOKEN RESPONSE:
\"\"\"
{transcript}
\"\"\"

THEME:
\"\"\"
{theme}
\"\"\"

DELIVERY METRICS:
\"\"\"
{delivery_metrics}
\"\"\"
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
        return {
        "overallCoverage": 0,
        "keyPointsCovered": 0,
        "totalKeyPoints": 0,
        "missedTopics": [],
        "error": str(e)
    }
