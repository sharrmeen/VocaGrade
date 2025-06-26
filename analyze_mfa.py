from praatio import textgrid
import os

def analyze_textgrid(textgrid_path):
    if not os.path.exists(textgrid_path):
        print(f"File not found: {textgrid_path}")
        return

    tg = textgrid.openTextgrid(textgrid_path, includeEmptyIntervals=False)
    
    if "words" not in tg.tierNameList:
        print("No 'words' tier found in TextGrid.")
        return

    word_tier = tg.tierDict["words"]
    intervals = word_tier.entries

    total_duration = 0
    word_count = 0

    for start, end, label in intervals:
        if label.strip():
            word_count += 1
            total_duration += (end - start)

    print(f"Aligned words: {word_count}")
    print(f"Total speaking time: {total_duration:.2f} seconds")

    if total_duration > 0:
        print(f"Speaking rate: {word_count / (total_duration / 60):.2f} words per minute")
    else:
        print("No speech duration found.")

# Example usage:
textgrid_file = "/Users/sharmeenkhan/Desktop/mfa_output/hello.TextGrid"  # Update this to your file path
analyze_textgrid(textgrid_file)
