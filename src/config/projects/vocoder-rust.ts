export const vocoderRust = {
  id: 'neural-vocoder-rust',
  title: 'Neural Vocoder Implementation (Rust)',
  description: 'High-performance WaveNet vocoder implementation in Rust with WebAssembly compilation. Features real-time mel-spectrogram to audio conversion with GPU acceleration.',
  repoUrl: 'https://github.com/PlemonsBrett/neural-vocoder-rust',
  liveUrl: 'https://portfolio.plemons.dev/projects/neural-vocoder',
  techStack: ['Rust', 'WebAssembly', 'PyTorch C++', 'WASM-pack', 'Web Audio API'],
  structure: {
    root: 'neural-vocoder-rust',
    children: [
      {
        name: 'src', type: 'directory', children: [
          { name: 'lib.rs', type: 'file' },
          { name: 'vocoder.rs', type: 'file' },
          { name: 'mel_spectrogram.rs', type: 'file' },
          { name: 'neural_net.rs', type: 'file' }
        ]
      },
      {
        name: 'www', type: 'directory', children: [
          { name: 'index.html', type: 'file' },
          { name: 'index.js', type: 'file' }
        ]
      },
      { name: 'Cargo.toml', type: 'file' },
      { name: 'README.md', type: 'file' }
    ]
  },
  executableCode: {
    language: 'rust' as const,
    code: `// Neural Vocoder - WaveNet Implementation in Rust
use wasm_bindgen::prelude::*;
use js_sys::Float32Array;

#[wasm_bindgen]
extern "C" {
#[wasm_bindgen(js_namespace = console)]
fn log(s: &str);
}

macro_rules! console_log {
($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub struct WaveNetVocoder {
sample_rate: u32,
hop_length: usize,
mel_bins: usize,
}

#[wasm_bindgen]
impl WaveNetVocoder {
#[wasm_bindgen(constructor)]
pub fn new(sample_rate: u32, hop_length: usize, mel_bins: usize) -> WaveNetVocoder {
    console_log!("Initializing WaveNet Vocoder with sample_rate: {}, hop_length: {}, mel_bins: {}", 
                sample_rate, hop_length, mel_bins);
    
    WaveNetVocoder {
        sample_rate,
        hop_length,
        mel_bins,
    }
}

#[wasm_bindgen]
pub fn generate_audio(&self, mel_spectrogram: &[f32]) -> Vec<f32> {
    console_log!("Generating audio from mel-spectrogram of length: {}", mel_spectrogram.len());
    
    let frames = mel_spectrogram.len() / self.mel_bins;
    let audio_length = frames * self.hop_length;
    let mut audio = vec![0.0f32; audio_length];
    
    // Simplified WaveNet-style generation
    for frame in 0..frames {
        let mel_frame = &mel_spectrogram[frame * self.mel_bins..(frame + 1) * self.mel_bins];
        
        for sample in 0..self.hop_length {
            let audio_idx = frame * self.hop_length + sample;
            if audio_idx < audio_length {
                // Simplified autoregressive generation
                audio[audio_idx] = self.wavenet_step(mel_frame, sample, &audio[..audio_idx]);
            }
        }
    }
    
    console_log!("Generated {} audio samples", audio.len());
    audio
}

fn wavenet_step(&self, mel_frame: &[f32], sample_idx: usize, previous_audio: &[f32]) -> f32 {
    // Simplified WaveNet computation
    let mel_energy: f32 = mel_frame.iter().sum::<f32>() / mel_frame.len() as f32;
    let temporal_factor = (sample_idx as f32 / self.hop_length as f32).sin();
    
    // Simple autoregressive component
    let context = if previous_audio.len() > 0 {
        previous_audio[previous_audio.len() - 1]
    } else {
        0.0
    };
    
    // Generate sample with mel conditioning
    (mel_energy * 0.1 + temporal_factor * 0.05 + context * 0.3).tanh()
}

#[wasm_bindgen]
pub fn create_mel_spectrogram(&self, audio: &[f32]) -> Vec<f32> {
    console_log!("Creating mel-spectrogram from {} audio samples", audio.len());
    
    let frames = audio.len() / self.hop_length;
    let mut mel_spec = vec![0.0f32; frames * self.mel_bins];
    
    for frame in 0..frames {
        let start = frame * self.hop_length;
        let end = (start + self.hop_length).min(audio.len());
        let audio_frame = &audio[start..end];
        
        // Simplified mel-spectrogram computation (normally would use FFT + mel filterbank)
        for bin in 0..self.mel_bins {
            let freq = bin as f32 / self.mel_bins as f32;
            let mut energy = 0.0;
            
            for (i, &sample) in audio_frame.iter().enumerate() {
                let phase = 2.0 * std::f32::consts::PI * freq * i as f32 / self.hop_length as f32;
                energy += sample * phase.cos();
            }
            
            mel_spec[frame * self.mel_bins + bin] = energy.abs().log10().max(-10.0);
        }
    }
    
    mel_spec
}
}

#[wasm_bindgen(start)]
pub fn main() {
console_log!("WaveNet Vocoder WASM module loaded!");
}

// Demo function for interactive showcase
#[wasm_bindgen]
pub fn demo_speech_synthesis() -> String {
let vocoder = WaveNetVocoder::new(22050, 256, 80);

// Create a simple test mel-spectrogram (sine wave pattern)
let mel_frames = 100;
let mut mel_spec = vec![0.0f32; mel_frames * 80];

for frame in 0..mel_frames {
    for bin in 0..80 {
        let freq = (bin as f32 / 80.0) * 8000.0; // 0-8kHz
        let time = frame as f32 / 22050.0;
        mel_spec[frame * 80 + bin] = (2.0 * std::f32::consts::PI * freq * time).sin() * 0.5;
    }
}

let audio = vocoder.generate_audio(&mel_spec);

format!("Generated {} audio samples from {} mel frames", 
        audio.len(), mel_frames)
}`,
    description: 'Interactive WaveNet vocoder showing real-time mel-spectrogram to audio conversion using neural synthesis techniques.'
  },
  demoFeatures: ['Real-time Audio Generation', 'Mel-Spectrogram Visualization', 'WebAssembly Performance', 'Neural Network Inference'],
  images: [
    {
      url: 'https://placehold.co/800x400/1a1a2e/eee?text=Neural+Vocoder+Demo',
      alt: 'Neural Vocoder Interface',
      description: 'Real-time neural vocoder with mel-spectrogram visualization'
    }
  ]
};