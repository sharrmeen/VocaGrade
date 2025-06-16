from services.transcriber import transcribe_audio

script,_=transcribe_audio("/Users/sharmeenkhan/VoiceGrade/backend/hr_audio.mp3")
print(script)
with open('/Users/sharmeenkhan/VoiceGrade/backend/hr_script.txt','w') as file:
    file.write(script)