# import os
# from openai import OpenAI
# import json


# #client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# USE_MOCK_LLM = True
# class LLMService:

#     @staticmethod
#     def extract_mcqs(raw_text: str) -> dict:
        
        
#         if USE_MOCK_LLM:
#             return {
#                 "questions": [
#                     {
#                         "question": "What is 2 + 2?",
#                         "options": {
#                             "A": "3",
#                             "B": "4",
#                             "C": "5",
#                             "D": "6"
#                         },
#                         "answer": "B"
#                     }
#                 ]
#             }
#         else:
#             client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
#             system_prompt = (
#                 "You are an expert exam paper analyzer. "
#                 "Your task is to extract multiple-choice questions from text."
#             )

#             user_prompt = f"""
#     Convert the following text into structured multiple-choice questions.

#     Rules:
#     - Each question MUST have exactly 4 options labeled A, B, C, D
#     - Infer the correct answer ONLY if clearly mentioned
#     - If the answer is not clear, set answer as null
#     - Return ONLY valid JSON in the format below
#     - Do NOT add explanations or extra text

#     JSON FORMAT:
#     {{
#       "questions": [
#         {{
#           "question": "",
#           "options": {{
#             "A": "",
#             "B": "",
#             "C": "",
#             "D": ""
#           }},
#           "answer": ""
#         }}
#       ]
#     }}

#     TEXT:
#     \"\"\"{raw_text[:8000]}\"\"\"
#     """

#             response = client.chat.completions.create(
#                 model="gpt-4o-mini",
#                 messages=[
#                     {"role": "system", "content": system_prompt},
#                     {"role": "user", "content": user_prompt}
#                 ],
#                 temperature=0.2
#             )

#             content = response.choices[0].message.content.strip()

#         try:
#             return json.loads(content)
#         except json.JSONDecodeError:
#             raise RuntimeError("LLM returned invalid JSON")

import os
import json
from google import genai
from google.genai import types

USE_MOCK_LLM = False

class LLMService:

    @staticmethod
    def extract_mcqs(raw_text):
        print("called")
        if USE_MOCK_LLM:
            return {
                "questions": [
                    {
                        "question": "What is 2 + 2?",
                        "options": {"A": "3", "B": "4", "C": "5", "D": "6"},
                        "answer": "B"
                    }
                ]
            }
        else:
            # 1. Initialize the Client
            client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
            print("client initialized")
            system_instruction = (
                "You are an expert exam paper analyzer. "
                "Your task is to extract multiple-choice questions from text."
            )

            # 2. Define prompt with explicit JSON structure requirements
            user_prompt = f"""
            Convert the following text into structured multiple-choice questions.

            Rules:
            - Each question MUST have exactly 4 options labeled A, B, C, D
            - Infer the correct answer ONLY if clearly mentioned
            - If the answer is not clear, set answer as null
            - Return ONLY valid JSON in the format below
            - Do NOT add explanations or extra text

            JSON FORMAT:
            {{
              "questions": [
                {{
                  "question": "Question text here",
                  "options": {{
                    "A": "Option A text",
                    "B": "Option B text",
                    "C": "Option C text",
                    "D": "Option D text"
                  }},
                  "answer": "A"
                }}
              ]
            }}

            TEXT:
            \"\"\"{raw_text}\"\"\"
            """

            try:
                # 3. Generate Content
                print("Generating content...")
                response = client.models.generate_content(
                    model='gemini-2.5-flash', # Or 'gemini-1.5-flash'
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.2,
                        response_mime_type='application/json' 
                    )
                )
                print("GenAI Response:", response.text)
                # 4. Parse the JSON response
                return json.loads(response.text)

            except Exception as e:
                raise RuntimeError(f"Google GenAI Error: {str(e)}")