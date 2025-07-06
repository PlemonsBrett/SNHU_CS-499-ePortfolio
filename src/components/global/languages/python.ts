import type { Language } from "../MultiLanguageRunner/types";

export const python: Language = {
  id: 'python',
  name: 'Python',
  extension: 'py',
  runtime: 'pyodide',
  aiMlFocus: 'Complete TTS Preprocessing Pipeline',
  defaultCode: `# Complete Neural TTS Preprocessing Pipeline
# Comprehensive audio processing with NumPy, SciPy, and Matplotlib for speech synthesis

import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
from scipy.fft import fft, fftfreq
from scipy.signal import windows
import librosa
import librosa.display
from typing import Tuple, List, Optional
import json

class TTSPreprocessor:
    """
    Comprehensive TTS preprocessing pipeline for neural speech synthesis.
    Handles audio loading, feature extraction, normalization, and visualization.
    """
    
    def __init__(self, 
                 sample_rate: int = 22050,
                 hop_length: int = 256,
                 win_length: int = 1024,
                 n_mels: int = 80,
                 n_fft: int = 1024,
                 f_min: float = 0.0,
                 f_max: Optional[float] = None):
        """
        Initialize TTS preprocessing pipeline with neural synthesis parameters.
        
        Args:
            sample_rate: Audio sampling rate (Hz)
            hop_length: Frame hop length for feature extraction
            win_length: Window length for STFT
            n_mels: Number of mel frequency bins
            n_fft: FFT size for spectral analysis
            f_min: Minimum frequency for mel filterbank
            f_max: Maximum frequency for mel filterbank
        """
        self.sample_rate = sample_rate
        self.hop_length = hop_length
        self.win_length = win_length
        self.n_mels = n_mels
        self.n_fft = n_fft
        self.f_min = f_min
        self.f_max = f_max or sample_rate // 2
        
        # Initialize mel filterbank for speech synthesis
        self.mel_basis = librosa.filters.mel(
            sr=sample_rate,
            n_fft=n_fft,
            n_mels=n_mels,
            fmin=f_min,
            fmax=f_max,
            htk=True  # Use HTK mel scale for better speech synthesis
        )
        
        # Pre-compute window function for STFT
        self.window = windows.hann(win_length, sym=False)
        
        print(f"TTS Preprocessor initialized:")
        print(f"- Sample Rate: {sample_rate} Hz")
        print(f"- Hop Length: {hop_length} samples")
        print(f"- Mel Bins: {n_mels}")
        print(f"- Frequency Range: {f_min}-{f_max} Hz")

    def load_and_preprocess_audio(self, audio_path: str) -> np.ndarray:
        """
        Load and preprocess audio for neural TTS pipeline.
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Preprocessed audio signal
        """
        # Load audio with librosa (handles various formats)
        audio, sr = librosa.load(audio_path, sr=self.sample_rate)
        
        # Apply pre-emphasis filter (high-pass) for speech enhancement
        pre_emphasis = 0.97
        audio = np.append(audio[0], audio[1:] - pre_emphasis * audio[:-1])
        
        # Normalize audio amplitude
        audio = librosa.util.normalize(audio)
        
        # Apply dynamic range compression for neural synthesis
        audio = self.apply_dynamic_range_compression(audio)
        
        return audio

    def extract_mel_spectrogram(self, audio: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Extract mel-spectrogram features optimized for neural TTS.
        
        Args:
            audio: Input audio signal
            
        Returns:
            Tuple of (mel_spectrogram, mel_spectrogram_db)
        """
        # Compute STFT with optimized parameters for speech
        stft = librosa.stft(
            audio,
            n_fft=self.n_fft,
            hop_length=self.hop_length,
            win_length=self.win_length,
            window=self.window,
            center=True,
            pad_mode='reflect'
        )
        
        # Compute magnitude spectrogram
        magnitude = np.abs(stft)
        
        # Apply mel filterbank
        mel_spec = np.dot(self.mel_basis, magnitude)
        
        # Convert to log scale (common in neural TTS)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        
        return mel_spec, mel_spec_db

    def extract_phoneme_features(self, audio: np.ndarray) -> np.ndarray:
        """
        Extract phoneme-level features for neural TTS alignment.
        
        Args:
            audio: Input audio signal
            
        Returns:
            Phoneme-level feature matrix
        """
        # Extract MFCCs (Mel-frequency cepstral coefficients)
        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=self.sample_rate,
            n_mfcc=13,
            hop_length=self.hop_length,
            n_fft=self.n_fft,
            n_mels=self.n_mels
        )
        
        # Extract delta and delta-delta features
        mfcc_delta = librosa.feature.delta(mfcc)
        mfcc_delta2 = librosa.feature.delta(mfcc, order=2)
        
        # Concatenate features
        phoneme_features = np.vstack([mfcc, mfcc_delta, mfcc_delta2])
        
        return phoneme_features

    def extract_prosody_features(self, audio: np.ndarray) -> dict:
        """
        Extract prosodic features for expressive speech synthesis.
        
        Args:
            audio: Input audio signal
            
        Returns:
            Dictionary of prosodic features
        """
        # Extract fundamental frequency (F0)
        f0, voiced_flag, voiced_probs = librosa.pyin(
            audio,
            fmin=librosa.note_to_hz('C2'),
            fmax=librosa.note_to_hz('C7'),
            sr=self.sample_rate,
            hop_length=self.hop_length
        )
        
        # Extract energy/amplitude envelope
        rms = librosa.feature.rms(
            y=audio,
            hop_length=self.hop_length,
            frame_length=self.win_length
        )[0]
        
        # Extract spectral centroid (brightness)
        spectral_centroid = librosa.feature.spectral_centroid(
            y=audio,
            sr=self.sample_rate,
            hop_length=self.hop_length,
            n_fft=self.n_fft
        )[0]
        
        # Extract spectral bandwidth
        spectral_bandwidth = librosa.feature.spectral_bandwidth(
            y=audio,
            sr=self.sample_rate,
            hop_length=self.hop_length,
            n_fft=self.n_fft
        )[0]
        
        return {
            'f0': f0,
            'voiced_flag': voiced_flag,
            'voiced_probs': voiced_probs,
            'rms_energy': rms,
            'spectral_centroid': spectral_centroid,
            'spectral_bandwidth': spectral_bandwidth
        }

    def apply_dynamic_range_compression(self, audio: np.ndarray, 
                                      threshold: float = -20.0,
                                      ratio: float = 4.0) -> np.ndarray:
        """
        Apply dynamic range compression for neural synthesis stability.
        
        Args:
            audio: Input audio signal
            threshold: Compression threshold in dB
            ratio: Compression ratio
            
        Returns:
            Compressed audio signal
        """
        # Convert to dB
        audio_db = 20 * np.log10(np.abs(audio) + 1e-10)
        
        # Apply compression
        compressed_db = np.where(
            audio_db > threshold,
            threshold + (audio_db - threshold) / ratio,
            audio_db
        )
        
        # Convert back to linear scale
        compressed_audio = np.sign(audio) * (10 ** (compressed_db / 20))
        
        return compressed_audio

    def normalize_features(self, features: np.ndarray, 
                          method: str = 'zscore') -> Tuple[np.ndarray, dict]:
        """
        Normalize features for neural network training.
        
        Args:
            features: Input feature matrix
            method: Normalization method ('zscore', 'minmax', 'robust')
            
        Returns:
            Tuple of (normalized_features, normalization_stats)
        """
        if method == 'zscore':
            mean = np.mean(features, axis=1, keepdims=True)
            std = np.std(features, axis=1, keepdims=True)
            normalized = (features - mean) / (std + 1e-8)
            stats = {'mean': mean, 'std': std}
            
        elif method == 'minmax':
            min_val = np.min(features, axis=1, keepdims=True)
            max_val = np.max(features, axis=1, keepdims=True)
            normalized = (features - min_val) / (max_val - min_val + 1e-8)
            stats = {'min': min_val, 'max': max_val}
            
        elif method == 'robust':
            median = np.median(features, axis=1, keepdims=True)
            mad = np.median(np.abs(features - median), axis=1, keepdims=True)
            normalized = (features - median) / (mad + 1e-8)
            stats = {'median': median, 'mad': mad}
            
        else:
            raise ValueError(f"Unknown normalization method: {method}")
            
        return normalized, stats

    def create_attention_alignment(self, text_length: int, 
                                 audio_length: int) -> np.ndarray:
        """
        Create attention alignment matrix for neural TTS training.
        
        Args:
            text_length: Length of input text sequence
            audio_length: Length of output audio sequence
            
        Returns:
            Attention alignment matrix
        """
        # Create monotonic alignment (text-to-speech constraint)
        alignment = np.zeros((text_length, audio_length))
        
        # Simple linear interpolation for demonstration
        for i in range(text_length):
            start_frame = int(i * audio_length / text_length)
            end_frame = int((i + 1) * audio_length / text_length)
            alignment[i, start_frame:end_frame] = 1.0
            
        return alignment

    def visualize_features(self, audio: np.ndarray, 
                          mel_spec: np.ndarray,
                          prosody_features: dict,
                          save_path: Optional[str] = None) -> None:
        """
        Create comprehensive visualization of TTS features.
        
        Args:
            audio: Input audio signal
            mel_spec: Mel-spectrogram
            prosody_features: Dictionary of prosodic features
            save_path: Optional path to save visualization
        """
        fig, axes = plt.subplots(4, 1, figsize=(12, 10))
        fig.suptitle('Neural TTS Feature Analysis', fontsize=16, fontweight='bold')
        
        # Plot waveform
        time = np.arange(len(audio)) / self.sample_rate
        axes[0].plot(time, audio, color='blue', alpha=0.7)
        axes[0].set_title('Audio Waveform')
        axes[0].set_ylabel('Amplitude')
        axes[0].grid(True, alpha=0.3)
        
        # Plot mel-spectrogram
        librosa.display.specshow(
            mel_spec,
            sr=self.sample_rate,
            hop_length=self.hop_length,
            x_axis='time',
            y_axis='mel',
            ax=axes[1],
            cmap='viridis'
        )
        axes[1].set_title('Mel-Spectrogram')
        axes[1].set_ylabel('Mel Frequency')
        
        # Plot F0 contour
        time_f0 = np.arange(len(prosody_features['f0'])) * self.hop_length / self.sample_rate
        axes[2].plot(time_f0, prosody_features['f0'], color='red', linewidth=1)
        axes[2].set_title('Fundamental Frequency (F0)')
        axes[2].set_ylabel('Frequency (Hz)')
        axes[2].grid(True, alpha=0.3)
        
        # Plot energy contour
        time_energy = np.arange(len(prosody_features['rms_energy'])) * self.hop_length / self.sample_rate
        axes[3].plot(time_energy, prosody_features['rms_energy'], color='green', linewidth=1)
        axes[3].set_title('RMS Energy')
        axes[3].set_ylabel('Energy')
        axes[3].set_xlabel('Time (s)')
        axes[3].grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        else:
            plt.show()

    def generate_synthetic_audio(self, duration: float = 2.0) -> np.ndarray:
        """
        Generate synthetic audio for demonstration purposes.
        
        Args:
            duration: Audio duration in seconds
            
        Returns:
            Synthetic audio signal
        """
        # Generate time array
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        
        # Create speech-like signal with formants
        formant_frequencies = [800, 1200, 2500, 3500]  # Typical speech formants
        formant_amplitudes = [1.0, 0.8, 0.6, 0.4]
        
        audio = np.zeros_like(t)
        for freq, amp in zip(formant_frequencies, formant_amplitudes):
            audio += amp * np.sin(2 * np.pi * freq * t)
        
        # Add some noise for realism
        noise = 0.01 * np.random.randn(len(t))
        audio += noise
        
        # Apply envelope for natural decay
        envelope = np.exp(-t / duration)
        audio *= envelope
        
        return audio

    def run_complete_pipeline(self, audio: Optional[np.ndarray] = None) -> dict:
        """
        Run complete TTS preprocessing pipeline.
        
        Args:
            audio: Optional input audio (generates synthetic if None)
            
        Returns:
            Dictionary containing all extracted features
        """
        if audio is None:
            print("Generating synthetic audio for demonstration...")
            audio = self.generate_synthetic_audio(2.0)
        
        print("\\n=== Neural TTS Preprocessing Pipeline ===")
        print(f"Audio length: {len(audio) / self.sample_rate:.2f} seconds")
        
        # Extract mel-spectrogram
        print("\\n1. Extracting mel-spectrogram...")
        mel_spec, mel_spec_db = self.extract_mel_spectrogram(audio)
        print(f"   Mel-spectrogram shape: {mel_spec.shape}")
        
        # Extract phoneme features
        print("\\n2. Extracting phoneme-level features...")
        phoneme_features = self.extract_phoneme_features(audio)
        print(f"   Phoneme features shape: {phoneme_features.shape}")
        
        # Extract prosody features
        print("\\n3. Extracting prosodic features...")
        prosody_features = self.extract_prosody_features(audio)
        print(f"   F0 range: {np.nanmin(prosody_features['f0']):.1f} - {np.nanmax(prosody_features['f0']):.1f} Hz")
        
        # Normalize features
        print("\\n4. Normalizing features...")
        mel_normalized, mel_stats = self.normalize_features(mel_spec)
        phoneme_normalized, phoneme_stats = self.normalize_features(phoneme_features)
        
        # Create attention alignment
        print("\\n5. Creating attention alignment...")
        text_length = 10  # Example text length
        audio_length = mel_spec.shape[1]
        attention_alignment = self.create_attention_alignment(text_length, audio_length)
        
        # Compile results
        results = {
            'audio': audio,
            'mel_spectrogram': mel_spec,
            'mel_spectrogram_db': mel_spec_db,
            'mel_normalized': mel_normalized,
            'phoneme_features': phoneme_features,
            'phoneme_normalized': phoneme_normalized,
            'prosody_features': prosody_features,
            'attention_alignment': attention_alignment,
            'normalization_stats': {
                'mel': mel_stats,
                'phoneme': phoneme_stats
            },
            'metadata': {
                'sample_rate': self.sample_rate,
                'hop_length': self.hop_length,
                'n_mels': self.n_mels,
                'audio_duration': len(audio) / self.sample_rate
            }
        }
        
        print("\\n=== Pipeline Complete ===")
        print(f"Total features extracted: {mel_spec.shape[0] + phoneme_features.shape[0]}")
        print(f"Feature frames: {mel_spec.shape[1]}")
        print(f"Processing time per frame: {self.hop_length / self.sample_rate * 1000:.1f} ms")
        
        return results

# Demo: Run complete TTS preprocessing pipeline
if __name__ == "__main__":
    # Initialize preprocessor
    preprocessor = TTSPreprocessor(
        sample_rate=22050,
        hop_length=256,
        n_mels=80,
        n_fft=1024
    )
    
    # Run complete pipeline
    results = preprocessor.run_complete_pipeline()
    
    # Print summary statistics
    print("\\n=== Feature Summary ===")
    print(f"Mel-spectrogram: {results['mel_spectrogram'].shape}")
    print(f"Phoneme features: {results['phoneme_features'].shape}")
    print(f"F0 statistics: mean={np.nanmean(results['prosody_features']['f0']):.1f}, std={np.nanstd(results['prosody_features']['f0']):.1f}")
    print(f"Energy statistics: mean={np.mean(results['prosody_features']['rms_energy']):.3f}, std={np.std(results['prosody_features']['rms_energy']):.3f}")
    
    # Create visualization
    print("\\nCreating feature visualization...")
    preprocessor.visualize_features(
        results['audio'],
        results['mel_spectrogram_db'],
        results['prosody_features']
    )
    
    print("\\n🎵 Neural TTS preprocessing pipeline ready for speech synthesis! 🧠")`
}; 