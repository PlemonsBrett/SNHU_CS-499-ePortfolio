import { FaChevronLeft } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import type { CodeRunnerProps } from "./props";

const CodeRunner = ({ projectTitle, executableCode, onBack }: CodeRunnerProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [progress, setProgress] = useState(0);

	const getProjectType = (language: string) => {
		const typeMap: Record<string, string> = {
			rust: 'rust-neural-vocoder',
			go: 'go-attention-mechanism',
			scala: 'scala-acoustic-modeling',
			python: 'python-nlp-embeddings',
			elixir: 'elixir-mel-spectrogram',
			typescript: 'typescript-voice-conversion'
		};
		return typeMap[language] || 'rust-neural-vocoder';
	};

	const getRepositoryUrl = (projectTitle: string) => {
		const repoMap: Record<string, string> = {
			'Neural Vocoder': 'https://github.com/yourusername/rust-neural-vocoder',
			'Attention Mechanism': 'https://github.com/yourusername/go-attention',
			'Acoustic Modeling': 'https://github.com/yourusername/scala-acoustic',
			'NLP Embeddings': 'https://github.com/yourusername/python-nlp',
			'Mel-Spectrogram': 'https://github.com/yourusername/elixir-mel',
			'Voice Conversion': 'https://github.com/yourusername/typescript-voice'
		};
		return repoMap[projectTitle] || '';
	};

	const getDemoUrl = (projectTitle: string) => {
		const demoMap: Record<string, string> = {
			'Neural Vocoder': 'https://yourusername.github.io/rust-neural-vocoder',
			'Attention Mechanism': 'https://yourusername.github.io/go-attention',
			'Acoustic Modeling': 'https://yourusername.github.io/scala-acoustic',
			'NLP Embeddings': 'https://yourusername.github.io/python-nlp',
			'Mel-Spectrogram': 'https://yourusername.github.io/elixir-mel',
			'Voice Conversion': 'https://yourusername.github.io/typescript-voice'
		};
		return demoMap[projectTitle] || '';
	};

	const projectType = getProjectType(executableCode.language);
	const demoConfig = getDemoConfig(projectType);
	const repositoryUrl = getRepositoryUrl(projectTitle);
	const demoUrl = getDemoUrl(projectTitle);

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

	return (
		<div>
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
			>
				<FaChevronLeft />
				<span>Back to Project Details</span>
			</button>

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
					{isPlaying ? '⏸️' : '▶️'}
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
						📁 View Repository
					</a>
				)}
				{demoUrl && (
					<a
						href={demoUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
					>
						🌐 Live Demo
					</a>
				)}
			</div>
		</div>
	);
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
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
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
}

function animateAttentionMechanism(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
	// Draw input sequence
	const inputX = width * 0.1;
	const inputY = height * 0.2;
	const inputWidth = width * 0.2;
	const inputHeight = height * 0.3;

	ctx.fillStyle = '#3b82f6';
	ctx.fillRect(inputX, inputY, inputWidth, inputHeight);

	// Draw tokens
	const numTokens = 8;
	const tokenWidth = inputWidth / numTokens;
	for (let i = 0; i < numTokens; i++) {
		const tokenX = inputX + i * tokenWidth;
		const intensity = Math.sin((progress / 100) * Math.PI + i * 0.3) * 0.5 + 0.5;
		ctx.fillStyle = `rgba(59, 130, 246, ${intensity})`;
		ctx.fillRect(tokenX + 2, inputY + 2, tokenWidth - 4, inputHeight - 4);
	}

	// Draw attention mechanism
	const attentionX = width * 0.4;
	const attentionY = height * 0.1;
	const attentionWidth = width * 0.4;
	const attentionHeight = height * 0.6;

	ctx.strokeStyle = '#10b981';
	ctx.lineWidth = 2;
	ctx.strokeRect(attentionX, attentionY, attentionWidth, attentionHeight);

	// Draw attention heads
	const numHeads = 4;
	const headHeight = attentionHeight / numHeads;
	for (let i = 0; i < numHeads; i++) {
		const headY = attentionY + i * headHeight;
		const headIntensity = Math.sin((progress / 100) * Math.PI + i * 0.5) * 0.5 + 0.5;
		ctx.fillStyle = `rgba(16, 185, 129, ${headIntensity})`;
		ctx.fillRect(attentionX + 10, headY + 10, attentionWidth - 20, headHeight - 20);
	}

	// Draw output
	const outputX = width * 0.85;
	const outputY = height * 0.2;
	const outputWidth = width * 0.1;
	const outputHeight = height * 0.3;

	ctx.fillStyle = '#f59e0b';
	ctx.fillRect(outputX, outputY, outputWidth, outputHeight);

	// Draw attention weights
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 1;
	for (let i = 0; i < numTokens; i++) {
		for (let j = 0; j < numHeads; j++) {
			const fromX = inputX + i * tokenWidth + tokenWidth / 2;
			const fromY = inputY + inputHeight / 2;
			const toX = attentionX + attentionWidth / 2;
			const toY = attentionY + j * headHeight + headHeight / 2;
			const weight = Math.sin((progress / 100) * Math.PI + i * 0.2 + j * 0.3) * 0.5 + 0.5;
			ctx.strokeStyle = `rgba(255, 255, 255, ${weight})`;
			ctx.beginPath();
			ctx.moveTo(fromX, fromY);
			ctx.lineTo(toX, toY);
			ctx.stroke();
		}
	}
}

function animateAcousticModeling(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
	// Draw audio signal
	const signalX = width * 0.1;
	const signalY = height * 0.2;
	const signalWidth = width * 0.3;
	const signalHeight = height * 0.2;

	ctx.strokeStyle = '#3b82f6';
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let i = 0; i < signalWidth; i++) {
		const x = signalX + i;
		const y = signalY + signalHeight / 2 + Math.sin((progress / 100) * Math.PI * 2 + i * 0.05) * 30;
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();

	// Draw MFCC features
	const mfccX = width * 0.5;
	const mfccY = height * 0.1;
	const mfccWidth = width * 0.3;
	const mfccHeight = height * 0.5;

	ctx.fillStyle = '#10b981';
	ctx.fillRect(mfccX, mfccY, mfccWidth, mfccHeight);

	// Draw feature bins
	const numBins = 13;
	const numFrames = 20;
	const binHeight = mfccHeight / numBins;
	const frameWidth = mfccWidth / numFrames;

	for (let i = 0; i < numBins; i++) {
		for (let j = 0; j < numFrames; j++) {
			const binX = mfccX + j * frameWidth;
			const binY = mfccY + i * binHeight;
			const intensity = Math.sin((progress / 100) * Math.PI + i * 0.1 + j * 0.2) * 0.5 + 0.5;
			ctx.fillStyle = `rgba(16, 185, 129, ${intensity})`;
			ctx.fillRect(binX + 1, binY + 1, frameWidth - 2, binHeight - 2);
		}
	}

	// Draw model output
	const modelX = width * 0.85;
	const modelY = height * 0.3;
	const modelWidth = width * 0.1;
	const modelHeight = height * 0.3;

	ctx.fillStyle = '#f59e0b';
	ctx.fillRect(modelX, modelY, modelWidth, modelHeight);

	// Draw prediction bars
	const numPredictions = 5;
	const barWidth = modelWidth / numPredictions;
	for (let i = 0; i < numPredictions; i++) {
		const barX = modelX + i * barWidth;
		const barHeight = modelHeight * (0.2 + 0.6 * Math.sin((progress / 100) * Math.PI + i * 0.5));
		const barY = modelY + modelHeight - barHeight;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(barX + 2, barY, barWidth - 4, barHeight);
	}
}

function animateNLPEmbeddings(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
	// Draw input text
	const textX = width * 0.1;
	const textY = height * 0.1;
	const textWidth = width * 0.2;
	const textHeight = height * 0.2;

	ctx.fillStyle = '#3b82f6';
	ctx.fillRect(textX, textY, textWidth, textHeight);

	// Draw words
	const words = ['Hello', 'World', 'NLP'];
	const wordHeight = textHeight / words.length;
	for (let i = 0; i < words.length; i++) {
		const wordY = textY + i * wordHeight;
		const intensity = Math.sin((progress / 100) * Math.PI + i * 0.3) * 0.5 + 0.5;
		ctx.fillStyle = `rgba(59, 130, 246, ${intensity})`;
		ctx.fillRect(textX + 5, wordY + 5, textWidth - 10, wordHeight - 10);
	}

	// Draw transformer
	const transformerX = width * 0.4;
	const transformerY = height * 0.1;
	const transformerWidth = width * 0.4;
	const transformerHeight = height * 0.6;

	ctx.strokeStyle = '#10b981';
	ctx.lineWidth = 2;
	ctx.strokeRect(transformerX, transformerY, transformerWidth, transformerHeight);

	// Draw layers
	const numLayers = 6;
	const layerHeight = transformerHeight / numLayers;
	for (let i = 0; i < numLayers; i++) {
		const layerY = transformerY + i * layerHeight;
		const intensity = Math.sin((progress / 100) * Math.PI + i * 0.2) * 0.5 + 0.5;
		ctx.fillStyle = `rgba(16, 185, 129, ${intensity})`;
		ctx.fillRect(transformerX + 10, layerY + 10, transformerWidth - 20, layerHeight - 20);
	}

	// Draw embeddings
	const embedX = width * 0.85;
	const embedY = height * 0.2;
	const embedWidth = width * 0.1;
	const embedHeight = height * 0.4;

	ctx.fillStyle = '#f59e0b';
	ctx.fillRect(embedX, embedY, embedWidth, embedHeight);

	// Draw embedding vectors
	const numVectors = 10;
	const vectorHeight = embedHeight / numVectors;
	for (let i = 0; i < numVectors; i++) {
		const vectorY = embedY + i * vectorHeight;
		const intensity = Math.sin((progress / 100) * Math.PI + i * 0.1) * 0.5 + 0.5;
		ctx.fillStyle = `rgba(245, 158, 11, ${intensity})`;
		ctx.fillRect(embedX + 2, vectorY + 2, embedWidth - 4, vectorHeight - 4);
	}
}

function animateMelSpectrogram(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
	// Draw audio frames
	const framesX = width * 0.1;
	const framesY = height * 0.2;
	const framesWidth = width * 0.2;
	const framesHeight = height * 0.3;

	ctx.fillStyle = '#3b82f6';
	ctx.fillRect(framesX, framesY, framesWidth, framesHeight);

	// Draw frame windows
	const numFrames = 8;
	const frameWidth = framesWidth / numFrames;
	for (let i = 0; i < numFrames; i++) {
		const frameX = framesX + i * frameWidth;
		const intensity = Math.sin((progress / 100) * Math.PI + i * 0.2) * 0.5 + 0.5;
		ctx.fillStyle = `rgba(59, 130, 246, ${intensity})`;
		ctx.fillRect(frameX + 2, framesY + 2, frameWidth - 4, framesHeight - 4);
	}

	// Draw FFT processing
	const fftX = width * 0.4;
	const fftY = height * 0.1;
	const fftWidth = width * 0.3;
	const fftHeight = height * 0.5;

	ctx.strokeStyle = '#10b981';
	ctx.lineWidth = 2;
	ctx.strokeRect(fftX, fftY, fftWidth, fftHeight);

	// Draw frequency bins
	const numBins = 64;
	const binHeight = fftHeight / numBins;
	for (let i = 0; i < numBins; i++) {
		const binY = fftY + i * binHeight;
		const intensity = Math.sin((progress / 100) * Math.PI + i * 0.05) * 0.5 + 0.5;
		ctx.fillStyle = `rgba(16, 185, 129, ${intensity})`;
		ctx.fillRect(fftX + 10, binY + 2, fftWidth - 20, binHeight - 4);
	}

	// Draw mel-spectrogram output
	const melX = width * 0.8;
	const melY = height * 0.1;
	const melWidth = width * 0.15;
	const melHeight = height * 0.6;

	ctx.fillStyle = '#f59e0b';
	ctx.fillRect(melX, melY, melWidth, melHeight);

	// Draw mel bins
	const numMelBins = 80;
	const melBinHeight = melHeight / numMelBins;
	const numTimeSteps = 10;
	const timeStepWidth = melWidth / numTimeSteps;

	for (let i = 0; i < numMelBins; i++) {
		for (let j = 0; j < numTimeSteps; j++) {
			const binX = melX + j * timeStepWidth;
			const binY = melY + i * melBinHeight;
			const intensity = Math.sin((progress / 100) * Math.PI + i * 0.02 + j * 0.1) * 0.5 + 0.5;
			ctx.fillStyle = `rgba(245, 158, 11, ${intensity})`;
			ctx.fillRect(binX + 1, binY + 1, timeStepWidth - 2, melBinHeight - 2);
		}
	}
}

function animateVoiceConversion(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
	// Draw input voice
	const inputX = width * 0.1;
	const inputY = height * 0.2;
	const inputWidth = width * 0.2;
	const inputHeight = height * 0.3;

	ctx.fillStyle = '#3b82f6';
	ctx.fillRect(inputX, inputY, inputWidth, inputHeight);

	// Draw input waveform
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let i = 0; i < inputWidth; i++) {
		const x = inputX + i;
		const y = inputY + inputHeight / 2 + Math.sin((progress / 100) * Math.PI * 2 + i * 0.1) * 20;
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();

	// Draw neural conversion
	const conversionX = width * 0.4;
	const conversionY = height * 0.1;
	const conversionWidth = width * 0.4;
	const conversionHeight = height * 0.6;

	ctx.strokeStyle = '#10b981';
	ctx.lineWidth = 2;
	ctx.strokeRect(conversionX, conversionY, conversionWidth, conversionHeight);

	// Draw conversion layers
	const numLayers = 4;
	const layerHeight = conversionHeight / numLayers;
	for (let i = 0; i < numLayers; i++) {
		const layerY = conversionY + i * layerHeight;
		const intensity = Math.sin((progress / 100) * Math.PI + i * 0.3) * 0.5 + 0.5;
		ctx.fillStyle = `rgba(16, 185, 129, ${intensity})`;
		ctx.fillRect(conversionX + 10, layerY + 10, conversionWidth - 20, layerHeight - 20);
	}

	// Draw output voice
	const outputX = width * 0.85;
	const outputY = height * 0.2;
	const outputWidth = width * 0.1;
	const outputHeight = height * 0.3;

	ctx.fillStyle = '#f59e0b';
	ctx.fillRect(outputX, outputY, outputWidth, outputHeight);

	// Draw output waveform
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let i = 0; i < outputWidth; i++) {
		const x = outputX + i;
		const y = outputY + outputHeight / 2 + Math.sin((progress / 100) * Math.PI * 3 + i * 0.15) * 15;
		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
}

export default CodeRunner;