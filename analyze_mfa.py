import textgrids
import os
import librosa
import numpy as np
import matplotlib.pyplot as plt
import librosa.display
from scipy.spatial.distance import euclidean

# --- Configuration ---
SAMPLE_RATE = 16000
N_MFCC = 13
HOP_LENGTH = 512
N_FFT = 2048

# --- Paths ---
user_audio_path = os.path.expanduser("~/Desktop/mfa_input/env.wav") # Your input audio
textgrid_path = os.path.expanduser("~/Desktop/mfa_output/env.TextGrid") # MFA output TextGrid

# --- 1. Load Audio ---
def load_audio(filepath, target_sr=SAMPLE_RATE):
    try:
        audio, sr = librosa.load(filepath, sr=target_sr, mono=True)
        return audio, sr
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None, None

user_y, user_sr = load_audio(user_audio_path)

if user_y is None:
    print("Could not load user audio. Exiting.")
    exit()

# --- 2. Parse TextGrid ---
try:
    grid = textgrids.TextGrid(textgrid_path)
    print(f"Successfully loaded TextGrid: {textgrid_path}")
    
    # CORRECTED PART: Accessing tiers
    tier_names = list(grid.keys()) # Get a list of all tier names
    print(f"Tiers in TextGrid: {tier_names}")

    # Check if expected tiers exist
    if 'words' not in tier_names:
        print("Warning: 'words' tier not found. Check your MFA output tier names.")
        words_tier = None
    else:
        words_tier = grid['words']

    if 'phones' not in tier_names and 'segments' not in tier_names:
        print("Warning: Neither 'phones' nor 'segments' tier found. Check your MFA output tier names.")
        phones_tier = None
    elif 'phones' in tier_names:
        phones_tier = grid['phones']
    else: # Must be 'segments'
        phones_tier = grid['segments']


except Exception as e:
    print(f"Error loading TextGrid: {e}")
    print("Make sure the path is correct and MFA generated it successfully.")
    exit()

# Ensure we have the tiers before proceeding
if words_tier is None or phones_tier is None:
    print("Required 'words' or 'phones'/'segments' tier not found. Cannot proceed with analysis.")
    exit()


print("\n--- Word Alignments ---")
for interval in words_tier:
    print(f"Word: '{interval.text}' Start: {interval.xmin:.3f}s End: {interval.xmax:.3f}s")

print("\n--- Phoneme Alignments ---")
for interval in phones_tier:
    print(f"Phoneme: '{interval.text}' Start: {interval.xmin:.3f}s End: {interval.xmax:.3f}s")

# --- Rest of your code (Feature Extraction, Comparison, Visualization) ---
# ... (the rest of your script should be fine after this fix) ...

# Ensure these functions are defined if you're using them later:
def extract_features(y, sr):
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=N_MFCC, hop_length=HOP_LENGTH, n_fft=N_FFT)
    f0, voiced_flag, voiced_probs = librosa.pyin(y=y, sr=sr, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C5'))
    rms = librosa.feature.rms(y=y, frame_length=N_FFT, hop_length=HOP_LENGTH)
    return mfccs, f0, rms

user_mfccs, user_f0, user_rms = extract_features(user_y, user_sr)

# For demonstration, we'll just show how to extract features per segment from user audio:
print("\n--- Segment-wise Feature Analysis (User) ---")
segment_features = {}
for ph_interval in phones_tier:
    ph_text = ph_interval.text
    start_time = ph_interval.xmin
    end_time = ph_interval.xmax

    # Convert times to sample indices
    start_sample = int(start_time * user_sr)
    end_sample = int(end_time * user_sr)

    # Extract audio segment for the phoneme
    ph_segment = user_y[start_sample:end_sample]

    if len(ph_segment) == 0:
        print(f"Warning: Phoneme '{ph_text}' at {start_time:.3f}-{end_time:.3f}s is too short to analyze.")
        segment_features[ph_text] = None
        continue

    # Extract MFCCs for this segment
    ph_mfccs, _, _ = extract_features(ph_segment, user_sr)

    # For a simple comparison, you might take the mean of the MFCCs over the segment
    if ph_mfccs.shape[1] > 0:
        avg_ph_mfcc = np.mean(ph_mfccs, axis=1)
        segment_features[ph_text] = avg_ph_mfcc
        print(f"Phoneme '{ph_text}' avg MFCC shape: {avg_ph_mfcc.shape}")
    else:
        print(f"Warning: Could not extract MFCCs for phoneme '{ph_text}'.")
        segment_features[ph_text] = None

def plot_audio_with_alignments(y, sr, text_grid_obj, title=""):
    plt.figure(figsize=(15, 6))

    # Waveform
    plt.subplot(2, 1, 1)
    librosa.display.waveshow(y, sr=sr, alpha=0.6)
    plt.title(f"Waveform with Alignments - {title}")
    plt.grid(True)

    # Plot word boundaries
    if 'words' in text_grid_obj:
        for interval in text_grid_obj['words']:
            plt.axvline(interval.xmin, color='r', linestyle='--', linewidth=1)
            plt.axvline(interval.xmax, color='r', linestyle='--', linewidth=1)
            plt.text((interval.xmin + interval.xmax) / 2, plt.ylim()[1] * 0.9, interval.text,
                    color='r', ha='center', va='top', fontsize=10, weight='bold')

    # Plot phoneme boundaries
    phone_tier_name = 'phones' if 'phones' in text_grid_obj else ('segments' if 'segments' in text_grid_obj else None)
    if phone_tier_name:
        for interval in text_grid_obj[phone_tier_name]:
            plt.axvline(interval.xmin, color='g', linestyle=':', linewidth=0.8)
            plt.text(interval.xmin + (interval.xmax - interval.xmin) / 2, plt.ylim()[1] * 0.7, interval.text,
                    color='g', ha='center', va='top', fontsize=8)


    # Spectrogram
    plt.subplot(2, 1, 2)
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y, n_fft=N_FFT, hop_length=HOP_LENGTH)), ref=np.max)
    librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='log', cmap='magma_r', hop_length=HOP_LENGTH)
    plt.colorbar(format='%+2.0f dB')
    plt.title(f"Spectrogram with Alignments - {title}")
    plt.grid(True)

    # Plot word boundaries on spectrogram
    if 'words' in text_grid_obj:
        for interval in text_grid_obj['words']:
            plt.axvline(interval.xmin, color='r', linestyle='--', linewidth=1)
            plt.axvline(interval.xmax, color='r', linestyle='--', linewidth=1)

    # Plot phoneme boundaries on spectrogram
    if phone_tier_name:
        for interval in text_grid_obj[phone_tier_name]:
            plt.axvline(interval.xmin, color='g', linestyle=':', linewidth=0.8)

    plt.tight_layout()
    plt.show()

# Run the plotting function
plot_audio_with_alignments(user_y, user_sr, grid, title="User's Pronunciation (Aligned)")