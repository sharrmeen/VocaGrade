# from services.transcriber import transcribe_audio

# script,_=transcribe_audio("/Users/sharmeenkhan/Downloads/env.wav")
# print(script)
# # with open('/Users/sharmeenkhan/VoiceGrade/backend/hr_script.txt','w') as file:
# #     file.write(script)


import whisper

model = whisper.load_model("base")  # or "small", "medium", "large"
result = model.transcribe("/Users/sharmeenkhan/Downloads/env.wav")

print(result["text"])
