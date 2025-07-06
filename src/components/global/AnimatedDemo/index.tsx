import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaPlay, FaPause, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import DraggableWindow from '../DraggableWindow';
import type { AnimatedDemoProps } from './props';

const AnimatedDemo: React.FC<AnimatedDemoProps> = ({ 
  projectTitle, 
  projectType, 
  repositoryUrl, 
  demoUrl,
  onClose 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const demoConfig = getDemoConfig(projectType);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            setIsPlaying(false);
            setProgress(0);
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (canvasRef.current && isPlaying) {
      animateDemo(canvasRef.current, projectType, progress);
    }
  }, [projectType, progress, isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setProgress(0);
    } else {
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setProgress((step / demoConfig.steps.length) * 100);
  };

  	const demoContent = (
		<DraggableWindow
			title={`Interactive Demo: ${projectTitle}`}
			onClose={onClose}
			initialPosition={{
				x: Math.floor(window.innerWidth * 0.2),
				y: Math.floor(window.innerHeight * 0.2),
			}}
			initialSize={{ width: 1000, height: 800 }}
			className="w-[95vw] md:max-w-6xl max-h-[95vh]"
		>
			<div className="p-6 overflow-y-auto h-full">
				<div className="mb-6">
					<p className="text-gray-300">
						{demoConfig.description}
					</p>
				</div>

        {/* Demo Canvas */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-auto border border-gray-600 rounded"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={handlePlayPause}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white transition-colors`}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
            {isPlaying ? 'Pause' : 'Play'} Demo
          </button>

          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-gray-300 text-sm">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Steps */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Process Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {demoConfig.steps.map((step, index) => (
              <button
                key={`step-${index}-${step.title}`}
                type="button"
                onClick={() => handleStepChange(index)}
                className={`text-left p-3 rounded transition-colors ${
                  currentStep === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="font-medium">{step.title}</div>
                <div className="text-sm opacity-75">{step.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Technical Details</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {demoConfig.technicalDetails.map((detail, index) => (
                <div key={`detail-${index}-${detail.label}`} className="text-center">
                  <div className="text-blue-400 font-medium">{detail.value}</div>
                  <div className="text-gray-400">{detail.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {repositoryUrl && (
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              <FaGithub />
              View Repository
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <FaExternalLinkAlt />
              Live Demo
            </a>
          )}
        </div>
			</div>
		</DraggableWindow>
	);

	return createPortal(demoContent, document.body);
};

function getDemoConfig(projectType: string) {
  const configs = {
    'rust-neural-vocoder': {
      description: 'High-performance neural speech synthesis using Rust and WebAssembly',
      steps: [
        { title: 'Audio Input', description: 'Process mel-spectrogram input' },
        { title: 'Neural Network', description: 'WaveNet-style autoregressive generation' },
        { title: 'Attention Mechanism', description: 'Multi-head attention for conditioning' },
        { title: 'Audio Synthesis', description: 'Generate high-quality audio output' }
      ],
      technicalDetails: [
        { label: 'Language', value: 'Rust' },
        { label: 'Architecture', value: 'WaveNet' },
        { label: 'Latency', value: '< 100ms' },
        { label: 'Quality', value: 'MOS > 4.0' }
      ]
    },
    'go-attention-mechanism': {
      description: 'Concurrent multi-head attention computation using Go and WebAssembly',
      steps: [
        { title: 'Input Processing', description: 'Tokenize and embed input sequence' },
        { title: 'Multi-Head Attention', description: 'Parallel attention computation' },
        { title: 'Concurrent Processing', description: 'Goroutine-based parallelization' },
        { title: 'Output Generation', description: 'Generate attention-weighted output' }
      ],
      technicalDetails: [
        { label: 'Language', value: 'Go' },
        { label: 'Concurrency', value: 'Goroutines' },
        { label: 'Performance', value: '< 50ms' },
        { label: 'Scalability', value: 'Linear' }
      ]
    },
    'scala-acoustic-modeling': {
      description: 'Functional programming approach to acoustic feature extraction',
      steps: [
        { title: 'Signal Processing', description: 'Preprocess audio signal' },
        { title: 'Feature Extraction', description: 'Extract MFCC features' },
        { title: 'Functional Pipeline', description: 'Immutable data transformations' },
        { title: 'Model Training', description: 'Train acoustic models' }
      ],
      technicalDetails: [
        { label: 'Language', value: 'Scala' },
        { label: 'Paradigm', value: 'Functional' },
        { label: 'Type Safety', value: 'High' },
        { label: 'Memory', value: 'Optimized' }
      ]
    },
    'python-nlp-embeddings': {
      description: 'Transformer-based natural language processing with Pyodide',
      steps: [
        { title: 'Text Tokenization', description: 'Convert text to tokens' },
        { title: 'Embedding Generation', description: 'Create transformer embeddings' },
        { title: 'Attention Processing', description: 'Apply multi-head attention' },
        { title: 'Output Generation', description: 'Generate contextual embeddings' }
      ],
      technicalDetails: [
        { label: 'Language', value: 'Python' },
        { label: 'Runtime', value: 'Pyodide' },
        { label: 'Model', value: 'Transformer' },
        { label: 'Embeddings', value: '768D' }
      ]
    },
    'elixir-mel-spectrogram': {
      description: 'Concurrent mel-spectrogram computation using Elixir and BEAM VM',
      steps: [
        { title: 'Audio Framing', description: 'Frame audio into windows' },
        { title: 'FFT Computation', description: 'Compute Fast Fourier Transform' },
        { title: 'Mel Filter Bank', description: 'Apply mel-scale filter bank' },
        { title: 'Log Transformation', description: 'Apply log transformation' }
      ],
      technicalDetails: [
        { label: 'Language', value: 'Elixir' },
        { label: 'Concurrency', value: 'Actors' },
        { label: 'Fault Tolerance', value: 'High' },
        { label: 'Performance', value: '< 50ms' }
      ]
    },
    'typescript-voice-conversion': {
      description: 'Real-time neural voice conversion with Web Audio API',
      steps: [
        { title: 'Audio Capture', description: 'Capture real-time audio input' },
        { title: 'Feature Extraction', description: 'Extract voice features' },
        { title: 'Neural Conversion', description: 'Apply voice conversion model' },
        { title: 'Audio Synthesis', description: 'Synthesize converted audio' }
      ],
      technicalDetails: [
        { label: 'Language', value: 'TypeScript' },
        { label: 'Real-time', value: 'Yes' },
        { label: 'Latency', value: '< 100ms' },
        { label: 'Quality', value: 'High-fidelity' }
      ]
    }
  };

  return configs[projectType as keyof typeof configs] || configs['rust-neural-vocoder'];
}

function animateDemo(canvas: HTMLCanvasElement, projectType: string, progress: number) {
  const ctx = canvas.getContext('2d')!;
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(0, 0, width, height);

  // Draw based on project type and progress
  switch (projectType) {
    case 'rust-neural-vocoder':
      animateNeuralVocoder(ctx, width, height, progress);
      break;
    case 'go-attention-mechanism':
      animateAttentionMechanism(ctx, width, height, progress);
      break;
    case 'scala-acoustic-modeling':
      animateAcousticModeling(ctx, width, height, progress);
      break;
    case 'python-nlp-embeddings':
      animateNLPEmbeddings(ctx, width, height, progress);
      break;
    case 'elixir-mel-spectrogram':
      animateMelSpectrogram(ctx, width, height, progress);
      break;
    case 'typescript-voice-conversion':
      animateVoiceConversion(ctx, width, height, progress);
      break;
    default:
      animateNeuralVocoder(ctx, width, height, progress);
  }
}

function animateNeuralVocoder(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  // Draw mel-spectrogram input
  const melWidth = width * 0.3;
  const melHeight = height * 0.4;
  const melX = width * 0.1;
  const melY = height * 0.3;

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(melX, melY, melWidth, melHeight);

  // Draw frequency bins
  const numBins = 80;
  const binHeight = melHeight / numBins;
  for (let i = 0; i < numBins; i++) {
    const intensity = Math.sin((progress / 100) * Math.PI + i * 0.1) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(59, 130, 246, ${intensity})`;
    ctx.fillRect(melX, melY + i * binHeight, melWidth, binHeight);
  }

  // Draw neural network
  const nnX = width * 0.5;
  const nnY = height * 0.2;
  const nnWidth = width * 0.3;
  const nnHeight = height * 0.6;

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.strokeRect(nnX, nnY, nnWidth, nnHeight);

  // Draw layers
  const layers = 5;
  const layerWidth = nnWidth / layers;
  for (let i = 0; i < layers; i++) {
    const layerX = nnX + i * layerWidth;
    const layerHeight = nnHeight * (0.3 + 0.4 * Math.sin((progress / 100) * Math.PI + i * 0.5));
    const layerY = nnY + (nnHeight - layerHeight) / 2;

    ctx.fillStyle = '#10b981';
    ctx.fillRect(layerX + 10, layerY, layerWidth - 20, layerHeight);
  }

  // Draw audio output
  const audioX = width * 0.85;
  const audioY = height * 0.3;
  const audioWidth = width * 0.1;
  const audioHeight = height * 0.4;

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(audioX, audioY, audioWidth, audioHeight);

  // Draw waveform
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < audioWidth; i++) {
    const x = audioX + i;
    const y = audioY + audioHeight / 2 + Math.sin((progress / 100) * Math.PI * 4 + i * 0.1) * 20;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Draw arrows
  drawArrow(ctx, melX + melWidth, melY + melHeight / 2, nnX, nnY + nnHeight / 2, progress > 25);
  drawArrow(ctx, nnX + nnWidth, nnY + nnHeight / 2, audioX, audioY + audioHeight / 2, progress > 75);
}

function animateAttentionMechanism(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  // Draw input sequence
  const seqWidth = width * 0.2;
  const seqHeight = height * 0.6;
  const seqX = width * 0.1;
  const seqY = height * 0.2;

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(seqX, seqY, seqWidth, seqHeight);

  // Draw tokens
  const numTokens = 8;
  const tokenHeight = seqHeight / numTokens;
  for (let i = 0; i < numTokens; i++) {
    const tokenY = seqY + i * tokenHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(seqX + 10, tokenY + 5, seqWidth - 20, tokenHeight - 10);
  }

  // Draw attention heads
  const headsX = width * 0.4;
  const headsY = height * 0.1;
  const headsWidth = width * 0.4;
  const headsHeight = height * 0.8;

  const numHeads = 8;
  const headHeight = headsHeight / numHeads;
  for (let i = 0; i < numHeads; i++) {
    const headY = headsY + i * headHeight;
    const intensity = Math.sin((progress / 100) * Math.PI + i * 0.5) * 0.5 + 0.5;
    
    ctx.fillStyle = `rgba(16, 185, 129, ${intensity})`;
    ctx.fillRect(headsX, headY + 5, headsWidth, headHeight - 10);

    // Draw attention weights
    for (let j = 0; j < numTokens; j++) {
      const weight = Math.sin((progress / 100) * Math.PI + i * 0.3 + j * 0.2) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${weight})`;
      ctx.fillRect(headsX + j * (headsWidth / numTokens), headY + 10, headsWidth / numTokens - 2, headHeight - 20);
    }
  }

  // Draw output
  const outputX = width * 0.85;
  const outputY = height * 0.2;
  const outputWidth = width * 0.1;
  const outputHeight = height * 0.6;

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(outputX, outputY, outputWidth, outputHeight);

  // Draw arrows
  drawArrow(ctx, seqX + seqWidth, seqY + seqHeight / 2, headsX, headsY + headsHeight / 2, progress > 25);
  drawArrow(ctx, headsX + headsWidth, headsY + headsHeight / 2, outputX, outputY + outputHeight / 2, progress > 75);
}

function animateAcousticModeling(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  // Draw audio input
  const audioX = width * 0.1;
  const audioY = height * 0.3;
  const audioWidth = width * 0.2;
  const audioHeight = height * 0.4;

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(audioX, audioY, audioWidth, audioHeight);

  // Draw waveform
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < audioWidth; i++) {
    const x = audioX + i;
    const y = audioY + audioHeight / 2 + Math.sin((progress / 100) * Math.PI * 2 + i * 0.1) * 30;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Draw feature extraction
  const featuresX = width * 0.4;
  const featuresY = height * 0.2;
  const featuresWidth = width * 0.3;
  const featuresHeight = height * 0.6;

  ctx.fillStyle = '#10b981';
  ctx.fillRect(featuresX, featuresY, featuresWidth, featuresHeight);

  // Draw MFCC features
  const numFeatures = 13;
  const featureWidth = featuresWidth / numFeatures;
  for (let i = 0; i < numFeatures; i++) {
    const featureX = featuresX + i * featureWidth;
    const intensity = Math.sin((progress / 100) * Math.PI + i * 0.3) * 0.5 + 0.5;
    const featureHeight = featuresHeight * intensity;
    const featureY = featuresY + (featuresHeight - featureHeight) / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(featureX + 2, featureY, featureWidth - 4, featureHeight);
  }

  // Draw model
  const modelX = width * 0.8;
  const modelY = height * 0.2;
  const modelWidth = width * 0.15;
  const modelHeight = height * 0.6;

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(modelX, modelY, modelWidth, modelHeight);

  // Draw functional pipeline
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(modelX + 10, modelY + 10, modelWidth - 20, modelHeight - 20);

  // Draw arrows
  drawArrow(ctx, audioX + audioWidth, audioY + audioHeight / 2, featuresX, featuresY + featuresHeight / 2, progress > 25);
  drawArrow(ctx, featuresX + featuresWidth, featuresY + featuresHeight / 2, modelX, modelY + modelHeight / 2, progress > 75);
}

function animateNLPEmbeddings(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  // Draw text input
  const textX = width * 0.1;
  const textY = height * 0.3;
  const textWidth = width * 0.2;
  const textHeight = height * 0.4;

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(textX, textY, textWidth, textHeight);

  // Draw words
  const words = ['Hello', 'World', 'NLP'];
  const wordHeight = textHeight / words.length;
  for (let i = 0; i < words.length; i++) {
    const wordY = textY + i * wordHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(textX + 10, wordY + 10, textWidth - 20, wordHeight - 20);
  }

  // Draw transformer
  const transformerX = width * 0.4;
  const transformerY = height * 0.1;
  const transformerWidth = width * 0.4;
  const transformerHeight = height * 0.8;

  ctx.fillStyle = '#10b981';
  ctx.fillRect(transformerX, transformerY, transformerWidth, transformerHeight);

  // Draw attention layers
  const layers = 6;
  const layerHeight = transformerHeight / layers;
  for (let i = 0; i < layers; i++) {
    const layerY = transformerY + i * layerHeight;
    const intensity = Math.sin((progress / 100) * Math.PI + i * 0.5) * 0.5 + 0.5;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
    ctx.fillRect(transformerX + 10, layerY + 5, transformerWidth - 20, layerHeight - 10);
  }

  // Draw embeddings
  const embeddingsX = width * 0.85;
  const embeddingsY = height * 0.2;
  const embeddingsWidth = width * 0.1;
  const embeddingsHeight = height * 0.6;

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(embeddingsX, embeddingsY, embeddingsWidth, embeddingsHeight);

  // Draw embedding vectors
  const numVectors = 768;
  const vectorWidth = embeddingsWidth / Math.sqrt(numVectors);
  const vectorHeight = embeddingsHeight / Math.sqrt(numVectors);
  for (let i = 0; i < Math.sqrt(numVectors); i++) {
    for (let j = 0; j < Math.sqrt(numVectors); j++) {
      const intensity = Math.sin((progress / 100) * Math.PI + i * 0.1 + j * 0.1) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
      ctx.fillRect(
        embeddingsX + i * vectorWidth,
        embeddingsY + j * vectorHeight,
        vectorWidth - 1,
        vectorHeight - 1
      );
    }
  }

  // Draw arrows
  drawArrow(ctx, textX + textWidth, textY + textHeight / 2, transformerX, transformerY + transformerHeight / 2, progress > 25);
  drawArrow(ctx, transformerX + transformerWidth, transformerY + transformerHeight / 2, embeddingsX, embeddingsY + embeddingsHeight / 2, progress > 75);
}

function animateMelSpectrogram(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  // Draw audio input
  const audioX = width * 0.1;
  const audioY = height * 0.3;
  const audioWidth = width * 0.2;
  const audioHeight = height * 0.4;

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(audioX, audioY, audioWidth, audioHeight);

  // Draw waveform
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < audioWidth; i++) {
    const x = audioX + i;
    const y = audioY + audioHeight / 2 + Math.sin((progress / 100) * Math.PI * 3 + i * 0.1) * 25;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Draw FFT processing
  const fftX = width * 0.4;
  const fftY = height * 0.2;
  const fftWidth = width * 0.25;
  const fftHeight = height * 0.6;

  ctx.fillStyle = '#10b981';
  ctx.fillRect(fftX, fftY, fftWidth, fftHeight);

  // Draw frequency bins
  const numBins = 512;
  const binWidth = fftWidth / numBins;
  for (let i = 0; i < numBins; i++) {
    const binX = fftX + i * binWidth;
    const intensity = Math.sin((progress / 100) * Math.PI + i * 0.01) * 0.5 + 0.5;
    const binHeight = fftHeight * intensity;
    const binY = fftY + (fftHeight - binHeight) / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(binX, binY, binWidth - 1, binHeight);
  }

  // Draw mel filter bank
  const melX = width * 0.7;
  const melY = height * 0.2;
  const melWidth = width * 0.25;
  const melHeight = height * 0.6;

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(melX, melY, melWidth, melHeight);

  // Draw mel bins
  const numMelBins = 80;
  const melBinHeight = melHeight / numMelBins;
  for (let i = 0; i < numMelBins; i++) {
    const melBinY = melY + i * melBinHeight;
    const intensity = Math.sin((progress / 100) * Math.PI + i * 0.1) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
    ctx.fillRect(melX + 5, melBinY + 2, melWidth - 10, melBinHeight - 4);
  }

  // Draw arrows
  drawArrow(ctx, audioX + audioWidth, audioY + audioHeight / 2, fftX, fftY + fftHeight / 2, progress > 25);
  drawArrow(ctx, fftX + fftWidth, fftY + fftHeight / 2, melX, melY + melHeight / 2, progress > 75);
}

function animateVoiceConversion(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
  // Draw source voice
  const sourceX = width * 0.1;
  const sourceY = height * 0.2;
  const sourceWidth = width * 0.15;
  const sourceHeight = height * 0.6;

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(sourceX, sourceY, sourceWidth, sourceHeight);

  // Draw source waveform
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < sourceWidth; i++) {
    const x = sourceX + i;
    const y = sourceY + sourceHeight / 2 + Math.sin((progress / 100) * Math.PI * 2 + i * 0.1) * 20;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Draw neural network
  const nnX = width * 0.35;
  const nnY = height * 0.1;
  const nnWidth = width * 0.3;
  const nnHeight = height * 0.8;

  ctx.fillStyle = '#10b981';
  ctx.fillRect(nnX, nnY, nnWidth, nnHeight);

  // Draw conversion layers
  const layers = 4;
  const layerWidth = nnWidth / layers;
  for (let i = 0; i < layers; i++) {
    const layerX = nnX + i * layerWidth;
    const intensity = Math.sin((progress / 100) * Math.PI + i * 0.5) * 0.5 + 0.5;
    const layerHeight = nnHeight * (0.4 + 0.3 * intensity);
    const layerY = nnY + (nnHeight - layerHeight) / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(layerX + 5, layerY, layerWidth - 10, layerHeight);
  }

  // Draw target voice
  const targetX = width * 0.75;
  const targetY = height * 0.2;
  const targetWidth = width * 0.15;
  const targetHeight = height * 0.6;

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(targetX, targetY, targetWidth, targetHeight);

  // Draw target waveform
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < targetWidth; i++) {
    const x = targetX + i;
    const y = targetY + targetHeight / 2 + Math.sin((progress / 100) * Math.PI * 3 + i * 0.1) * 25;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Draw arrows
  drawArrow(ctx, sourceX + sourceWidth, sourceY + sourceHeight / 2, nnX, nnY + nnHeight / 2, progress > 25);
  drawArrow(ctx, nnX + nnWidth, nnY + nnHeight / 2, targetX, targetY + targetHeight / 2, progress > 75);
}

function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, active: boolean) {
  if (!active) return;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Draw arrowhead
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowLength = 15;
  const arrowAngle = Math.PI / 6;

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowLength * Math.cos(angle - arrowAngle),
    toY - arrowLength * Math.sin(angle - arrowAngle)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - arrowLength * Math.cos(angle + arrowAngle),
    toY - arrowLength * Math.sin(angle + arrowAngle)
  );
  ctx.stroke();
}

export default AnimatedDemo; 