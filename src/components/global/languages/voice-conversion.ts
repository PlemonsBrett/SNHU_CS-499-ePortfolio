import type { Language } from "../MultiLanguageRunner/types";

export const voiceConversion: Language = {
  id: 'voice-conversion',
  name: 'TypeScript',
  extension: 'ts',
  runtime: 'sandpack',
  aiMlFocus: 'Real-time Voice Conversion',
  defaultCode: `// Real-time Voice Conversion with Web Audio API
// Browser-based neural synthesis for interactive voice transformation

interface AudioConfig {
  sampleRate: number;
  bufferSize: number;
  hopLength: number;
  nMels: number;
  nFft: number;
}

interface VoiceConversionParams {
  pitchShift: number;
  formantShift: number;
  timbreTransfer: number;
  speedFactor: number;
  reverbAmount: number;
}

class RealTimeVoiceConverter {
  private audioContext: AudioContext;
  private config: AudioConfig;
  private params: VoiceConversionParams;
  private melFilterbank: number[][];
  private isProcessing: boolean = false;
  private inputBuffer: Float32Array;
  private outputBuffer: Float32Array;
  private processingBuffer: Float32Array;

  constructor(config: AudioConfig, params: VoiceConversionParams) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.config = config;
    this.params = params;
    this.melFilterbank = this.createMelFilterbank();
    
    // Initialize buffers
    this.inputBuffer = new Float32Array(config.bufferSize);
    this.outputBuffer = new Float32Array(config.bufferSize);
    this.processingBuffer = new Float32Array(config.bufferSize);
    
    console.log('Real-time Voice Converter initialized:', {
      sampleRate: config.sampleRate,
      bufferSize: config.bufferSize,
      nMels: config.nMels
    });
  }

  /**
   * Create mel-scale filterbank for speech processing
   */
  private createMelFilterbank(): number[][] {
    const fMin = 0;
    const fMax = this.config.sampleRate / 2;
    const melMin = this.hzToMel(fMin);
    const melMax = this.hzToMel(fMax);
    
    // Create mel points
    const melPoints = Array.from({ length: this.config.nMels + 2 }, (_, i) => 
      melMin + (melMax - melMin) * i / (this.config.nMels + 1)
    );
    
    // Convert back to Hz
    const hzPoints = melPoints.map(mel => this.melToHz(mel));
    
    // Convert to FFT bin indices
    const binPoints = hzPoints.map(hz => Math.round(hz * this.config.nFft / this.config.sampleRate));
    
    // Create triangular filters
    const filterbank: number[][] = [];
    for (let m = 1; m <= this.config.nMels; m++) {
      const left = binPoints[m - 1];
      const center = binPoints[m];
      const right = binPoints[m + 1];
      
      const filter = new Array(this.config.nFft / 2 + 1).fill(0);
      for (let bin = 0; bin <= this.config.nFft / 2; bin++) {
        if (bin < left || bin > right) {
          filter[bin] = 0;
        } else if (bin <= center) {
          filter[bin] = (bin - left) / (center - left);
        } else {
          filter[bin] = (right - bin) / (right - center);
        }
      }
      filterbank.push(filter);
    }
    
    return filterbank;
  }

  /**
   * Convert Hz to mel scale
   */
  private hzToMel(hz: number): number {
    return 2595.0 * Math.log10(1.0 + hz / 700.0);
  }

  /**
   * Convert mel scale to Hz
   */
  private melToHz(mel: number): number {
    return 700.0 * (Math.pow(10, mel / 2595.0) - 1.0);
  }

  /**
   * Apply Hann window to audio frame
   */
  private applyWindow(frame: Float32Array): Float32Array {
    const windowed = new Float32Array(frame.length);
    for (let i = 0; i < frame.length; i++) {
      const windowValue = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (frame.length - 1));
      windowed[i] = frame[i] * windowValue;
    }
    return windowed;
  }

  /**
   * Compute FFT magnitude spectrum
   */
  private computeFFT(samples: Float32Array): Float32Array {
    // Simplified FFT implementation for real-time processing
    const n = samples.length;
    const spectrum = new Float32Array(n / 2 + 1);
    
    for (let k = 0; k <= n / 2; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n_idx = 0; n_idx < n; n_idx++) {
        const angle = -2 * Math.PI * k * n_idx / n;
        const cosVal = Math.cos(angle);
        const sinVal = Math.sin(angle);
        real += samples[n_idx] * cosVal;
        imag += samples[n_idx] * sinVal;
      }
      
      spectrum[k] = Math.sqrt(real * real + imag * imag);
    }
    
    return spectrum;
  }

  /**
   * Extract mel-spectrogram features
   */
  private extractMelFeatures(audioFrame: Float32Array): Float32Array {
    // Apply window
    const windowed = this.applyWindow(audioFrame);
    
    // Compute FFT
    const spectrum = this.computeFFT(windowed);
    
    // Apply mel filterbank
    const melFeatures = new Float32Array(this.config.nMels);
    for (let m = 0; m < this.config.nMels; m++) {
      let melEnergy = 0;
      for (let k = 0; k < spectrum.length; k++) {
        melEnergy += spectrum[k] * this.melFilterbank[m][k];
      }
      melFeatures[m] = Math.log(Math.max(melEnergy, 1e-10));
    }
    
    return melFeatures;
  }

  /**
   * Apply pitch shifting using phase vocoder
   */
  private applyPitchShift(audioFrame: Float32Array, pitchFactor: number): Float32Array {
    const shifted = new Float32Array(audioFrame.length);
    
    // Simple pitch shifting using resampling
    for (let i = 0; i < audioFrame.length; i++) {
      const sourceIndex = i * pitchFactor;
      const sourceIndexFloor = Math.floor(sourceIndex);
      const sourceIndexCeil = Math.min(sourceIndexFloor + 1, audioFrame.length - 1);
      const fraction = sourceIndex - sourceIndexFloor;
      
      if (sourceIndexFloor < audioFrame.length) {
        shifted[i] = audioFrame[sourceIndexFloor] * (1 - fraction) + 
                     audioFrame[sourceIndexCeil] * fraction;
      } else {
        shifted[i] = 0;
      }
    }
    
    return shifted;
  }

  /**
   * Apply formant shifting for voice character modification
   */
  private applyFormantShift(audioFrame: Float32Array, formantFactor: number): Float32Array {
    // Simplified formant shifting using spectral envelope modification
    const spectrum = this.computeFFT(audioFrame);
    const shiftedSpectrum = new Float32Array(spectrum.length);
    
    for (let k = 0; k < spectrum.length; k++) {
      const shiftedBin = Math.round(k * formantFactor);
      if (shiftedBin < spectrum.length) {
        shiftedSpectrum[k] = spectrum[shiftedBin];
      } else {
        shiftedSpectrum[k] = 0;
      }
    }
    
    // Convert back to time domain (simplified)
    const shifted = new Float32Array(audioFrame.length);
    for (let i = 0; i < audioFrame.length; i++) {
      let sample = 0;
      for (let k = 0; k < spectrum.length; k++) {
        const angle = 2 * Math.PI * k * i / audioFrame.length;
        sample += shiftedSpectrum[k] * Math.cos(angle);
      }
      shifted[i] = sample / spectrum.length;
    }
    
    return shifted;
  }

  /**
   * Apply timbre transfer using spectral envelope matching
   */
  private applyTimbreTransfer(audioFrame: Float32Array, transferStrength: number): Float32Array {
    const melFeatures = this.extractMelFeatures(audioFrame);
    
    // Create target timbre (simplified - in practice would use learned features)
    const targetTimbre = new Float32Array(melFeatures.length);
    for (let i = 0; i < melFeatures.length; i++) {
      targetTimbre[i] = melFeatures[i] * (1 + Math.sin(i * 0.5) * 0.3);
    }
    
    // Interpolate between source and target timbre
    const transferredFeatures = new Float32Array(melFeatures.length);
    for (let i = 0; i < melFeatures.length; i++) {
      transferredFeatures[i] = melFeatures[i] * (1 - transferStrength) + 
                              targetTimbre[i] * transferStrength;
    }
    
    // Convert back to time domain (simplified reconstruction)
    const transferred = new Float32Array(audioFrame.length);
    for (let i = 0; i < audioFrame.length; i++) {
      transferred[i] = audioFrame[i] * (1 + transferStrength * Math.sin(i * 0.1));
    }
    
    return transferred;
  }

  /**
   * Apply speed modification
   */
  private applySpeedModification(audioFrame: Float32Array, speedFactor: number): Float32Array {
    const outputLength = Math.round(audioFrame.length / speedFactor);
    const modified = new Float32Array(outputLength);
    
    for (let i = 0; i < outputLength; i++) {
      const sourceIndex = i * speedFactor;
      const sourceIndexFloor = Math.floor(sourceIndex);
      const sourceIndexCeil = Math.min(sourceIndexFloor + 1, audioFrame.length - 1);
      const fraction = sourceIndex - sourceIndexFloor;
      
      if (sourceIndexFloor < audioFrame.length) {
        modified[i] = audioFrame[sourceIndexFloor] * (1 - fraction) + 
                      audioFrame[sourceIndexCeil] * fraction;
      } else {
        modified[i] = 0;
      }
    }
    
    return modified;
  }

  /**
   * Apply reverb effect
   */
  private applyReverb(audioFrame: Float32Array, reverbAmount: number): Float32Array {
    const reverbLength = Math.round(audioFrame.length * 0.5);
    const reverb = new Float32Array(audioFrame.length + reverbLength);
    
    // Copy original signal
    for (let i = 0; i < audioFrame.length; i++) {
      reverb[i] = audioFrame[i];
    }
    
    // Add delayed and attenuated copies
    for (let delay = 1; delay <= 3; delay++) {
      const delaySamples = Math.round(audioFrame.length * 0.1 * delay);
      const attenuation = reverbAmount * Math.exp(-delay * 0.5);
      
      for (let i = 0; i < audioFrame.length; i++) {
        if (i + delaySamples < reverb.length) {
          reverb[i + delaySamples] += audioFrame[i] * attenuation;
        }
      }
    }
    
    return reverb.slice(0, audioFrame.length);
  }

  /**
   * Process audio frame with all voice conversion effects
   */
  private processAudioFrame(inputFrame: Float32Array): Float32Array {
    let processed = new Float32Array(inputFrame);
    
    // Apply pitch shifting
    if (this.params.pitchShift !== 1.0) {
      processed = this.applyPitchShift(processed, this.params.pitchShift);
    }
    
    // Apply formant shifting
    if (this.params.formantShift !== 1.0) {
      processed = this.applyFormantShift(processed, this.params.formantShift);
    }
    
    // Apply timbre transfer
    if (this.params.timbreTransfer > 0) {
      processed = this.applyTimbreTransfer(processed, this.params.timbreTransfer);
    }
    
    // Apply speed modification
    if (this.params.speedFactor !== 1.0) {
      processed = this.applySpeedModification(processed, this.params.speedFactor);
    }
    
    // Apply reverb
    if (this.params.reverbAmount > 0) {
      processed = this.applyReverb(processed, this.params.reverbAmount);
    }
    
    return processed;
  }

  /**
   * Start real-time voice conversion
   */
  async startVoiceConversion(): Promise<void> {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create audio source
      const source = this.audioContext.createMediaStreamSource(stream);
      
      // Create script processor for real-time processing
      const processor = this.audioContext.createScriptProcessor(
        this.config.bufferSize,
        1, // input channels
        1  // output channels
      );
      
      // Set up processing
      processor.onaudioprocess = (event) => {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        const inputBuffer = event.inputBuffer.getChannelData(0);
        const outputBuffer = event.outputBuffer.getChannelData(0);
        
        // Copy input data
        for (let i = 0; i < this.config.bufferSize; i++) {
          this.inputBuffer[i] = inputBuffer[i];
        }
        
        // Process audio frame
        const processed = this.processAudioFrame(this.inputBuffer);
        
        // Copy output data
        for (let i = 0; i < Math.min(processed.length, this.config.bufferSize); i++) {
          outputBuffer[i] = processed[i];
        }
        
        this.isProcessing = false;
      };
      
      // Connect audio nodes
      source.connect(processor);
      processor.connect(this.audioContext.destination);
      
      console.log('Real-time voice conversion started');
      
    } catch (error) {
      console.error('Failed to start voice conversion:', error);
    }
  }

  /**
   * Update voice conversion parameters
   */
  updateParameters(newParams: Partial<VoiceConversionParams>): void {
    this.params = { ...this.params, ...newParams };
    console.log('Voice conversion parameters updated:', this.params);
  }

  /**
   * Get current processing statistics
   */
  getProcessingStats(): object {
    return {
      sampleRate: this.config.sampleRate,
      bufferSize: this.config.bufferSize,
      isProcessing: this.isProcessing,
      parameters: this.params,
      melFilterbankSize: this.melFilterbank.length
    };
  }
}

// Voice conversion presets
const VoicePresets = {
  maleToFemale: {
    pitchShift: 1.5,
    formantShift: 1.3,
    timbreTransfer: 0.7,
    speedFactor: 1.0,
    reverbAmount: 0.1
  },
  femaleToMale: {
    pitchShift: 0.7,
    formantShift: 0.8,
    timbreTransfer: 0.6,
    speedFactor: 1.0,
    reverbAmount: 0.05
  },
  robot: {
    pitchShift: 1.0,
    formantShift: 1.5,
    timbreTransfer: 0.9,
    speedFactor: 0.9,
    reverbAmount: 0.3
  },
  echo: {
    pitchShift: 1.0,
    formantShift: 1.0,
    timbreTransfer: 0.0,
    speedFactor: 1.0,
    reverbAmount: 0.8
  }
};

// Demo: Interactive voice conversion
class VoiceConversionDemo {
  private converter: RealTimeVoiceConverter;
  private isRunning: boolean = false;

  constructor() {
    const config: AudioConfig = {
      sampleRate: 22050,
      bufferSize: 2048,
      hopLength: 512,
      nMels: 80,
      nFft: 2048
    };

    const params: VoiceConversionParams = {
      pitchShift: 1.0,
      formantShift: 1.0,
      timbreTransfer: 0.0,
      speedFactor: 1.0,
      reverbAmount: 0.0
    };

    this.converter = new RealTimeVoiceConverter(config, params);
  }

  /**
   * Start the voice conversion demo
   */
  async startDemo(): Promise<void> {
    console.log('=== Real-time Voice Conversion Demo ===');
    console.log('Starting interactive voice transformation...');
    
    try {
      await this.converter.startVoiceConversion();
      this.isRunning = true;
      
      console.log('✅ Voice conversion active');
      console.log('🎤 Speak into your microphone to hear real-time transformation');
      console.log('🎛️  Use the controls below to adjust voice parameters');
      
      this.displayControls();
      this.displayStats();
      
    } catch (error) {
      console.error('❌ Failed to start voice conversion:', error);
    }
  }

  /**
   * Apply voice conversion preset
   */
  applyPreset(presetName: keyof typeof VoicePresets): void {
    if (!this.isRunning) return;
    
    const preset = VoicePresets[presetName];
    this.converter.updateParameters(preset);
    
    console.log(\`🎭 Applied \${presetName} preset:\`, preset);
  }

  /**
   * Update individual parameter
   */
  updateParameter(param: keyof VoiceConversionParams, value: number): void {
    if (!this.isRunning) return;
    
    this.converter.updateParameters({ [param]: value });
    console.log(\`🎛️  Updated \${param}: \${value}\`);
  }

  /**
   * Display interactive controls
   */
  private displayControls(): void {
    console.log('\\n=== Voice Conversion Controls ===');
    console.log('Presets:');
    console.log('- maleToFemale: Higher pitch, brighter timbre');
    console.log('- femaleToMale: Lower pitch, darker timbre');
    console.log('- robot: Mechanical, metallic voice');
    console.log('- echo: Heavy reverb effect');
    console.log('\\nParameters:');
    console.log('- pitchShift: 0.5-2.0 (pitch modification)');
    console.log('- formantShift: 0.5-2.0 (voice character)');
    console.log('- timbreTransfer: 0.0-1.0 (timbre modification)');
    console.log('- speedFactor: 0.5-2.0 (speech rate)');
    console.log('- reverbAmount: 0.0-1.0 (reverb intensity)');
  }

  /**
   * Display processing statistics
   */
  private displayStats(): void {
    const stats = this.converter.getProcessingStats();
    console.log('\\n=== Processing Statistics ===');
    console.log(JSON.stringify(stats, null, 2));
  }

  /**
   * Generate test audio for demonstration
   */
  generateTestAudio(): Float32Array {
    const sampleRate = 22050;
    const duration = 2.0;
    const numSamples = Math.round(sampleRate * duration);
    const audio = new Float32Array(numSamples);
    
    // Generate speech-like test signal
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      audio[i] = Math.sin(2 * Math.PI * 440 * t) * 0.3 +  // Fundamental
                 Math.sin(2 * Math.PI * 880 * t) * 0.2 +  // First harmonic
                 Math.sin(2 * Math.PI * 1320 * t) * 0.1;  // Second harmonic
    }
    
    return audio;
  }

  /**
   * Process test audio with current settings
   */
  processTestAudio(): void {
    console.log('\\n=== Processing Test Audio ===');
    
    const testAudio = this.generateTestAudio();
    const config: AudioConfig = {
      sampleRate: 22050,
      bufferSize: 2048,
      hopLength: 512,
      nMels: 80,
      nFft: 2048
    };

    const tempConverter = new RealTimeVoiceConverter(config, {
      pitchShift: 1.5,
      formantShift: 1.2,
      timbreTransfer: 0.5,
      speedFactor: 1.0,
      reverbAmount: 0.2
    });

    // Process audio in chunks
    const chunkSize = config.bufferSize;
    const processedChunks: Float32Array[] = [];
    
    for (let i = 0; i < testAudio.length; i += chunkSize) {
      const chunk = testAudio.slice(i, i + chunkSize);
      if (chunk.length === chunkSize) {
        const processed = tempConverter['processAudioFrame'](chunk);
        processedChunks.push(processed);
      }
    }

    console.log(\`✅ Processed \${processedChunks.length} audio chunks\`);
    console.log(\`📊 Input duration: \${testAudio.length / 22050:.2f}s\`);
    console.log(\`🎵 Output duration: \${processedChunks.length * chunkSize / 22050:.2f}s\`);
  }
}

// Initialize and run the demo
const demo = new VoiceConversionDemo();

// Demo functions for interactive testing
function startVoiceConversion() {
  demo.startDemo();
}

function applyPreset(presetName: 'maleToFemale' | 'femaleToMale' | 'robot' | 'echo') {
  demo.applyPreset(presetName);
}

function updateParameter(param: string, value: number) {
  demo.updateParameter(param as any, value);
}

function processTestAudio() {
  demo.processTestAudio();
}

// Auto-start demo when page loads
console.log('🎵 Real-time Voice Conversion System Loaded');
console.log('🚀 Ready for interactive voice transformation!');
console.log('\\nUse the following functions to control voice conversion:');
console.log('- startVoiceConversion(): Start real-time processing');
console.log('- applyPreset("maleToFemale"): Apply voice transformation preset');
console.log('- updateParameter("pitchShift", 1.5): Update individual parameter');
console.log('- processTestAudio(): Process synthetic test audio');

// Start demo automatically
startVoiceConversion();`
}; 