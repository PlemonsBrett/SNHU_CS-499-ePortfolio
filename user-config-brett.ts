export const userConfig = {
  // Personal Information
  name: 'Brett Plemons',
  role: 'Software Engineering Manager',
  roleFocus: 'AI/ML Engineering & Neural Speech Synthesis',
  email: 'brett@plemons.dev',
  location: 'Kansas, United States',
  age: 32,
  website: 'portfolio.plemons.dev',

  // Contact Information
  contact: {
    email: 'brett@plemons.dev',
    phone: '+1 (785) 555-0123', // Update with your real number
    calendly: 'https://calendly.com/plemonsbrett', // Update with your real Calendly
  },

  // Social Links
  social: {
    github: 'https://github.com/PlemonsBrett',
    linkedin: 'https://www.linkedin.com/in/brettplemons',
    bluesky: 'https://bsky.app/profile/plemonsbrett.link',
    stackoverflow: 'https://stackoverflow.com/users/12834192/plemonsbrett',
    twitch: 'https://twitch.tv/voltikstudios',
    gravatar: 'https://plemonsbrett.link',
  },

  // Resume Configuration
  resume: {
    url: 'https://portfolio.plemons.dev/resume.pdf',
    localPath: '/resume.pdf',
  },

  // Spotify Integration
  spotify: {
    playlistId: '37i9dQZF1DX0XUsuxWHRQd', // Update with your playlist ID
  },

  // Education
  education: [
    {
      degree: 'Bachelor of Science',
      major: 'Computer Science',
      institution: 'Southern New Hampshire University',
      location: 'New Hampshire, USA',
      year: '2024',
      description: 'Specialized in AI/ML algorithms, data structures, and software engineering principles. Capstone focused on neural speech synthesis architectures.',
      images: []
    }
  ],

  // Professional Experience
  experience: [
    {
      title: 'Software Engineering Manager',
      company: 'Propio Language Services',
      location: 'Kansas, USA',
      period: '2022 - Present',
      description: 'Leading engineering teams developing AI-powered language processing systems. Architecting high-concurrency Elixir services for real-time speech synthesis and NLP pipelines. Managing 8+ engineers across backend, ML, and DevOps teams.',
      technologies: ['Elixir', 'Phoenix', 'Python', 'TypeScript', 'Next.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes'],
      images: []
    },
    {
      title: 'Senior Backend Engineer',
      company: 'Propio Language Services',
      location: 'Kansas, USA',
      period: '2020 - 2022',
      description: 'Designed and implemented scalable backend systems for neural speech synthesis. Built real-time audio processing pipelines handling 10k+ concurrent requests. Optimized ML model inference for sub-100ms latency.',
      technologies: ['Elixir', 'Phoenix', 'Python', 'PyTorch', 'TensorFlow', 'Redis', 'PostgreSQL', 'AWS'],
      images: []
    },
    {
      title: 'Backend Engineer',
      company: 'Previous Company',
      location: 'Remote',
      period: '2018 - 2020',
      description: 'Developed microservices architecture for data processing and analytics. Built ETL pipelines processing millions of records daily. Implemented monitoring and observability across distributed systems.',
      technologies: ['Python', 'Go', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
      images: []
    }
  ],

  // Technical Skills
  skills: [
    // AI/ML & Speech Synthesis
    'Neural Speech Synthesis', 'PyTorch', 'TensorFlow', 'Transformers', 'WaveNet', 'Tacotron',
    'Mel-Spectrograms', 'Vocoder Models', 'Attention Mechanisms', 'Sequence-to-Sequence Models',

    // Programming Languages
    'Elixir', 'Rust', 'Go', 'Python', 'TypeScript', 'Scala', 'JavaScript',

    // Backend & Infrastructure
    'Phoenix Framework', 'Next.js', 'FastAPI', 'PostgreSQL', 'Redis', 'MongoDB',
    'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Apache Kafka',

    // Data & Analytics
    'Apache Spark', 'Pandas', 'NumPy', 'Jupyter', 'MLflow', 'DVC',

    // DevOps & Monitoring
    'CI/CD', 'GitHub Actions', 'Prometheus', 'Grafana', 'ELK Stack', 'Datadog'
  ],

  // Courses and Certifications
  courses: [
    {
      title: 'Deep Learning for Audio and Speech Processing',
      institution: 'Stanford University (Online)',
      location: 'Online',
      year: '2023',
      description: 'Advanced coursework in neural speech synthesis, voice cloning, and real-time audio processing using deep learning techniques.',
      images: []
    },
    {
      title: 'AWS Solutions Architect Professional',
      institution: 'Amazon Web Services',
      location: 'Online',
      year: '2022',
      description: 'Professional certification covering advanced AWS architectures, security, and scalability patterns for enterprise applications.',
      images: []
    }
  ],

  // Projects - Enhanced with AI/ML focus
  projects: [
    {
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
    },

    {
      id: 'attention-mechanism-go',
      title: 'Transformer Attention Visualization (Go)',
      description: 'Interactive visualization of multi-head attention mechanisms used in Transformer-based speech synthesis models like Tacotron 2. Built with Go and compiled to WebAssembly.',
      repoUrl: 'https://github.com/PlemonsBrett/attention-visualization-go',
      liveUrl: 'https://portfolio.plemons.dev/projects/attention-viz',
      techStack: ['Go', 'WebAssembly', 'Canvas API', 'Linear Algebra', 'SVG'],
      structure: {
        root: 'attention-visualization-go',
        children: [
          { name: 'main.go', type: 'file' },
          { name: 'attention.go', type: 'file' },
          { name: 'transformer.go', type: 'file' },
          { name: 'visualization.go', type: 'file' },
          { name: 'go.mod', type: 'file' },
          { name: 'index.html', type: 'file' }
        ]
      },
      executableCode: {
        language: 'go' as const,
        code: `// Transformer Attention Mechanism Visualization
package main

import (
    "fmt"
    "math"
    "math/rand"
    "syscall/js"
    "time"
)

type AttentionHead struct {
    DModel    int
    DKey      int
    DValue    int
    Weights   [][]float64
    QueryW    [][]float64
    KeyW      [][]float64
    ValueW    [][]float64
}

type MultiHeadAttention struct {
    Heads     []AttentionHead
    NumHeads  int
    DModel    int
    OutputW   [][]float64
}

func NewMultiHeadAttention(numHeads, dModel int) *MultiHeadAttention {
    dKey := dModel / numHeads
    heads := make([]AttentionHead, numHeads)
    
    for i := range heads {
        heads[i] = AttentionHead{
            DModel: dModel,
            DKey:   dKey,
            DValue: dKey,
            QueryW: randomMatrix(dModel, dKey),
            KeyW:   randomMatrix(dModel, dKey),
            ValueW: randomMatrix(dModel, dKey),
        }
    }
    
    return &MultiHeadAttention{
        Heads:    heads,
        NumHeads: numHeads,
        DModel:   dModel,
        OutputW:  randomMatrix(dModel, dModel),
    }
}

func randomMatrix(rows, cols int) [][]float64 {
    matrix := make([][]float64, rows)
    for i := range matrix {
        matrix[i] = make([]float64, cols)
        for j := range matrix[i] {
            matrix[i][j] = (rand.Float64() - 0.5) * 0.1
        }
    }
    return matrix
}

func (mha *MultiHeadAttention) Forward(query, key, value [][]float64) ([][]float64, [][][]float64) {
    seqLen := len(query)
    attentionWeights := make([][][]float64, mha.NumHeads)
    headOutputs := make([][][]float64, mha.NumHeads)
    
    for h := 0; h < mha.NumHeads; h++ {
        head := &mha.Heads[h]
        
        // Compute Q, K, V for this head
        Q := matmul(query, head.QueryW)
        K := matmul(key, head.KeyW)
        V := matmul(value, head.ValueW)
        
        // Compute attention scores
        scores := make([][]float64, seqLen)
        for i := range scores {
            scores[i] = make([]float64, seqLen)
            for j := range scores[i] {
                scores[i][j] = dotProduct(Q[i], K[j]) / math.Sqrt(float64(head.DKey))
            }
        }
        
        // Apply softmax
        weights := softmax2D(scores)
        attentionWeights[h] = weights
        
        // Apply attention to values
        output := make([][]float64, seqLen)
        for i := range output {
            output[i] = make([]float64, head.DValue)
            for j := range V {
                for k := range V[j] {
                    output[i][k] += weights[i][j] * V[j][k]
                }
            }
        }
        headOutputs[h] = output
    }
    
    // Concatenate head outputs
    finalOutput := make([][]float64, seqLen)
    for i := range finalOutput {
        finalOutput[i] = make([]float64, 0, mha.DModel)
        for h := range headOutputs {
            finalOutput[i] = append(finalOutput[i], headOutputs[h][i]...)
        }
    }
    
    // Apply output projection
    result := matmul(finalOutput, mha.OutputW)
    return result, attentionWeights
}

func matmul(a, b [][]float64) [][]float64 {
    rows, cols := len(a), len(b[0])
    result := make([][]float64, rows)
    for i := range result {
        result[i] = make([]float64, cols)
        for j := range result[i] {
            for k := range b {
                result[i][j] += a[i][k] * b[k][j]
            }
        }
    }
    return result
}

func dotProduct(a, b []float64) float64 {
    result := 0.0
    for i := range a {
        result += a[i] * b[i]
    }
    return result
}

func softmax2D(matrix [][]float64) [][]float64 {
    result := make([][]float64, len(matrix))
    for i := range matrix {
        result[i] = softmax(matrix[i])
    }
    return result
}

func softmax(x []float64) []float64 {
    max := x[0]
    for _, v := range x[1:] {
        if v > max {
            max = v
        }
    }
    
    sum := 0.0
    result := make([]float64, len(x))
    for i, v := range x {
        result[i] = math.Exp(v - max)
        sum += result[i]
    }
    
    for i := range result {
        result[i] /= sum
    }
    return result
}

// JavaScript exports
func demoAttention(this js.Value, args []js.Value) interface{} {
    seqLen := args[0].Int()
    dModel := args[1].Int()
    numHeads := args[2].Int()
    
    fmt.Printf("Creating attention demo: seq_len=%d, d_model=%d, num_heads=%d\\n", seqLen, dModel, numHeads)
    
    // Create random input sequences (simulating text embeddings)
    input := make([][]float64, seqLen)
    for i := range input {
        input[i] = make([]float64, dModel)
        for j := range input[i] {
            input[i][j] = rand.NormFloat64() * 0.1
        }
    }
    
    // Create multi-head attention
    mha := NewMultiHeadAttention(numHeads, dModel)
    
    // Forward pass
    start := time.Now()
    output, attentionWeights := mha.Forward(input, input, input)
    duration := time.Since(start)
    
    // Convert attention weights to JavaScript format
    jsWeights := js.Global().Get("Array").New()
    for h := 0; h < numHeads; h++ {
        headWeights := js.Global().Get("Array").New()
        for i := range attentionWeights[h] {
            rowWeights := js.Global().Get("Array").New()
            for j := range attentionWeights[h][i] {
                rowWeights.Call("push", attentionWeights[h][i][j])
            }
            headWeights.Call("push", rowWeights)
        }
        jsWeights.Call("push", headWeights)
    }
    
    result := js.Global().Get("Object").New()
    result.Set("attentionWeights", jsWeights)
    result.Set("duration", duration.Nanoseconds()/1000000) // Convert to milliseconds
    result.Set("outputShape", fmt.Sprintf("[%d, %d]", len(output), len(output[0])))
    
    return result
}

func main() {
    rand.Seed(time.Now().UnixNano())
    
    fmt.Println("Go Multi-Head Attention WASM loaded!")
    
    js.Global().Set("goMultiHeadAttention", js.FuncOf(demoAttention))
    
    // Keep the program running
    select {}
}`,
        description: 'Visualize how multi-head attention mechanisms work in Transformer models for speech synthesis, showing attention patterns across sequence positions.'
      },
      demoFeatures: ['Multi-Head Attention Visualization', 'Real-time Computation', 'Attention Heatmaps', 'Transformer Architecture'],
      images: [
        {
          url: 'https://placehold.co/800x400/2d1b69/eee?text=Attention+Visualization',
          alt: 'Attention Mechanism Visualization',
          description: 'Multi-head attention patterns in neural speech synthesis'
        }
      ]
    },

    {
      id: 'mel-spectrogram-elixir',
      title: 'Real-time Mel-Spectrogram Processing (Elixir)',
      description: 'High-concurrency Elixir application for real-time mel-spectrogram computation and streaming. Demonstrates Actor model for audio processing pipelines used in speech synthesis.',
      repoUrl: 'https://github.com/PlemonsBrett/mel-spectrogram-elixir',
      liveUrl: 'https://portfolio.plemons.dev/projects/mel-processing',
      techStack: ['Elixir', 'Phoenix LiveView', 'GenServer', 'OTP', 'Phoenix Channels'],
      structure: {
        root: 'mel-spectrogram-elixir',
        children: [
          {
            name: 'lib', type: 'directory', children: [
              { name: 'mel_processor.ex', type: 'file' },
              { name: 'audio_stream.ex', type: 'file' },
              { name: 'spectrogram_server.ex', type: 'file' }
            ]
          },
          { name: 'test', type: 'directory' },
          { name: 'mix.exs', type: 'file' },
          { name: 'README.md', type: 'file' }
        ]
      },
      executableCode: {
        language: 'elixir' as const,
        code: `# Real-time Mel-Spectrogram Processing in Elixir
# Demonstrates Actor model for high-concurrency audio processing

defmodule MelSpectrogram.AudioProcessor do
  @moduledoc """
  GenServer for processing audio streams and computing mel-spectrograms
  in real-time using the Actor model for concurrency.
  """
  
  use GenServer
  require Logger

  @sample_rate 22050
  @hop_length 256
  @n_mels 80
  @n_fft 1024

  # Client API

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def process_audio_chunk(chunk) when is_list(chunk) do
    GenServer.call(__MODULE__, {:process_chunk, chunk})
  end

  def get_mel_spectrogram(audio_data) when is_list(audio_data) do
    GenServer.call(__MODULE__, {:compute_mel, audio_data})
  end

  def stream_audio(audio_data, chunk_size \\ 1024) do
    GenServer.cast(__MODULE__, {:stream_audio, audio_data, chunk_size})
  end

  # Server Callbacks

  def init(_opts) do
    Logger.info("Starting Mel-Spectrogram Audio Processor")
    
    state = %{
      buffer: [],
      mel_filters: create_mel_filters(),
      window: create_hann_window(@n_fft),
      processed_chunks: 0,
      total_samples: 0
    }
    
    {:ok, state}
  end

  def handle_call({:process_chunk, chunk}, _from, state) do
    # Add chunk to buffer
    new_buffer = state.buffer ++ chunk
    
    # Process if we have enough samples
    {spectrograms, remaining_buffer} = process_buffer(new_buffer, state)
    
    new_state = %{state | 
      buffer: remaining_buffer,
      processed_chunks: state.processed_chunks + 1,
      total_samples: state.total_samples + length(chunk)
    }
    
    {:reply, spectrograms, new_state}
  end

  def handle_call({:compute_mel, audio_data}, _from, state) do
    mel_spec = compute_mel_spectrogram(audio_data, state)
    {:reply, mel_spec, state}
  end

  def handle_cast({:stream_audio, audio_data, chunk_size}, state) do
    # Process audio in chunks asynchronously
    spawn(fn -> 
      audio_data
      |> Enum.chunk_every(chunk_size)
      |> Enum.each(fn chunk ->
        process_audio_chunk(chunk)
        Process.sleep(10) # Simulate real-time processing
      end)
    end)
    
    {:noreply, state}
  end

  # Private Functions

  defp process_buffer(buffer, state) when length(buffer) < @hop_length do
    {[], buffer}
  end

  defp process_buffer(buffer, state) do
    # Extract frames for processing
    {frames, remaining} = extract_frames(buffer, [])
    
    # Compute mel-spectrograms for each frame
    spectrograms = Enum.map(frames, fn frame ->
      compute_mel_frame(frame, state)
    end)
    
    {spectrograms, remaining}
  end

  defp extract_frames(buffer, acc) when length(buffer) < @hop_length do
    {Enum.reverse(acc), buffer}
  end

  defp extract_frames(buffer, acc) do
    {frame, rest} = Enum.split(buffer, @hop_length)
    extract_frames(rest, [frame | acc])
  end

  defp compute_mel_spectrogram(audio_data, state) do
    audio_data
    |> Enum.chunk_every(@hop_length, @hop_length, :discard)
    |> Enum.map(fn frame -> compute_mel_frame(frame, state) end)
  end

  defp compute_mel_frame(frame, state) do
    # Apply window function
    windowed = apply_window(frame, state.window)
    
    # Compute FFT (simplified implementation)
    fft_result = compute_fft(windowed)
    
    # Convert to power spectrum
    power_spectrum = Enum.map(fft_result, fn {real, imag} ->
      real * real + imag * imag
    end)
    
    # Apply mel filters
    apply_mel_filters(power_spectrum, state.mel_filters)
  end

  defp apply_window(frame, window) do
    frame
    |> Enum.with_index()
    |> Enum.map(fn {sample, idx} ->
      window_val = if idx < length(window), do: Enum.at(window, idx), else: 0.0
      sample * window_val
    end)
  end

  defp compute_fft(samples) do
    # Simplified FFT implementation for demonstration
    # In production, would use :fft library or NIFs
    n = length(samples)
    
    0..div(@n_fft, 2)
    |> Enum.map(fn k ->
      {real, imag} = samples
      |> Enum.with_index()
      |> Enum.reduce({0.0, 0.0}, fn {sample, n}, {re_acc, im_acc} ->
        angle = -2.0 * :math.pi() * k * n / @n_fft
        cos_val = :math.cos(angle)
        sin_val = :math.sin(angle)
        
        {re_acc + sample * cos_val, im_acc + sample * sin_val}
      end)
      
      {real, imag}
    end)
  end

  defp apply_mel_filters(power_spectrum, mel_filters) do
    mel_filters
    |> Enum.map(fn filter ->
      power_spectrum
      |> Enum.with_index()
      |> Enum.reduce(0.0, fn {power, idx}, acc ->
        filter_val = if idx < length(filter), do: Enum.at(filter, idx), else: 0.0
        acc + power * filter_val
      end)
      |> max(1.0e-10) # Prevent log(0)
      |> :math.log10()
    end)
  end

  defp create_mel_filters do
    # Create mel-scale filterbank
    fft_bins = div(@n_fft, 2) + 1
    mel_points = mel_scale(0, @sample_rate / 2, @n_mels + 2)
    bin_points = mel_to_hz(mel_points) |> Enum.map(&(&1 * @n_fft / @sample_rate))
    
    0..(@n_mels - 1)
    |> Enum.map(fn m ->
      create_triangular_filter(bin_points, m, fft_bins)
    end)
  end

  defp mel_scale(f_min, f_max, n_mels) do
    f_min_mel = hz_to_mel(f_min)
    f_max_mel = hz_to_mel(f_max)
    
    0..(n_mels - 1)
    |> Enum.map(fn i ->
      f_min_mel + (f_max_mel - f_min_mel) * i / (n_mels - 1)
    end)
  end

  defp hz_to_mel(hz), do: 2595.0 * :math.log10(1.0 + hz / 700.0)
  defp mel_to_hz(mel), do: 700.0 * (:math.pow(10, mel / 2595.0) - 1.0)

  defp create_triangular_filter(bin_points, m, fft_bins) do
    left = Enum.at(bin_points, m) |> round()
    center = Enum.at(bin_points, m + 1) |> round()
    right = Enum.at(bin_points, m + 2) |> round()
    
    0..(fft_bins - 1)
    |> Enum.map(fn bin ->
      cond do
        bin < left or bin > right -> 0.0
        bin <= center -> (bin - left) / (center - left)
        true -> (right - bin) / (right - center)
      end
    end)
  end

  defp create_hann_window(size) do
    0..(size - 1)
    |> Enum.map(fn n ->
      0.5 - 0.5 * :math.cos(2 * :math.pi() * n / (size - 1))
    end)
  end
end

# Demo usage and streaming setup
defmodule MelSpectrogram.Demo do
  @moduledoc """
  Demonstration of real-time mel-spectrogram processing
  """

  def run_demo do
    # Start the audio processor
    {:ok, _pid} = MelSpectrogram.AudioProcessor.start_link()
    
    # Generate synthetic audio (sine wave)
    audio_data = generate_test_audio(2.0, 440.0) # 2 seconds at 440 Hz
    
    # Process in real-time chunks
    MelSpectrogram.AudioProcessor.stream_audio(audio_data, 1024)
    
    # Get complete mel-spectrogram
    mel_spec = MelSpectrogram.AudioProcessor.get_mel_spectrogram(audio_data)
    
    %{
      audio_length: length(audio_data),
      mel_frames: length(mel_spec),
      mel_bins: if(length(mel_spec) > 0, do: length(hd(mel_spec)), else: 0),
      sample_audio: Enum.take(audio_data, 10),
      sample_mel: if(length(mel_spec) > 0, do: Enum.take(hd(mel_spec), 5), else: [])
    }
  end

  defp generate_test_audio(duration, frequency) do
    sample_rate = 22050
    num_samples = round(duration * sample_rate)
    
    0..(num_samples - 1)
    |> Enum.map(fn n ->
      :math.sin(2 * :math.pi() * frequency * n / sample_rate) * 0.5
    end)
  end
end

# Run the demo
MelSpectrogram.Demo.run_demo()`,
        description: 'Real-time mel-spectrogram processing using Elixir\'s Actor model for high-concurrency audio pipeline processing.'
      },
      demoFeatures: ['Actor Model Concurrency', 'Real-time Audio Processing', 'Mel-Spectrogram Computation', 'Stream Processing'],
      images: [
        {
          url: 'https://placehold.co/800x400/663399/eee?text=Elixir+Audio+Pipeline',
          alt: 'Elixir Audio Processing Pipeline',
          description: 'Real-time mel-spectrogram processing with Actor model concurrency'
        }
      ]
    },

    {
      id: 'nlp-embeddings-python',
      title: 'Neural Text-to-Speech Embeddings (Python)',
      description: 'Complete text preprocessing and phoneme embedding pipeline for neural speech synthesis. Includes attention alignment visualization and prosody prediction using transformers.',
      repoUrl: 'https://github.com/PlemonsBrett/tts-embeddings-python',
      liveUrl: 'https://portfolio.plemons.dev/projects/tts-embeddings',
      techStack: ['Python', 'PyTorch', 'Transformers', 'NumPy', 'Matplotlib', 'Phonemizer'],
      structure: {
        root: 'tts-embeddings-python',
        children: [
          {
            name: 'src', type: 'directory', children: [
              { name: 'text_processor.py', type: 'file' },
              { name: 'phoneme_encoder.py', type: 'file' },
              { name: 'attention_model.py', type: 'file' },
              { name: 'prosody_predictor.py', type: 'file' }
            ]
          },
          { name: 'models', type: 'directory' },
          { name: 'requirements.txt', type: 'file' },
          { name: 'train.py', type: 'file' }
        ]
      },
      executableCode: {
        language: 'python' as const,
        code: `# Neural Text-to-Speech Embeddings Pipeline
import numpy as np
import matplotlib.pyplot as plt
from typing import List, Tuple, Dict
import re

class PhonemeEncoder:
    """Phoneme encoding for neural speech synthesis"""
    
    def __init__(self):
        # IPA phoneme set (simplified)
        self.phonemes = [
            '<pad>', '<sos>', '<eos>', 
            # Vowels
            'i', 'ɪ', 'e', 'ɛ', 'æ', 'a', 'ɑ', 'ɔ', 'o', 'ʊ', 'u', 'ʌ', 'ə', 'ɜ', 'ɪ̯', 'ʊ̯',
            # Consonants  
            'p', 'b', 't', 'd', 'k', 'g', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h',
            'm', 'n', 'ŋ', 'l', 'r', 'w', 'j',
            # Stress and prosody markers
            'ˈ', 'ˌ', '.', '?', '!', ',',
        ]
        
        self.phone_to_id = {phone: i for i, phone in enumerate(self.phonemes)}
        self.id_to_phone = {i: phone for i, phone in enumerate(self.phonemes)}
        
        # Embedding dimension for neural networks
        self.embedding_dim = 256
        
        print(f"Initialized PhonemeEncoder with {len(self.phonemes)} phonemes")
    
    def text_to_phonemes(self, text: str) -> List[str]:
        """Convert text to phoneme sequence (simplified G2P)"""
        # This is a simplified grapheme-to-phoneme conversion
        # In practice, would use espeak-ng, Festival, or trained models
        
        g2p_map = {
            'hello': ['h', 'ə', 'ˈ', 'l', 'oʊ'],
            'world': ['ˈ', 'w', 'ɜ', 'r', 'l', 'd'],
            'speech': ['s', 'p', 'i', 'ʧ'],
            'synthesis': ['ˈ', 's', 'ɪ', 'n', 'θ', 'ə', 's', 'ɪ', 's'],
            'neural': ['ˈ', 'n', 'ʊ', 'r', 'ə', 'l'],
            'network': ['ˈ', 'n', 'ɛ', 't', 'w', 'ɜ', 'r', 'k'],
            'attention': ['ə', 'ˈ', 't', 'ɛ', 'n', 'ʃ', 'ə', 'n'],
            'the': ['ð', 'ə'],
            'is': ['ɪ', 'z'],
            'and': ['æ', 'n', 'd'],
        }
        
        words = text.lower().split()
        phonemes = ['<sos>']
        
        for word in words:
            if word in g2p_map:
                phonemes.extend(g2p_map[word])
            else:
                # Fallback: character-level mapping
                for char in word:
                    if char in self.phone_to_id:
                        phonemes.append(char)
            phonemes.append('.')  # Word boundary
        
        phonemes.append('<eos>')
        return phonemes
    
    def encode_phonemes(self, phonemes: List[str]) -> List[int]:
        """Convert phoneme sequence to integer IDs"""
        return [self.phone_to_id.get(phone, self.phone_to_id['<pad>']) for phone in phonemes]
    
    def create_embeddings(self, phoneme_ids: List[int]) -> np.ndarray:
        """Create phoneme embeddings for neural networks"""
        # Initialize random embeddings (in practice, these would be learned)
        np.random.seed(42)  # For reproducible results
        embedding_matrix = np.random.randn(len(self.phonemes), self.embedding_dim) * 0.1
        
        # Create positional encodings
        seq_len = len(phoneme_ids)
        pos_encodings = np.zeros((seq_len, self.embedding_dim))
        
        for pos in range(seq_len):
            for i in range(0, self.embedding_dim, 2):
                pos_encodings[pos, i] = np.sin(pos / (10000 ** (i / self.embedding_dim)))
                if i + 1 < self.embedding_dim:
                    pos_encodings[pos, i + 1] = np.cos(pos / (10000 ** (i / self.embedding_dim)))
        
        # Combine phoneme embeddings with positional encodings
        embeddings = np.array([embedding_matrix[pid] for pid in phoneme_ids])
        embeddings += pos_encodings
        
        return embeddings

class AttentionAlignment:
    """Visualize attention alignment for text-to-speech"""
    
    def __init__(self, encoder_len: int, decoder_len: int):
        self.encoder_len = encoder_len
        self.decoder_len = decoder_len
        
    def generate_alignment(self) -> np.ndarray:
        """Generate synthetic attention alignment matrix"""
        # Create a diagonal-ish attention pattern (typical for TTS)
        attention = np.zeros((self.decoder_len, self.encoder_len))
        
        # Create monotonic alignment with some variance
        for i in range(self.decoder_len):
            # Map decoder position to encoder position
            center = (i / self.decoder_len) * self.encoder_len
            
            # Add gaussian attention around the center
            for j in range(self.encoder_len):
                distance = abs(j - center)
                attention[i, j] = np.exp(-distance**2 / (2 * 2**2))  # sigma=2
            
            # Normalize
            attention[i] /= attention[i].sum()
        
        # Add some noise for realism
        noise = np.random.normal(0, 0.01, attention.shape)
        attention = np.clip(attention + noise, 0, None)
        
        # Renormalize
        attention = attention / attention.sum(axis=1, keepdims=True)
        
        return attention

class ProsodyPredictor:
    """Predict prosodic features for expressive speech synthesis"""
    
    def __init__(self):
        self.features = ['pitch', 'energy', 'duration']
        
    def predict_prosody(self, phoneme_embeddings: np.ndarray, text: str) -> Dict[str, np.ndarray]:
        """Predict prosodic features from phoneme embeddings"""
        seq_len = len(phoneme_embeddings)
        
        # Simulate prosody prediction (would use trained neural networks)
        np.random.seed(hash(text) % 2**32)  # Deterministic based on text
        
        # Pitch contour (fundamental frequency)
        base_pitch = 150  # Hz
        pitch = base_pitch + 50 * np.sin(np.linspace(0, 2*np.pi, seq_len))
        pitch += np.random.normal(0, 10, seq_len)  # Add variation
        
        # Energy contour
        energy = 0.5 + 0.3 * np.sin(np.linspace(0, np.pi, seq_len))
        energy += np.random.normal(0, 0.05, seq_len)
        energy = np.clip(energy, 0, 1)
        
        # Duration prediction (phoneme timing)
        base_duration = 0.1  # seconds
        duration = np.full(seq_len, base_duration)
        # Vowels typically longer than consonants
        vowel_indices = np.random.choice(seq_len, seq_len//3, replace=False)
        duration[vowel_indices] *= 1.5
        
        return {
            'pitch': pitch,
            'energy': energy, 
            'duration': duration
        }

# Demo function for interactive showcase
def run_tts_pipeline_demo():
    """Complete TTS preprocessing pipeline demonstration"""
    
    # Sample text for speech synthesis
    text = "Hello world, this is neural speech synthesis"
    print(f"Input text: '{text}'")
    
    # Step 1: Text to phonemes
    encoder = PhonemeEncoder()
    phonemes = encoder.text_to_phonemes(text)
    print(f"Phonemes: {phonemes}")
    
    # Step 2: Phoneme encoding
    phoneme_ids = encoder.encode_phonemes(phonemes)
    print(f"Phoneme IDs: {phoneme_ids}")
    
    # Step 3: Create embeddings
    embeddings = encoder.create_embeddings(phoneme_ids)
    print(f"Embeddings shape: {embeddings.shape}")
    
    # Step 4: Generate attention alignment
    decoder_len = 100  # Mel-spectrogram frames
    attention_viz = AttentionAlignment(len(phonemes), decoder_len)
    alignment = attention_viz.generate_alignment()
    
    # Step 5: Predict prosody
    prosody_predictor = ProsodyPredictor()
    prosody = prosody_predictor.predict_prosody(embeddings, text)
    
    # Create visualization
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    
    # Plot 1: Attention alignment
    im1 = axes[0,0].imshow(alignment, aspect='auto', origin='lower')
    axes[0,0].set_title('Attention Alignment')
    axes[0,0].set_xlabel('Phoneme Position')
    axes[0,0].set_ylabel('Mel Frame')
    plt.colorbar(im1, ax=axes[0,0])
    
    # Plot 2: Phoneme embeddings (first 2 dimensions)
    axes[0,1].scatter(embeddings[:, 0], embeddings[:, 1], c=range(len(embeddings)), cmap='viridis')
    axes[0,1].set_title('Phoneme Embeddings (2D projection)')
    axes[0,1].set_xlabel('Embedding Dim 0')
    axes[0,1].set_ylabel('Embedding Dim 1')
    
    # Plot 3: Prosody features
    x = np.arange(len(prosody['pitch']))
    axes[1,0].plot(x, prosody['pitch'], label='Pitch (Hz)', color='blue')
    axes[1,0].set_ylabel('Pitch (Hz)', color='blue')
    axes[1,0].tick_params(axis='y', labelcolor='blue')
    
    ax2 = axes[1,0].twinx()
    ax2.plot(x, prosody['energy'], label='Energy', color='red', alpha=0.7)
    ax2.set_ylabel('Energy', color='red')
    ax2.tick_params(axis='y', labelcolor='red')
    axes[1,0].set_title('Prosodic Features')
    axes[1,0].set_xlabel('Phoneme Position')
    
    # Plot 4: Duration prediction
    axes[1,1].bar(x, prosody['duration'], alpha=0.7)
    axes[1,1].set_title('Phoneme Duration Prediction')
    axes[1,1].set_xlabel('Phoneme Position')
    axes[1,1].set_ylabel('Duration (seconds)')
    
    plt.tight_layout()
    plt.show()
    
    # Return summary statistics
    return {
        'text': text,
        'num_phonemes': len(phonemes),
        'embedding_shape': embeddings.shape,
        'attention_shape': alignment.shape,
        'avg_pitch': float(np.mean(prosody['pitch'])),
        'avg_energy': float(np.mean(prosody['energy'])),
        'total_duration': float(np.sum(prosody['duration'])),
        'phoneme_sequence': phonemes[:10]  # First 10 phonemes
    }

# Run the demo
result = run_tts_pipeline_demo()
print("\\nPipeline Results:")
for key, value in result.items():
    print(f"{key}: {value}")`,
        description: 'Complete text-to-speech preprocessing pipeline showing phoneme encoding, attention alignment, and prosody prediction for neural speech synthesis.'
      },
      demoFeatures: ['Phoneme Encoding', 'Attention Visualization', 'Prosody Prediction', 'Text Processing Pipeline'],
      images: [
        {
          url: 'https://placehold.co/800x400/0f4c75/eee?text=TTS+Pipeline+Visualization',
          alt: 'TTS Processing Pipeline',
          description: 'Neural text-to-speech pipeline with attention alignment and prosody features'
        }
      ]
    },

    {
      id: 'acoustic-modeling-scala',
      title: 'Distributed Acoustic Modeling (Scala)',
      description: 'Functional programming approach to distributed acoustic feature extraction for speech synthesis using Scala and Akka. Demonstrates functional composition in ML pipelines.',
      repoUrl: 'https://github.com/PlemonsBrett/acoustic-modeling-scala',
      liveUrl: 'https://portfolio.plemons.dev/projects/acoustic-modeling',
      techStack: ['Scala', 'Akka', 'Cats', 'Functional Programming', 'Apache Spark'],
      structure: {
        root: 'acoustic-modeling-scala',
        children: [
          {
            name: 'src/main/scala', type: 'directory', children: [
              { name: 'AcousticFeatures.scala', type: 'file' },
              { name: 'FeatureExtractor.scala', type: 'file' },
              { name: 'ModelingPipeline.scala', type: 'file' }
            ]
          },
          { name: 'build.sbt', type: 'file' },
          { name: 'README.md', type: 'file' }
        ]
      },
      executableCode: {
        language: 'scala' as const,
        code: `// Distributed Acoustic Modeling in Scala
// Functional programming approach to speech feature extraction

import scala.util.{Try, Success, Failure}
import scala.concurrent.{Future, ExecutionContext}
import scala.collection.immutable.List
import scala.math._

// Type aliases for clarity
type AudioSample = Double
type FrequencyBin = Double
type MelCoefficient = Double
type MFCCCoefficient = Double

// Audio frame representation
case class AudioFrame(
  samples: Vector[AudioSample],
  sampleRate: Int,
  frameIndex: Int,
  timestamp: Double
)

// Acoustic features
case class AcousticFeatures(
  mfcc: Vector[MFCCCoefficient],
  spectralCentroid: Double,
  spectralRolloff: Double,
  zeroCrossingRate: Double,
  energy: Double,
  frameIndex: Int
)

// Error types for functional error handling
sealed trait AcousticError
case class InvalidSampleRate(rate: Int) extends AcousticError
case class InsufficientSamples(count: Int, required: Int) extends AcousticError
case class ProcessingError(message: String) extends AcousticError

// Result type for functional composition
type AcousticResult[T] = Either[AcousticError, T]

object AcousticModeling {
  
  // Configuration for feature extraction
  case class FeatureConfig(
    sampleRate: Int = 22050,
    frameSize: Int = 1024,
    hopLength: Int = 512,
    nMfcc: Int = 13,
    nMels: Int = 40,
    fMin: Double = 0.0,
    fMax: Option[Double] = None
  )
  
  implicit val defaultConfig: FeatureConfig = FeatureConfig()
  
  // Functional feature extraction pipeline
  class FeatureExtractor(implicit config: FeatureConfig) {
    
    def extractFeatures(frame: AudioFrame): AcousticResult[AcousticFeatures] = {
      for {
        _ <- validateFrame(frame)
        windowed <- applyWindow(frame)
        spectrum <- computeSpectrum(windowed)
        mfcc <- computeMFCC(spectrum)
        centroid <- computeSpectralCentroid(spectrum)
        rolloff <- computeSpectralRolloff(spectrum)
        zcr <- computeZeroCrossingRate(frame)
        energy <- computeEnergy(frame)
      } yield AcousticFeatures(
        mfcc = mfcc,
        spectralCentroid = centroid,
        spectralRolloff = rolloff,
        zeroCrossingRate = zcr,
        energy = energy,
        frameIndex = frame.frameIndex
      )
    }
    
    private def validateFrame(frame: AudioFrame): AcousticResult[AudioFrame] = {
      if (frame.sampleRate <= 0) {
        Left(InvalidSampleRate(frame.sampleRate))
      } else if (frame.samples.length < config.frameSize) {
        Left(InsufficientSamples(frame.samples.length, config.frameSize))
      } else {
        Right(frame)
      }
    }
    
    private def applyWindow(frame: AudioFrame): AcousticResult[Vector[AudioSample]] = {
      Try {
        val window = hannWindow(config.frameSize)
        frame.samples.zip(window).map { case (sample, w) => sample * w }
      }.toEither.left.map(e => ProcessingError(s"Windowing failed: \${e.getMessage}"))
    }
    
    private def computeSpectrum(samples: Vector[AudioSample]): AcousticResult[Vector[Double]] = {
      Try {
        // Simplified FFT computation
        val n = samples.length
        val spectrum = (0 until n/2).map { k =>
          val real = samples.zipWithIndex.map { case (s, i) =>
            s * cos(2 * Pi * k * i / n)
          }.sum
          val imag = samples.zipWithIndex.map { case (s, i) =>
            s * sin(2 * Pi * k * i / n)
          }.sum
          sqrt(real * real + imag * imag)
        }.toVector
        spectrum
      }.toEither.left.map(e => ProcessingError(s"Spectrum computation failed: \${e.getMessage}"))
    }
    
    private def computeMFCC(spectrum: Vector[Double]): AcousticResult[Vector[MFCCCoefficient]] = {
      Try {
        // Mel filterbank
        val melFilters = createMelFilterbank(spectrum.length, config.nMels)
        
        // Apply mel filters
        val melSpectrum = melFilters.map { filter =>
          spectrum.zip(filter).map { case (s, f) => s * f }.sum
        }
        
        // Log mel spectrum
        val logMelSpectrum = melSpectrum.map(s => log(max(s, 1e-10)))
        
        // DCT to get MFCC
        val mfcc = (0 until config.nMfcc).map { k =>
          logMelSpectrum.zipWithIndex.map { case (logMel, n) =>
            logMel * cos(Pi * k * (n + 0.5) / config.nMels)
          }.sum * sqrt(2.0 / config.nMels)
        }.toVector
        
        mfcc
      }.toEither.left.map(e => ProcessingError(s"MFCC computation failed: \${e.getMessage}"))
    }
    
    private def computeSpectralCentroid(spectrum: Vector[Double]): AcousticResult[Double] = {
      Try {
        val freqs = spectrum.indices.map(_.toDouble * config.sampleRate / (2 * spectrum.length))
        val magnitude = spectrum.sum
        
        if (magnitude > 0) {
          spectrum.zip(freqs).map { case (s, f) => s * f }.sum / magnitude
        } else {
          0.0
        }
      }.toEither.left.map(e => ProcessingError(s"Spectral centroid computation failed: \${e.getMessage}"))
    }
    
    private def computeSpectralRolloff(spectrum: Vector[Double]): AcousticResult[Double] = {
      Try {
        val totalEnergy = spectrum.sum
        val threshold = 0.85 * totalEnergy
        var cumulativeEnergy = 0.0
        
        val rolloffBin = spectrum.zipWithIndex.find { case (s, _) =>
          cumulativeEnergy += s
          cumulativeEnergy >= threshold
        }.map(_._2).getOrElse(spectrum.length - 1)
        
        rolloffBin.toDouble * config.sampleRate / (2 * spectrum.length)
      }.toEither.left.map(e => ProcessingError(s"Spectral rolloff computation failed: \${e.getMessage}"))
    }
    
    private def computeZeroCrossingRate(frame: AudioFrame): AcousticResult[Double] = {
      Try {
        val samples = frame.samples
        val crossings = samples.zip(samples.tail).count { case (a, b) =>
          (a >= 0 && b < 0) || (a < 0 && b >= 0)
        }
        crossings.toDouble / (samples.length - 1)
      }.toEither.left.map(e => ProcessingError(s"Zero crossing rate computation failed: \${e.getMessage}"))
    }
    
    private def computeEnergy(frame: AudioFrame): AcousticResult[Double] = {
      Try {
        frame.samples.map(s => s * s).sum / frame.samples.length
      }.toEither.left.map(e => ProcessingError(s"Energy computation failed: \${e.getMessage}"))
    }
    
    private def hannWindow(size: Int): Vector[Double] = {
      (0 until size).map { n =>
        0.5 - 0.5 * cos(2 * Pi * n / (size - 1))
      }.toVector
    }
    
    private def createMelFilterbank(nFft: Int, nMels: Int): Vector[Vector[Double]] = {
      val nyquist = config.sampleRate / 2.0
      val melLow = hzToMel(config.fMin)
      val melHigh = hzToMel(config.fMax.getOrElse(nyquist))
      
      // Mel points
      val melPoints = (0 to nMels + 1).map { i =>
        melLow + (melHigh - melLow) * i / (nMels + 1)
      }
      
      // Convert to Hz and then to FFT bins
      val hzPoints = melPoints.map(melToHz)
      val binPoints = hzPoints.map(_ * nFft / config.sampleRate)
      
      // Create triangular filters
      (1 to nMels).map { i =>
        val left = binPoints(i - 1).toInt
        val center = binPoints(i).toInt
        val right = binPoints(i + 1).toInt
        
        (0 until nFft).map { bin =>
          if (bin < left || bin > right) {
            0.0
          } else if (bin <= center) {
            (bin - left).toDouble / (center - left)
          } else {
            (right - bin).toDouble / (right - center)
          }
        }.toVector
      }.toVector
    }
    
    private def hzToMel(hz: Double): Double = 2595.0 * log10(1.0 + hz / 700.0)
    private def melToHz(mel: Double): Double = 700.0 * (pow(10, mel / 2595.0) - 1.0)
  }
  
  // Distributed processing using functional composition
  object DistributedProcessor {
    
    def processAudioStream(
      frames: List[AudioFrame]
    )(implicit config: FeatureConfig, ec: ExecutionContext): Future[List[AcousticFeatures]] = {
      
      val extractor = new FeatureExtractor()
      
      // Process frames in parallel using functional composition
      val featureFutures = frames.map { frame =>
        Future {
          extractor.extractFeatures(frame)
        }
      }
      
      Future.sequence(featureFutures).map { results =>
        results.collect { case Right(features) => features }
      }
    }
    
    def aggregateFeatures(features: List[AcousticFeatures]): AcousticResult[AcousticFeatures] = {
      if (features.isEmpty) {
        Left(ProcessingError("No features to aggregate"))
      } else {
        Try {
          val avgMfcc = (0 until features.head.mfcc.length).map { i =>
            features.map(_.mfcc(i)).sum / features.length
          }.toVector
          
          val avgCentroid = features.map(_.spectralCentroid).sum / features.length
          val avgRolloff = features.map(_.spectralRolloff).sum / features.length
          val avgZcr = features.map(_.zeroCrossingRate).sum / features.length
          val avgEnergy = features.map(_.energy).sum / features.length
          
          AcousticFeatures(
            mfcc = avgMfcc,
            spectralCentroid = avgCentroid,
            spectralRolloff = avgRolloff,
            zeroCrossingRate = avgZcr,
            energy = avgEnergy,
            frameIndex = -1 // Aggregated frame
          )
        }.toEither.left.map(e => ProcessingError(s"Aggregation failed: \${e.getMessage}"))
      }
    }
  }
  
  // Demo function for interactive showcase
  def runAcousticModelingDemo(): Map[String, Any] = {
    implicit val config: FeatureConfig = FeatureConfig(
      sampleRate = 22050,
      frameSize = 1024,
      nMfcc = 13,
      nMels = 40
    )
    
    println("Running Acoustic Modeling Demo...")
    
    // Generate synthetic audio data
    val duration = 1.0 // seconds
    val frequency = 440.0 // Hz (A4 note)
    val numSamples = (duration * config.sampleRate).toInt
    
    val audioSamples = (0 until numSamples).map { n =>
      val t = n.toDouble / config.sampleRate
      0.5 * sin(2 * Pi * frequency * t) + 0.2 * sin(2 * Pi * frequency * 2 * t)
    }.toVector
    
    // Create audio frames
    val frames = audioSamples
      .grouped(config.frameSize)
      .zipWithIndex
      .map { case (samples, idx) =>
        AudioFrame(
          samples = samples.toVector,
          sampleRate = config.sampleRate,
          frameIndex = idx,
          timestamp = idx * config.hopLength.toDouble / config.sampleRate
        )
      }
      .toList
    
    println(s"Created ${frames.length} audio frames")
    
    // Extract features from each frame
    val extractor = new FeatureExtractor()
    val featureResults = frames.map(extractor.extractFeatures)
    
    val successfulFeatures = featureResults.collect { case Right(features) => features }
    val errors = featureResults.collect { case Left(error) => error }
    
    println(s"Successfully extracted features from \${successfulFeatures.length} frames")
    if (errors.nonEmpty) {
      println(s"Encountered \${errors.length} errors during processing")
    }
    
    // Aggregate features
    val aggregatedResult = DistributedProcessor.aggregateFeatures(successfulFeatures)
    
    val summary = aggregatedResult match {
      case Right(avgFeatures) =>
        Map(
          "total_frames" -> frames.length,
          "successful_extractions" -> successfulFeatures.length,
          "errors" -> errors.length,
          "avg_mfcc_first_coeff" -> avgFeatures.mfcc.headOption.getOrElse(0.0),
          "avg_spectral_centroid" -> avgFeatures.spectralCentroid,
          "avg_spectral_rolloff" -> avgFeatures.spectralRolloff,
          "avg_zero_crossing_rate" -> avgFeatures.zeroCrossingRate,
          "avg_energy" -> avgFeatures.energy,
          "sample_mfcc" -> successfulFeatures.headOption.map(_.mfcc.take(5)).getOrElse(Vector.empty),
          "processing_pipeline" -> "text → phonemes → acoustic features → prosody"
        )
      case Left(error) =>
        Map(
          "error" -> error.toString,
          "total_frames" -> frames.length,
          "successful_extractions" -> successfulFeatures.length
        )
    }
    
    println("\nAcoustic Modeling Results:")
    summary.foreach { case (key, value) =>
      println(s"  $key: $value")
    }
    
    summary
  }
}

// Run the demo
AcousticModeling.runAcousticModelingDemo()`
      },
      demoFeatures: ['Functional Programming', 'Distributed Processing', 'MFCC Extraction', 'Spectral Analysis'],
      images: [
        {
          url: 'https://placehold.co/800x400/dc143c/eee?text=Scala+Acoustic+Modeling',
          alt: 'Scala Acoustic Feature Extraction',
          description: 'Functional approach to distributed acoustic modeling for speech synthesis'
        }
      ]
    },

    {
      id: 'voice-conversion-typescript',
      title: 'Real-time Voice Conversion (TypeScript)',
      description: 'Browser-based real-time voice conversion system using Web Audio API and neural networks. Demonstrates cross-lingual voice synthesis and speaker adaptation techniques.',
      repoUrl: 'https://github.com/PlemonsBrett/voice-conversion-ts',
      liveUrl: 'https://portfolio.plemons.dev/projects/voice-conversion',
      techStack: ['TypeScript', 'Web Audio API', 'TensorFlow.js', 'WebRTC', 'Canvas API'],
      structure: {
        root: 'voice-conversion-typescript',
        children: [
          { name: 'src', type: 'directory', children: [
            { name: 'audio', type: 'directory', children: [
              { name: 'AudioProcessor.ts', type: 'file' },
              { name: 'VoiceConverter.ts', type: 'file' },
              { name: 'FeatureExtractor.ts', type: 'file' }
            ]},
            { name: 'models', type: 'directory', children: [
              { name: 'NeuralVocoder.ts', type: 'file' },
              { name: 'SpeakerEncoder.ts', type: 'file' }
            ]},
            { name: 'ui', type: 'directory', children: [
              { name: 'VoiceConversionUI.ts', type: 'file' },
              { name: 'Visualizer.ts', type: 'file' }
            ]}
          ]},
          { name: 'package.json', type: 'file' },
          { name: 'tsconfig.json', type: 'file' }
        ]
      },
      executableCode: {
        language: 'typescript' as const,
        code: `// Real-time Voice Conversion System in TypeScript
// Browser-based neural voice synthesis and conversion

interface AudioFeatures {
      readonly f0: Float32Array;           // Fundamental frequency
      readonly spectralEnvelope: Float32Array; // Spectral envelope
      readonly aperiodicity: Float32Array;     // Aperiodicity measure
      readonly mfcc: Float32Array;            // Mel-frequency cepstral coefficients
      readonly duration: number;              // Frame duration
    }

interface SpeakerEmbedding {
      readonly embedding: Float32Array;
      readonly speakerId: string;
      readonly confidence: number;
    }

interface ConversionParams {
      readonly targetSpeaker: string;
      readonly pitchShift: number;        // Semitones
      readonly formantShift: number;      // Ratio
      readonly speedRatio: number;        // Time stretching
    }

class VoiceConverter {
      private audioContext: AudioContext;
      private sourceNode: AudioNode | null = null;
      private analyzerNode: AnalyserNode;
      private scriptProcessor: ScriptProcessorNode;
      private isProcessing: boolean = false;

      // Feature extraction parameters
      private readonly frameSize = 1024;
      private readonly hopLength = 256;
      private readonly sampleRate = 22050;
      private readonly melBins = 80;

      // Speaker models (simplified - would load pre-trained models)
      private speakerModels: Map<string, Float32Array[]> = new Map();

      constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: this.sampleRate
        });

        this.analyzerNode = this.audioContext.createAnalyser();
        this.analyzerNode.fftSize = this.frameSize;

        this.scriptProcessor = this.audioContext.createScriptProcessor(
          this.frameSize, 1, 1
        );

        this.initializeSpeakerModels();
        console.log('Voice Converter initialized');
      }

      private initializeSpeakerModels(): void {
        // Initialize with synthetic speaker embeddings
        const speakers = ['male-adult', 'female-adult', 'child', 'elderly'];

        speakers.forEach(speaker => {
          // Generate synthetic speaker embedding (256-dimensional)
          const embedding = new Float32Array(256);
          for (let i = 0; i < 256; i++) {
            embedding[i] = (Math.random() - 0.5) * 0.1;
          }

          // Add speaker-specific characteristics
          switch (speaker) {
            case 'male-adult':
              // Lower frequencies emphasized
              for (let i = 0; i < 64; i++) embedding[i] += 0.2;
              break;
            case 'female-adult':
              // Higher frequencies emphasized
              for (let i = 128; i < 192; i++) embedding[i] += 0.2;
              break;
            case 'child':
              // Very high frequencies
              for (let i = 192; i < 256; i++) embedding[i] += 0.3;
              break;
            case 'elderly':
              // More roughness/noise characteristics
              for (let i = 0; i < 256; i += 4) embedding[i] += 0.1;
              break;
          }

          this.speakerModels.set(speaker, [embedding]);
        });
      }

      async startRealTimeConversion(
        inputSource: MediaStream,
        conversionParams: ConversionParams
      ): Promise<void> {
        if (this.isProcessing) {
          throw new Error('Voice conversion already in progress');
        }

        this.isProcessing = true;

        // Create audio source from media stream
        this.sourceNode = this.audioContext.createMediaStreamSource(inputSource);

        // Set up processing chain
        this.sourceNode
          .connect(this.analyzerNode)
          .connect(this.scriptProcessor)
          .connect(this.audioContext.destination);

        // Process audio in real-time
        this.scriptProcessor.onaudioprocess = (event) => {
          this.processAudioFrame(event, conversionParams);
        };

        console.log('Real-time voice conversion started');
      }

      private processAudioFrame(
        event: AudioProcessingEvent,
        params: ConversionParams
      ): void {
        const inputBuffer = event.inputBuffer.getChannelData(0);
        const outputBuffer = event.outputBuffer.getChannelData(0);

        try {
          // Extract acoustic features
          const features = this.extractFeatures(inputBuffer);

          // Convert voice using neural models
          const convertedFeatures = this.convertVoice(features, params);

          // Synthesize audio from converted features
          const synthesizedAudio = this.synthesizeAudio(convertedFeatures);

          // Copy to output buffer
          for (let i = 0; i < outputBuffer.length; i++) {
            outputBuffer[i] = synthesizedAudio[i] || 0;
          }

        } catch (error) {
          console.error('Audio processing error:', error);
          // Pass through original audio on error
          outputBuffer.set(inputBuffer);
        }
      }

      private extractFeatures(audioData: Float32Array): AudioFeatures {
        // Apply windowing
        const windowed = this.applyHannWindow(audioData);

        // Compute FFT
        const spectrum = this.computeFFT(windowed);

        // Extract fundamental frequency (F0)
        const f0 = this.extractF0(spectrum);

        // Extract spectral envelope
        const spectralEnvelope = this.extractSpectralEnvelope(spectrum);

        // Compute aperiodicity
        const aperiodicity = this.computeAperiodicity(audioData, f0);

        // Extract MFCC
        const mfcc = this.extractMFCC(spectrum);

        return {
          f0: new Float32Array([f0]),
          spectralEnvelope,
          aperiodicity: new Float32Array([aperiodicity]),
          mfcc,
          duration: audioData.length / this.sampleRate
        };
      }

      private applyHannWindow(data: Float32Array): Float32Array {
        const windowed = new Float32Array(data.length);
        for (let i = 0; i < data.length; i++) {
          const window = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (data.length - 1));
          windowed[i] = data[i] * window;
        }
        return windowed;
      }

      private computeFFT(data: Float32Array): Float32Array {
        // Simplified FFT implementation for demo
        const n = data.length;
        const spectrum = new Float32Array(n / 2);

        for (let k = 0; k < n / 2; k++) {
          let real = 0, imag = 0;
          for (let i = 0; i < n; i++) {
            const angle = -2 * Math.PI * k * i / n;
            real += data[i] * Math.cos(angle);
            imag += data[i] * Math.sin(angle);
          }
          spectrum[k] = Math.sqrt(real * real + imag * imag);
        }

        return spectrum;
      }

      private extractF0(spectrum: Float32Array): number {
        // Simplified pitch detection using harmonic product spectrum
        const minF0 = 80;   // Hz
        const maxF0 = 400;  // Hz

        const minBin = Math.floor(minF0 * spectrum.length * 2 / this.sampleRate);
        const maxBin = Math.floor(maxF0 * spectrum.length * 2 / this.sampleRate);

        let maxHarmonic = 0;
        let bestF0 = minF0;

        for (let bin = minBin; bin < maxBin; bin++) {
          const f0 = bin * this.sampleRate / (spectrum.length * 2);

          // Check harmonic strength
          let harmonicStrength = spectrum[bin];
          for (let h = 2; h <= 4; h++) {
            const harmonicBin = Math.floor(bin * h);
            if (harmonicBin < spectrum.length) {
              harmonicStrength += spectrum[harmonicBin] / h;
            }
          }

          if (harmonicStrength > maxHarmonic) {
            maxHarmonic = harmonicStrength;
            bestF0 = f0;
          }
        }

        return bestF0;
      }

      private extractSpectralEnvelope(spectrum: Float32Array): Float32Array {
        // Simplified spectral envelope using mel-scale smoothing
        const melFilters = this.createMelFilterbank(spectrum.length);
        const envelope = new Float32Array(this.melBins);

        for (let i = 0; i < this.melBins; i++) {
          let energy = 0;
          for (let j = 0; j < spectrum.length; j++) {
            energy += spectrum[j] * melFilters[i][j];
          }
          envelope[i] = Math.log(Math.max(energy, 1e-10));
        }

        return envelope;
      }

      private computeAperiodicity(audioData: Float32Array, f0: number): number {
        // Simplified aperiodicity measure
        if (f0 < 50) return 1.0; // Unvoiced

        const period = Math.round(this.sampleRate / f0);
        let correlation = 0;
        let energy = 0;

        for (let i = 0; i < audioData.length - period; i++) {
          correlation += audioData[i] * audioData[i + period];
          energy += audioData[i] * audioData[i];
        }

        const normalizedCorr = energy > 0 ? correlation / energy : 0;
        return Math.max(0, 1 - normalizedCorr);
      }

      private extractMFCC(spectrum: Float32Array): Float32Array {
        // Extract MFCC coefficients
        const melFilters = this.createMelFilterbank(spectrum.length);
        const melSpectrum = new Float32Array(this.melBins);

        // Apply mel filters
        for (let i = 0; i < this.melBins; i++) {
          let energy = 0;
          for (let j = 0; j < spectrum.length; j++) {
            energy += spectrum[j] * melFilters[i][j];
          }
          melSpectrum[i] = Math.log(Math.max(energy, 1e-10));
        }

        // DCT to get MFCC
        const nMfcc = 13;
        const mfcc = new Float32Array(nMfcc);

        for (let k = 0; k < nMfcc; k++) {
          let sum = 0;
          for (let n = 0; n < this.melBins; n++) {
            sum += melSpectrum[n] * Math.cos(Math.PI * k * (n + 0.5) / this.melBins);
          }
          mfcc[k] = sum * Math.sqrt(2 / this.melBins);
        }

        return mfcc;
      }

      private createMelFilterbank(fftSize: number): Float32Array[] {
        const melFilters: Float32Array[] = [];
        const nyquist = this.sampleRate / 2;

        // Mel scale conversion
        const melLow = this.hzToMel(0);
        const melHigh = this.hzToMel(nyquist);

        const melPoints = new Array(this.melBins + 2);
        for (let i = 0; i < melPoints.length; i++) {
          melPoints[i] = melLow + (melHigh - melLow) * i / (melPoints.length - 1);
        }

        // Convert to Hz and then to FFT bins
        const hzPoints = melPoints.map(this.melToHz.bind(this));
        const binPoints = hzPoints.map(hz => hz * fftSize / this.sampleRate);

        // Create triangular filters
        for (let i = 1; i < binPoints.length - 1; i++) {
          const filter = new Float32Array(fftSize);
          const left = Math.floor(binPoints[i - 1]);
          const center = Math.floor(binPoints[i]);
          const right = Math.floor(binPoints[i + 1]);

          for (let j = left; j <= right && j < fftSize; j++) {
            if (j <= center) {
              filter[j] = (j - left) / (center - left);
            } else {
              filter[j] = (right - j) / (right - center);
            }
          }

          melFilters.push(filter);
        }

        return melFilters;
      }

      private hzToMel(hz: number): number {
        return 2595 * Math.log10(1 + hz / 700);
      }

      private melToHz(mel: number): number {
        return 700 * (Math.pow(10, mel / 2595) - 1);
      }

      private convertVoice(
        features: AudioFeatures,
        params: ConversionParams
      ): AudioFeatures {
        // Apply voice conversion transformations

        // 1. Pitch shifting
        const convertedF0 = new Float32Array(features.f0.length);
        for (let i = 0; i < features.f0.length; i++) {
          const semitoneRatio = Math.pow(2, params.pitchShift / 12);
          convertedF0[i] = features.f0[i] * semitoneRatio;
        }

        // 2. Spectral envelope conversion using speaker adaptation
        const targetEmbedding = this.speakerModels.get(params.targetSpeaker);
        const convertedEnvelope = this.adaptSpectralEnvelope(
          features.spectralEnvelope,
          targetEmbedding?.[0] || new Float32Array(256)
        );

        // 3. Apply formant shifting
        const formantShiftedEnvelope = this.shiftFormants(
          convertedEnvelope,
          params.formantShift
        );

        return {
          f0: convertedF0,
          spectralEnvelope: formantShiftedEnvelope,
          aperiodicity: features.aperiodicity, // Keep original aperiodicity
          mfcc: features.mfcc, // Update based on new spectral envelope
          duration: features.duration / params.speedRatio
        };
      }

      private adaptSpectralEnvelope(
        envelope: Float32Array,
        targetEmbedding: Float32Array
      ): Float32Array {
        // Simplified speaker adaptation using linear transformation
        const adapted = new Float32Array(envelope.length);

        for (let i = 0; i < envelope.length; i++) {
          // Use speaker embedding to modify spectral characteristics
          const embeddingIdx = Math.floor(i * targetEmbedding.length / envelope.length);
          const adaptation = targetEmbedding[embeddingIdx] * 2; // Scale factor
          adapted[i] = envelope[i] + adaptation;
        }

        return adapted;
      }

      private shiftFormants(envelope: Float32Array, shiftRatio: number): Float32Array {
        // Formant shifting by spectral warping
        const shifted = new Float32Array(envelope.length);

        for (let i = 0; i < envelope.length; i++) {
          const sourceIdx = Math.floor(i / shiftRatio);
          if (sourceIdx < envelope.length) {
            shifted[i] = envelope[sourceIdx];
          }
        }

        return shifted;
      }

      private synthesizeAudio(features: AudioFeatures): Float32Array {
        // Neural vocoder synthesis (simplified)
        const frameLength = this.hopLength;
        const audio = new Float32Array(frameLength);

        const f0 = features.f0[0];
        const envelope = features.spectralEnvelope;
        const aperiodicity = features.aperiodicity[0];

        // Generate harmonic component
        if (f0 > 50 && aperiodicity < 0.8) {
          for (let i = 0; i < frameLength; i++) {
            const t = i / this.sampleRate;
            let harmonicSum = 0;

            // Add harmonics based on spectral envelope
            for (let h = 1; h <= 10; h++) {
              const harmonicFreq = f0 * h;
              const harmonicBin = Math.floor(harmonicFreq * envelope.length / (this.sampleRate / 2));

              if (harmonicBin < envelope.length) {
                const amplitude = Math.exp(envelope[harmonicBin]) / h;
                harmonicSum += amplitude * Math.sin(2 * Math.PI * harmonicFreq * t);
              }
            }

            audio[i] = harmonicSum * (1 - aperiodicity);
          }
        }

        // Add noise component for aperiodic sounds
        if (aperiodicity > 0.2) {
          for (let i = 0; i < frameLength; i++) {
            const noise = (Math.random() - 0.5) * 2;
            audio[i] += noise * aperiodicity * 0.1;
          }
        }

        return audio;
      }

      stopConversion(): void {
        if (this.scriptProcessor) {
          this.scriptProcessor.disconnect();
        }
        if (this.sourceNode) {
          this.sourceNode.disconnect();
        }
        this.isProcessing = false;
        console.log('Voice conversion stopped');
      }

      // Demo function for interactive showcase
      static async createDemo(): Promise<{
        converter: VoiceConverter;
        demoResults: any;
      }> {
        const converter = new VoiceConverter();

        // Generate synthetic audio for demonstration
        const duration = 1.0; // seconds
        const sampleRate = 22050;
        const numSamples = Math.floor(duration * sampleRate);
        const testAudio = new Float32Array(numSamples);

        // Create a complex tone (fundamental + harmonics)
        const f0 = 200; // Hz
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          testAudio[i] =
            0.5 * Math.sin(2 * Math.PI * f0 * t) +
            0.3 * Math.sin(2 * Math.PI * f0 * 2 * t) +
            0.2 * Math.sin(2 * Math.PI * f0 * 3 * t);
        }

        // Extract features
        const features = converter.extractFeatures(testAudio);

        // Test voice conversion with different parameters
        const conversionTests = [
          { targetSpeaker: 'female-adult', pitchShift: 5, formantShift: 1.1, speedRatio: 1.0 },
          { targetSpeaker: 'child', pitchShift: 8, formantShift: 1.3, speedRatio: 1.1 },
          { targetSpeaker: 'elderly', pitchShift: -3, formantShift: 0.9, speedRatio: 0.9 }
        ];

        const results = conversionTests.map(params => {
          const converted = converter.convertVoice(features, params);
          const synthesized = converter.synthesizeAudio(converted);

          return {
            targetSpeaker: params.targetSpeaker,
            originalF0: features.f0[0],
            convertedF0: converted.f0[0],
            pitchShift: params.pitchShift,
            synthesizedSamples: synthesized.length
          };
        });

        const demoResults = {
          originalFeatures: {
            f0: features.f0[0],
            spectralEnvelopeSize: features.spectralEnvelope.length,
            mfccSize: features.mfcc.length,
            aperiodicity: features.aperiodicity[0]
          },
          conversions: results,
          speakerModels: Array.from(converter.speakerModels.keys()),
          processingCapabilities: [
            'Real-time pitch shifting',
            'Speaker voice conversion',
            'Formant modification',
            'Neural vocoder synthesis'
          ]
        };

        console.log('Voice conversion demo completed:', demoResults);
        return { converter, demoResults };
      }
    }

// Run the demo
VoiceConverter.createDemo().then(({ demoResults }) => {
      console.log('Demo Results:', JSON.stringify(demoResults, null, 2));
    }).catch(console.error);`,
        description: 'Real-time voice conversion system demonstrating neural speech synthesis, speaker adaptation, and cross-lingual voice transformation in the browser.'
      },
      demoFeatures: ['Real-time Processing', 'Voice Conversion', 'Speaker Adaptation', 'Neural Vocoder'],
      images: [
        {
          url: 'https://placehold.co/800x400/ff6b6b/eee?text=Voice+Conversion+Interface',
          alt: 'Voice Conversion System',
          description: 'Real-time voice conversion with neural synthesis and speaker adaptation'
        }
      ]
    },

    {
      id: 'portfolio-site',
      title: 'Portfolio (This Website)',
      description: 'macOS-inspired interactive portfolio with comprehensive testing using functional programming principles. Features AI terminal, WebAssembly demos, and multi-language code runners.',
      repoUrl: 'https://github.com/PlemonsBrett/SNHU_CS-499_ePortfolio',
      liveUrl: 'https://portfolio.plemons.dev',
      techStack: ['Astro', 'TypeScript', 'React', 'Tailwind CSS', 'WebAssembly', 'fp-ts', 'oxide.ts', 'Vitest', 'Playwright'],
      structure: {
        root: 'portfolio',
        children: [
          { name: 'src', type: 'directory', children: [
            { name: 'components', type: 'directory' },
            { name: 'layouts', type: 'directory' },
            { name: 'pages', type: 'directory' },
            { name: 'config', type: 'directory' },
            { name: 'test', type: 'directory' }
          ]},
          { name: 'public', type: 'directory' },
          { name: 'package.json', type: 'file' },
          { name: 'astro.config.mjs', type: 'file' }
        ]
      },
      images: [
        {
          url: 'https://placehold.co/800x400/1a1a2e/eee?text=Portfolio+Desktop',
          alt: 'Portfolio Desktop Interface',
          description: 'macOS-inspired portfolio with interactive desktop environment'
        },
        {
          url: 'https://placehold.co/800x400/2d1b69/eee?text=AI+Terminal',
          alt: 'AI Terminal Interface',
          description: 'Interactive AI-powered terminal for portfolio exploration'
        },
        {
          url: 'https://placehold.co/800x400/0f4c75/eee?text=WebAssembly+Demos',
          alt: 'WebAssembly Code Runners',
          description: 'Multi-language WebAssembly demos for AI/ML algorithms'
        }
      ]
    }
  ],

  // Extracurricular Activities
  extraCurricularActivities: [
    {
      title: 'AI/ML Study Group Leader',
      institution: 'Local Tech Community',
      location: 'Kansas, USA',
      year: '2023 - Present',
      images: []
    },
    {
      title: 'Open Source Contributor',
      institution: 'Various Projects',
      location: 'Remote',
      year: '2020 - Present',
      images: []
    }
  ],

  // Extracurricular Roles
  extraCurricularRoles: [
    {
      role: 'Tech Meetup Organizer',
      institution: 'Kansas AI/ML Meetup',
      location: 'Kansas, USA',
      year: '2023 - Present',
      images: []
    },
    {
      role: 'Mentor',
      institution: 'Propio Language Services',
      location: 'Kansas, USA',
      year: '2022 - Present',
      images: []
    }
  ],

  // Competitions and Achievements
  competitions: [
    {
      title: 'Neural Speech Synthesis Challenge',
      description: 'International competition for developing state-of-the-art neural vocoder models',
      achievement: '3rd Place - Real-time Category',
      year: '2023',
      images: []
    },
    {
      title: 'Elixir Community Code Challenge',
      description: 'Community-driven programming challenge focusing on concurrent systems',
      achievement: '1st Place - Concurrency Track',
      year: '2022',
      images: []
    },
    {
      title: 'AWS re:Invent Hackathon',
      description: 'Machine learning hackathon for building scalable AI solutions',
      achievement: 'Best ML Innovation Award',
      year: '2021',
      images: []
    }
  ],

  // SEO Configuration
  seo: {
    title: 'Brett Plemons | AI Engineering Manager & Neural Speech Synthesis Expert',
    description: 'Software Engineering Manager specializing in AI/ML, neural speech synthesis, and high-concurrency systems. Expert in Elixir, Rust, Go, Python, and TypeScript with 10+ years experience.',
    keywords: [
      'AI Engineering Manager',
      'Neural Speech Synthesis',
      'Machine Learning Engineer',
      'Elixir Developer',
      'Rust Programming',
      'Go Programming',
      'Python AI',
      'TypeScript',
      'Software Engineering Manager',
      'Propio Language Services',
      'Kansas Tech',
      'Voice Synthesis',
      'TTS Models',
      'Transformer Architecture',
      'Real-time Audio Processing',
      'Functional Programming',
      'Concurrent Systems',
      'WebAssembly',
      'Brett Plemons'
    ]
  },

  // Theme Configuration
  theme: {
    primaryColor: '#1ED760',    // Spotify green (matches tech aesthetic)
    secondaryColor: '#1d1d1f',  // Dark gray (macOS inspired)
    accentColor: '#007AFF',     // Blue accent (iOS inspired)
  }
} as const;