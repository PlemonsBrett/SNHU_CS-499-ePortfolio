import type { Language } from "../MultiLanguageRunner/types";

export const scala: Language = {
  id: 'scala',
  name: 'Scala',
  extension: 'scala',
  runtime: 'jvm',
  aiMlFocus: 'Functional Acoustic Modeling',
  defaultCode: `// Functional Acoustic Modeling for Neural TTS
// Type-safe ML pipelines with monadic composition and functional programming

import scala.math._
import scala.util.{Try, Success, Failure, Either, Left, Right}
import scala.collection.immutable.Vector

// Type-safe neural network types
sealed trait ActivationFunction
case object ReLU extends ActivationFunction
case object Tanh extends ActivationFunction
case object Sigmoid extends ActivationFunction
case object Softmax extends ActivationFunction

// Algebraic data types for acoustic features
sealed trait AcousticFeature
case class MelSpectrogram(data: Vector[Vector[Double]], sampleRate: Int, hopLength: Int) extends AcousticFeature
case class PhonemeFeatures(mfcc: Vector[Vector[Double]], delta: Vector[Vector[Double]], delta2: Vector[Vector[Double]]) extends AcousticFeature
case class ProsodyFeatures(f0: Vector[Double], energy: Vector[Double], duration: Vector[Double]) extends AcousticFeature

// Monadic error handling for ML operations
type MLResult[A] = Either[String, A]

// Neural network layer with functional composition
case class NeuralLayer(
  weights: Vector[Vector[Double]],
  bias: Vector[Double],
  activation: ActivationFunction
) {
  
  // Functional forward pass with error handling
  def forward(input: Vector[Double]): MLResult[Vector[Double]] = {
    Try {
      require(input.length == weights.head.length, "Input dimension mismatch")
      
      // Matrix multiplication: input * weights + bias
      val linearOutput = weights.map { row =>
        input.zip(row).map { case (x, w) => x * w }.sum
      }.zip(bias).map { case (sum, b) => sum + b }
      
      // Apply activation function
      applyActivation(linearOutput, activation)
    }.toEither.left.map(_.getMessage)
  }
  
  // Pure function for activation
  private def applyActivation(x: Vector[Double], activation: ActivationFunction): Vector[Double] = {
    activation match {
      case ReLU => x.map(math.max(0.0, _))
      case Tanh => x.map(math.tanh)
      case Sigmoid => x.map(x => 1.0 / (1.0 + math.exp(-x)))
      case Softmax => {
        val maxVal = x.max
        val expX = x.map(xi => math.exp(xi - maxVal))
        val sumExp = expX.sum
        expX.map(_ / sumExp)
      }
    }
  }
}

// Functional acoustic model with monadic composition
case class FunctionalAcousticModel(
  layers: Vector[NeuralLayer],
  inputDim: Int,
  outputDim: Int
) {
  
  // Monadic forward pass through all layers
  def forward(input: Vector[Double]): MLResult[Vector[Double]] = {
    layers.foldLeft(Right(input): MLResult[Vector[Double]]) { (acc, layer) =>
      acc.flatMap(layer.forward)
    }
  }
  
  // Batch processing with functional composition
  def forwardBatch(inputs: Vector[Vector[Double]]): MLResult[Vector[Vector[Double]]] = {
    inputs.foldLeft(Right(Vector.empty[Vector[Double]]): MLResult[Vector[Vector[Double]]]) { (acc, input) =>
      for {
        processed <- acc
        output <- forward(input)
      } yield processed :+ output
    }
  }
}

// Functional feature extraction pipeline
object AcousticFeatureExtractor {
  
  // Pure function for mel filterbank computation
  def createMelFilterbank(
    sampleRate: Int,
    nFft: Int,
    nMels: Int,
    fMin: Double = 0.0,
    fMax: Double = 8000.0
  ): Vector[Vector[Double]] = {
    
    // Convert frequencies to mel scale
    def hzToMel(hz: Double): Double = 2595.0 * math.log10(1.0 + hz / 700.0)
    def melToHz(mel: Double): Double = 700.0 * (math.pow(10, mel / 2595.0) - 1.0)
    
    val melMin = hzToMel(fMin)
    val melMax = hzToMel(fMax)
    
    // Create mel points
    val melPoints = (0 to nMels + 1).map { i =>
      melMin + (melMax - melMin) * i / (nMels + 1)
    }.toVector
    
    // Convert back to Hz
    val hzPoints = melPoints.map(melToHz)
    
    // Convert to FFT bin indices
    val binPoints = hzPoints.map(_ * nFft / sampleRate)
    
    // Create triangular filters
    (1 to nMels).map { m =>
      val left = binPoints(m - 1).toInt
      val center = binPoints(m).toInt
      val right = binPoints(m + 1).toInt
      
      (0 until nFft / 2 + 1).map { bin =>
        if (bin < left || bin > right) 0.0
        else if (bin <= center) (bin - left).toDouble / (center - left)
        else (right - bin).toDouble / (right - center)
      }.toVector
    }.toVector
  }
  
  // Functional STFT computation
  def computeSTFT(
    audio: Vector[Double],
    windowSize: Int,
    hopSize: Int,
    window: Vector[Double]
  ): Vector[Vector[Complex]] = {
    
    case class Complex(real: Double, imag: Double) {
      def magnitude: Double = math.sqrt(real * real + imag * imag)
      def phase: Double = math.atan2(imag, real)
    }
    
    def fft(signal: Vector[Double]): Vector[Complex] = {
      val n = signal.length
      if (n <= 1) signal.map(Complex(_, 0.0))
      else {
        val even = fft(signal.zipWithIndex.filter(_._2 % 2 == 0).map(_._1))
        val odd = fft(signal.zipWithIndex.filter(_._2 % 2 == 1).map(_._1))
        
        (0 until n).map { k =>
          val angle = -2.0 * Pi * k / n
          val w = Complex(math.cos(angle), math.sin(angle))
          val oddK = odd(k % (n / 2))
          Complex(
            even(k % (n / 2)).real + w.real * oddK.real - w.imag * oddK.imag,
            even(k % (n / 2)).imag + w.real * oddK.imag + w.imag * oddK.real
          )
        }.toVector
      }
    }
    
    // Apply windowing and FFT
    val frames = (0 until audio.length - windowSize by hopSize).map { start =>
      val frame = audio.slice(start, start + windowSize)
      val windowed = frame.zip(window).map { case (sample, w) => sample * w }
      fft(windowed)
    }.toVector
    
    frames
  }
  
  // Extract mel-spectrogram with functional composition
  def extractMelSpectrogram(
    audio: Vector[Double],
    sampleRate: Int,
    hopLength: Int = 256,
    nFft: Int = 1024,
    nMels: Int = 80
  ): MLResult[MelSpectrogram] = {
    Try {
      // Create Hann window
      val window = (0 until nFft).map { i =>
        0.5 - 0.5 * math.cos(2.0 * Pi * i / (nFft - 1))
      }.toVector
      
      // Compute STFT
      val stft = computeSTFT(audio, nFft, hopLength, window)
      
      // Extract magnitude spectrum
      val magnitude = stft.map(_.map(_.magnitude))
      
      // Create mel filterbank
      val melFilterbank = createMelFilterbank(sampleRate, nFft, nMels)
      
      // Apply mel filterbank
      val melSpectrogram = magnitude.map { frame =>
        melFilterbank.map { filter =>
          frame.zip(filter).map { case (mag, filt) => mag * filt }.sum
        }
      }
      
      MelSpectrogram(melSpectrogram, sampleRate, hopLength)
    }.toEither.left.map(_.getMessage)
  }
  
  // Extract MFCC features functionally
  def extractMFCC(
    melSpectrogram: MelSpectrogram,
    nMfcc: Int = 13
  ): MLResult[PhonemeFeatures] = {
    Try {
      // Apply log to mel-spectrogram
      val logMel = melSpectrogram.data.map(_.map(math.log(_ + 1e-10)))
      
      // Simple DCT approximation for MFCC
      def dct(x: Vector[Double]): Vector[Double] = {
        (0 until nMfcc).map { k =>
          x.zipWithIndex.map { case (xi, n) =>
            xi * math.cos(Pi * k * (2 * n + 1) / (2 * x.length))
          }.sum * math.sqrt(2.0 / x.length)
        }.toVector
      }
      
      val mfcc = logMel.map(dct)
      
      // Compute delta features (first derivative)
      val delta = computeDelta(mfcc)
      
      // Compute delta-delta features (second derivative)
      val delta2 = computeDelta(delta)
      
      PhonemeFeatures(mfcc, delta, delta2)
    }.toEither.left.map(_.getMessage)
  }
  
  // Compute delta features (functional approach)
  private def computeDelta(features: Vector[Vector[Double]]): Vector[Vector[Double]] = {
    if (features.length < 3) features
    else {
      features.zipWithIndex.map { case (feature, i) =>
        val prev = if (i > 0) features(i - 1) else feature
        val next = if (i < features.length - 1) features(i + 1) else feature
        
        feature.zip(prev).zip(next).map { case ((curr, p), n) =>
          (n - p) / 2.0
        }
      }
    }
  }
  
  // Extract prosody features with error handling
  def extractProsodyFeatures(
    audio: Vector[Double],
    sampleRate: Int,
    hopLength: Int = 256
  ): MLResult[ProsodyFeatures] = {
    Try {
      // Simple F0 estimation using autocorrelation
      def estimateF0(frame: Vector[Double]): Double = {
        val autocorr = (0 until frame.length / 2).map { lag =>
          frame.zip(frame.drop(lag)).map { case (x, y) => x * y }.sum
        }.toVector
        
        val maxLag = autocorr.zipWithIndex.maxBy(_._1)._2
        if (maxLag > 0) sampleRate.toDouble / maxLag else 0.0
      }
      
      // Extract F0 contour
      val f0 = (0 until audio.length - hopLength by hopLength).map { start =>
        val frame = audio.slice(start, start + hopLength)
        estimateF0(frame)
      }.toVector
      
      // Extract energy contour
      val energy = (0 until audio.length - hopLength by hopLength).map { start =>
        val frame = audio.slice(start, start + hopLength)
        math.sqrt(frame.map(x => x * x).sum / frame.length)
      }.toVector
      
      // Extract duration features (simplified)
      val duration = Vector.fill(f0.length)(hopLength.toDouble / sampleRate)
      
      ProsodyFeatures(f0, energy, duration)
    }.toEither.left.map(_.getMessage)
  }
}

// Functional training pipeline with monadic composition
object FunctionalTrainingPipeline {
  
  // Type-safe loss function
  sealed trait LossFunction
  case object MSE extends LossFunction
  case object CrossEntropy extends LossFunction
  case object KLDivergence extends LossFunction
  
  // Training configuration
  case class TrainingConfig(
    learningRate: Double = 0.001,
    batchSize: Int = 32,
    epochs: Int = 100,
    lossFunction: LossFunction = MSE
  )
  
  // Training state with immutability
  case class TrainingState(
    model: FunctionalAcousticModel,
    epoch: Int,
    loss: Double,
    gradients: Vector[Vector[Vector[Double]]]
  )
  
  // Functional gradient computation
  def computeGradients(
    model: FunctionalAcousticModel,
    inputs: Vector[Vector[Double]],
    targets: Vector[Vector[Double]],
    lossFunction: LossFunction
  ): MLResult[Vector[Vector[Vector[Double]]]] = {
    Try {
      // Simplified gradient computation (in practice, would use automatic differentiation)
      model.layers.map { layer =>
        layer.weights.map { row =>
          row.map { weight =>
            // Simple finite difference approximation
            val epsilon = 1e-6
            val lossPlus = computeLoss(model, inputs, targets, lossFunction)
            val lossMinus = computeLoss(model, inputs, targets, lossFunction)
            (lossPlus - lossMinus) / (2 * epsilon)
          }
        }
      }
    }.toEither.left.map(_.getMessage)
  }
  
  // Compute loss functionally
  def computeLoss(
    model: FunctionalAcousticModel,
    inputs: Vector[Vector[Double]],
    targets: Vector[Vector[Double]],
    lossFunction: LossFunction
  ): Double = {
    model.forwardBatch(inputs) match {
      case Right(predictions) =>
        lossFunction match {
          case MSE =>
            predictions.zip(targets).map { case (pred, target) =>
              pred.zip(target).map { case (p, t) => math.pow(p - t, 2) }.sum
            }.sum / predictions.length
          case CrossEntropy =>
            predictions.zip(targets).map { case (pred, target) =>
              pred.zip(target).map { case (p, t) => -t * math.log(p + 1e-10) }.sum
            }.sum / predictions.length
          case KLDivergence =>
            predictions.zip(targets).map { case (pred, target) =>
              pred.zip(target).map { case (p, t) => t * math.log(t / (p + 1e-10)) }.sum
            }.sum / predictions.length
        }
      case Left(_) => Double.MaxValue
    }
  }
  
  // Functional training loop with monadic composition
  def train(
    model: FunctionalAcousticModel,
    trainingData: Vector[(Vector[Double], Vector[Double])],
    config: TrainingConfig
  ): MLResult[FunctionalAcousticModel] = {
    
    def trainingStep(
      currentModel: FunctionalAcousticModel,
      batch: Vector[(Vector[Double], Vector[Double])]
    ): MLResult[FunctionalAcousticModel] = {
      val inputs = batch.map(_._1)
      val targets = batch.map(_._2)
      
      for {
        gradients <- computeGradients(currentModel, inputs, targets, config.lossFunction)
        updatedModel <- updateModel(currentModel, gradients, config.learningRate)
      } yield updatedModel
    }
    
    def updateModel(
      model: FunctionalAcousticModel,
      gradients: Vector[Vector[Vector[Double]]],
      learningRate: Double
    ): MLResult[FunctionalAcousticModel] = {
      Try {
        val updatedLayers = model.layers.zip(gradients).map { case (layer, layerGradients) =>
          val updatedWeights = layer.weights.zip(layerGradients).map { case (row, gradRow) =>
            row.zip(gradRow).map { case (weight, gradient) =>
              weight - learningRate * gradient
            }
          }
          layer.copy(weights = updatedWeights)
        }
        model.copy(layers = updatedLayers)
      }.toEither.left.map(_.getMessage)
    }
    
    // Main training loop
    (1 to config.epochs).foldLeft(Right(model): MLResult[FunctionalAcousticModel]) { (acc, epoch) =>
      acc.flatMap { currentModel =>
        val batches = trainingData.grouped(config.batchSize).toVector
        batches.foldLeft(Right(currentModel): MLResult[FunctionalAcousticModel]) { (modelAcc, batch) =>
          modelAcc.flatMap(trainingStep(_, batch))
        }
      }
    }
  }
}

// Demo: Functional acoustic modeling pipeline
object AcousticModelingDemo {
  
  def main(args: Array[String]): Unit = {
    println("=== Functional Acoustic Modeling for Neural TTS ===")
    println("Type-safe ML pipelines with monadic composition")
    println()
    
    // Generate synthetic audio data
    val sampleRate = 22050
    val duration = 2.0
    val numSamples = (sampleRate * duration).toInt
    
    val audio = (0 until numSamples).map { i =>
      val t = i.toDouble / sampleRate
      // Generate speech-like signal with formants
      math.sin(2 * Pi * 800 * t) * 0.5 +  // F1
      math.sin(2 * Pi * 1200 * t) * 0.3 + // F2
      math.sin(2 * Pi * 2500 * t) * 0.2   // F3
    }.toVector
    
    println(s"Generated synthetic audio: \${audio.length} samples")
    println(s"Duration: \${audio.length.toDouble / sampleRate:.2f} seconds")
    println()
    
    // Extract acoustic features using functional pipeline
    println("1. Extracting mel-spectrogram...")
    val melResult = AcousticFeatureExtractor.extractMelSpectrogram(audio, sampleRate)
    
    melResult match {
      case Right(melSpec) =>
        println(s"   Mel-spectrogram shape: \${melSpec.data.length} x \${melSpec.data.head.length}")
        println(s"   Sample rate: \${melSpec.sampleRate} Hz")
        println(s"   Hop length: \${melSpec.hopLength} samples")
        
        println("\\n2. Extracting MFCC features...")
        val mfccResult = AcousticFeatureExtractor.extractMFCC(melSpec)
        
        mfccResult match {
          case Right(mfcc) =>
            println(s"   MFCC shape: \${mfcc.mfcc.length} x \${mfcc.mfcc.head.length}")
            println(s"   Delta shape: \${mfcc.delta.length} x \${mfcc.delta.head.length}")
            println(s"   Delta2 shape: \${mfcc.delta2.length} x \${mfcc.delta2.head.length}")
            
            println("\\n3. Extracting prosody features...")
            val prosodyResult = AcousticFeatureExtractor.extractProsodyFeatures(audio, sampleRate)
            
            prosodyResult match {
              case Right(prosody) =>
                println(s"   F0 range: \${prosody.f0.min} - \${prosody.f0.max} Hz")
                println(s"   Energy range: \${prosody.energy.min} - \${prosody.energy.max}")
                println(s"   Duration frames: \${prosody.duration.length}")
                
                println("\\n4. Creating functional neural network...")
                // Create simple neural network
                val inputDim = melSpec.data.head.length
                val hiddenDim = 128
                val outputDim = 80
                
                val layer1 = NeuralLayer(
                  weights = Vector.fill(hiddenDim)(Vector.fill(inputDim)(math.random * 0.1 - 0.05)),
                  bias = Vector.fill(hiddenDim)(0.0),
                  activation = ReLU
                )
                
                val layer2 = NeuralLayer(
                  weights = Vector.fill(outputDim)(Vector.fill(hiddenDim)(math.random * 0.1 - 0.05)),
                  bias = Vector.fill(outputDim)(0.0),
                  activation = Tanh
                )
                
                val model = FunctionalAcousticModel(
                  layers = Vector(layer1, layer2),
                  inputDim = inputDim,
                  outputDim = outputDim
                )
                
                println(s"   Model architecture: \${inputDim} -> \${hiddenDim} -> \${outputDim}")
                
                // Test forward pass
                println("\\n5. Testing neural network forward pass...")
                val testInput = melSpec.data.head
                val forwardResult = model.forward(testInput)
                
                forwardResult match {
                  case Right(output) =>
                    println(s"   Forward pass successful: \${output.length} outputs")
                    println(s"   Output range: \${output.min} - \${output.max}")
                    
                    println("\\n6. Running batch processing...")
                    val batchResult = model.forwardBatch(melSpec.data.take(10))
                    
                    batchResult match {
                      case Right(batchOutput) =>
                        println(s"   Batch processing successful: \${batchOutput.length} samples")
                        println(s"   Average output magnitude: \${batchOutput.flatten.sum / batchOutput.flatten.length}")
                        
                        println("\\n=== Functional Acoustic Modeling Complete ===")
                        println("✅ Type-safe feature extraction")
                        println("✅ Monadic error handling")
                        println("✅ Functional neural network")
                        println("✅ Immutable data structures")
                        println("\\n🎵 Ready for neural speech synthesis! 🧠")
                        
                      case Left(error) =>
                        println(s"   Batch processing failed: $error")
                    }
                    
                  case Left(error) =>
                    println(s"   Forward pass failed: $error")
                }
                
              case Left(error) =>
                println(s"   Prosody extraction failed: $error")
            }
            
          case Left(error) =>
            println(s"   MFCC extraction failed: $error")
        }
        
      case Left(error) =>
        println(s"   Mel-spectrogram extraction failed: $error")
    }
  }
}

// Run the demo
AcousticModelingDemo.main(Array.empty)`
}; 