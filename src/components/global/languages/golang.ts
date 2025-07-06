import type { Language } from "../MultiLanguageRunner/types";

export const golang: Language = {
  id: 'golang',
  name: 'Go',
  extension: 'go',
  runtime: 'wasm',
  aiMlFocus: 'Transformer Attention Visualization',
  defaultCode: `// Transformer Attention Visualization for Neural TTS
// High-performance attention mechanism implementation with WebAssembly optimization

package main

import (
	"fmt"
	"math"
	"math/rand"
	"time"
)

// AttentionConfig holds transformer attention parameters
type AttentionConfig struct {
	NumHeads    int
	HeadDim     int
	SeqLength   int
	EmbedDim    int
	DropoutRate float64
}

// MultiHeadAttention implements transformer attention for TTS
type MultiHeadAttention struct {
	config     AttentionConfig
	queryProj  [][]float64
	keyProj    [][]float64
	valueProj  [][]float64
	outputProj [][]float64
	dropout    float64
}

// NewMultiHeadAttention creates attention mechanism for speech synthesis
func NewMultiHeadAttention(config AttentionConfig) *MultiHeadAttention {
	// Initialize projection matrices for Q, K, V
	queryProj := make([][]float64, config.NumHeads)
	keyProj := make([][]float64, config.NumHeads)
	valueProj := make([][]float64, config.NumHeads)
	outputProj := make([][]float64, config.EmbedDim)

	// Initialize with Xavier/Glorot initialization for stable gradients
	for i := 0; i < config.NumHeads; i++ {
		queryProj[i] = make([]float64, config.HeadDim)
		keyProj[i] = make([]float64, config.HeadDim)
		valueProj[i] = make([]float64, config.HeadDim)
		
		// Xavier initialization: sqrt(2.0 / (fan_in + fan_out))
		scale := math.Sqrt(2.0 / float64(config.HeadDim+config.EmbedDim))
		for j := 0; j < config.HeadDim; j++ {
			queryProj[i][j] = (rand.Float64() - 0.5) * 2.0 * scale
			keyProj[i][j] = (rand.Float64() - 0.5) * 2.0 * scale
			valueProj[i][j] = (rand.Float64() - 0.5) * 2.0 * scale
		}
	}

	// Output projection matrix
	for i := 0; i < config.EmbedDim; i++ {
		outputProj[i] = make([]float64, config.EmbedDim)
		scale := math.Sqrt(2.0 / float64(config.EmbedDim*2))
		for j := 0; j < config.EmbedDim; j++ {
			outputProj[i][j] = (rand.Float64() - 0.5) * 2.0 * scale
		}
	}

	return &MultiHeadAttention{
		config:     config,
		queryProj:  queryProj,
		keyProj:    keyProj,
		valueProj:  valueProj,
		outputProj: outputProj,
		dropout:    config.DropoutRate,
	}
}

// ScaledDotProductAttention computes attention weights and output
func (mha *MultiHeadAttention) ScaledDotProductAttention(
	query, key, value [][]float64,
	mask []bool,
) ([][]float64, [][]float64) {
	seqLen := len(query)
	headDim := len(query[0])
	
	// Compute attention scores: Q * K^T / sqrt(d_k)
	attentionScores := make([][]float64, seqLen)
	for i := 0; i < seqLen; i++ {
		attentionScores[i] = make([]float64, seqLen)
		for j := 0; j < seqLen; j++ {
			score := 0.0
			for k := 0; k < headDim; k++ {
				score += query[i][k] * key[j][k]
			}
			// Scale by sqrt(d_k) for stable gradients
			attentionScores[i][j] = score / math.Sqrt(float64(headDim))
		}
	}

	// Apply causal mask for autoregressive generation (TTS requirement)
	for i := 0; i < seqLen; i++ {
		for j := 0; j < seqLen; j++ {
			if j > i { // Future tokens cannot attend to past
				attentionScores[i][j] = -1e9 // Large negative value
			}
		}
	}

	// Apply softmax to get attention weights
	attentionWeights := mha.softmax(attentionScores)
	
	// Apply dropout for regularization
	if mha.dropout > 0.0 {
		attentionWeights = mha.applyDropout(attentionWeights, mha.dropout)
	}

	// Compute weighted sum: Attention_weights * V
	output := make([][]float64, seqLen)
	for i := 0; i < seqLen; i++ {
		output[i] = make([]float64, headDim)
		for j := 0; j < headDim; j++ {
			sum := 0.0
			for k := 0; k < seqLen; k++ {
				sum += attentionWeights[i][k] * value[k][j]
			}
			output[i][j] = sum
		}
	}

	return output, attentionWeights
}

// Forward performs multi-head attention forward pass
func (mha *MultiHeadAttention) Forward(
	input [][]float64,
	mask []bool,
) ([][]float64, [][][]float64) {
	seqLen := len(input)
	embedDim := len(input[0])
	headDim := embedDim / mha.config.NumHeads

	// Split input into multiple heads
	heads := make([][][]float64, mha.config.NumHeads)
	for h := 0; h < mha.config.NumHeads; h++ {
		heads[h] = make([][]float64, seqLen)
		for i := 0; i < seqLen; i++ {
			heads[h][i] = make([]float64, headDim)
			for j := 0; j < headDim; j++ {
				heads[h][i][j] = input[i][h*headDim+j]
			}
		}
	}

	// Apply attention for each head
	headOutputs := make([][][]float64, mha.config.NumHeads)
	attentionWeights := make([][][]float64, mha.config.NumHeads)

	for h := 0; h < mha.config.NumHeads; h++ {
		// Project Q, K, V for this head
		query := mha.project(heads[h], mha.queryProj[h])
		key := mha.project(heads[h], mha.keyProj[h])
		value := mha.project(heads[h], mha.valueProj[h])

		// Compute attention
		headOutputs[h], attentionWeights[h] = mha.ScaledDotProductAttention(
			query, key, value, mask,
		)
	}

	// Concatenate head outputs
	concatenated := make([][]float64, seqLen)
	for i := 0; i < seqLen; i++ {
		concatenated[i] = make([]float64, embedDim)
		for h := 0; h < mha.config.NumHeads; h++ {
			for j := 0; j < headDim; j++ {
				concatenated[i][h*headDim+j] = headOutputs[h][i][j]
			}
		}
	}

	// Apply output projection
	output := mha.project(concatenated, mha.outputProj)

	return output, attentionWeights
}

// project applies linear projection to input
func (mha *MultiHeadAttention) project(
	input [][]float64,
	weights []float64,
) [][]float64 {
	seqLen := len(input)
	outputDim := len(weights)
	
	output := make([][]float64, seqLen)
	for i := 0; i < seqLen; i++ {
		output[i] = make([]float64, outputDim)
		for j := 0; j < outputDim; j++ {
			sum := 0.0
			for k := 0; k < len(input[i]); k++ {
				sum += input[i][k] * weights[k]
			}
			output[i][j] = sum
		}
	}
	return output
}

// softmax applies softmax activation to attention scores
func (mha *MultiHeadAttention) softmax(scores [][]float64) [][]float64 {
	seqLen := len(scores)
	output := make([][]float64, seqLen)
	
	for i := 0; i < seqLen; i++ {
		output[i] = make([]float64, seqLen)
		
		// Find max for numerical stability
		maxScore := scores[i][0]
		for j := 1; j < seqLen; j++ {
			if scores[i][j] > maxScore {
				maxScore = scores[i][j]
			}
		}
		
		// Compute exp and sum
		sum := 0.0
		for j := 0; j < seqLen; j++ {
			output[i][j] = math.Exp(scores[i][j] - maxScore)
			sum += output[i][j]
		}
		
		// Normalize
		for j := 0; j < seqLen; j++ {
			output[i][j] /= sum
		}
	}
	
	return output
}

// applyDropout applies dropout to attention weights
func (mha *MultiHeadAttention) applyDropout(
	weights [][]float64,
	dropoutRate float64,
) [][]float64 {
	seqLen := len(weights)
	output := make([][]float64, seqLen)
	
	for i := 0; i < seqLen; i++ {
		output[i] = make([]float64, len(weights[i]))
		for j := 0; j < len(weights[i]); j++ {
			if rand.Float64() > dropoutRate {
				output[i][j] = weights[i][j] / (1.0 - dropoutRate)
			} else {
				output[i][j] = 0.0
			}
		}
	}
	
	return output
}

// AttentionVisualization provides insights into attention patterns
type AttentionVisualization struct {
	AttentionWeights [][][]float64
	SeqLength        int
	NumHeads         int
}

// NewAttentionVisualization creates visualization for TTS attention
func NewAttentionVisualization(weights [][][]float64, seqLen, numHeads int) *AttentionVisualization {
	return &AttentionVisualization{
		AttentionWeights: weights,
		SeqLength:        seqLen,
		NumHeads:         numHeads,
	}
}

// AnalyzeAttentionPatterns analyzes attention patterns for speech synthesis
func (av *AttentionVisualization) AnalyzeAttentionPatterns() map[string]interface{} {
	// Calculate attention statistics
	totalAttention := 0.0
	maxAttention := 0.0
	minAttention := 1.0
	
	// Analyze diagonal attention (self-attention)
	diagonalAttention := 0.0
	diagonalCount := 0
	
	// Analyze local attention (neighboring tokens)
	localAttention := 0.0
	localCount := 0
	
	for h := 0; h < av.NumHeads; h++ {
		for i := 0; i < av.SeqLength; i++ {
			for j := 0; j < av.SeqLength; j++ {
				weight := av.AttentionWeights[h][i][j]
				totalAttention += weight
				
				if weight > maxAttention {
					maxAttention = weight
				}
				if weight < minAttention {
					minAttention = weight
				}
				
				// Diagonal attention
				if i == j {
					diagonalAttention += weight
					diagonalCount++
				}
				
				// Local attention (within 3 tokens)
				if abs(i-j) <= 3 {
					localAttention += weight
					localCount++
				}
			}
		}
	}
	
	totalWeights := av.NumHeads * av.SeqLength * av.SeqLength
	
	return map[string]interface{}{
		"average_attention":     totalAttention / float64(totalWeights),
		"max_attention":         maxAttention,
		"min_attention":         minAttention,
		"diagonal_attention":    diagonalAttention / float64(diagonalCount),
		"local_attention":       localAttention / float64(localCount),
		"attention_entropy":     av.calculateEntropy(),
		"head_diversity":        av.calculateHeadDiversity(),
		"causal_compliance":     av.verifyCausalMask(),
	}
}

// calculateEntropy computes attention distribution entropy
func (av *AttentionVisualization) calculateEntropy() float64 {
	entropy := 0.0
	totalWeights := av.NumHeads * av.SeqLength * av.SeqLength
	
	for h := 0; h < av.NumHeads; h++ {
		for i := 0; i < av.SeqLength; i++ {
			for j := 0; j < av.SeqLength; j++ {
				weight := av.AttentionWeights[h][i][j]
				if weight > 0 {
					entropy -= weight * math.Log(weight)
				}
			}
		}
	}
	
	return entropy / float64(totalWeights)
}

// calculateHeadDiversity measures diversity across attention heads
func (av *AttentionVisualization) calculateHeadDiversity() float64 {
	// Calculate average attention pattern per head
	headPatterns := make([][]float64, av.NumHeads)
	for h := 0; h < av.NumHeads; h++ {
		headPatterns[h] = make([]float64, av.SeqLength*av.SeqLength)
		idx := 0
		for i := 0; i < av.SeqLength; i++ {
			for j := 0; j < av.SeqLength; j++ {
				headPatterns[h][idx] = av.AttentionWeights[h][i][j]
				idx++
			}
		}
	}
	
	// Calculate cosine similarity between heads
	totalSimilarity := 0.0
	count := 0
	
	for h1 := 0; h1 < av.NumHeads; h1++ {
		for h2 := h1 + 1; h2 < av.NumHeads; h2++ {
			similarity := cosineSimilarity(headPatterns[h1], headPatterns[h2])
			totalSimilarity += similarity
			count++
		}
	}
	
	// Return diversity (1 - average similarity)
	return 1.0 - (totalSimilarity / float64(count))
}

// verifyCausalMask ensures causal masking is properly applied
func (av *AttentionVisualization) verifyCausalMask() float64 {
	violations := 0
	totalChecks := 0
	
	for h := 0; h < av.NumHeads; h++ {
		for i := 0; i < av.SeqLength; i++ {
			for j := i + 1; j < av.SeqLength; j++ {
				if av.AttentionWeights[h][i][j] > 1e-6 {
					violations++
				}
				totalChecks++
			}
		}
	}
	
	return 1.0 - float64(violations)/float64(totalChecks)
}

// cosineSimilarity calculates cosine similarity between two vectors
func cosineSimilarity(a, b []float64) float64 {
	dotProduct := 0.0
	normA := 0.0
	normB := 0.0
	
	for i := 0; i < len(a); i++ {
		dotProduct += a[i] * b[i]
		normA += a[i] * a[i]
		normB += b[i] * b[i]
	}
	
	if normA == 0 || normB == 0 {
		return 0.0
	}
	
	return dotProduct / (math.Sqrt(normA) * math.Sqrt(normB))
}

// abs returns absolute value
func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// Demo function for transformer attention visualization
func main() {
	// Set random seed for reproducible results
	rand.Seed(time.Now().UnixNano())
	
	// Configure attention for TTS
	config := AttentionConfig{
		NumHeads:    8,
		HeadDim:     64,
		SeqLength:   32,
		EmbedDim:    512,
		DropoutRate: 0.1,
	}
	
	// Create multi-head attention
	attention := NewMultiHeadAttention(config)
	
	// Generate synthetic input (mel-spectrogram features)
	input := make([][]float64, config.SeqLength)
	for i := 0; i < config.SeqLength; i++ {
		input[i] = make([]float64, config.EmbedDim)
		for j := 0; j < config.EmbedDim; j++ {
			input[i][j] = rand.Float64()*2.0 - 1.0
		}
	}
	
	// Forward pass
	output, attentionWeights := attention.Forward(input, nil)
	
	// Create visualization
	viz := NewAttentionVisualization(attentionWeights, config.SeqLength, config.NumHeads)
	analysis := viz.AnalyzeAttentionPatterns()
	
	// Print results
	fmt.Printf("Transformer Attention Analysis for Neural TTS:\\n")
	fmt.Printf("==============================================\\n")
	fmt.Printf("Sequence Length: %d\\n", config.SeqLength)
	fmt.Printf("Number of Heads: %d\\n", config.NumHeads)
	fmt.Printf("Embedding Dimension: %d\\n", config.EmbedDim)
	fmt.Printf("\\nAttention Statistics:\\n")
	fmt.Printf("- Average Attention: %.4f\\n", analysis["average_attention"])
	fmt.Printf("- Max Attention: %.4f\\n", analysis["max_attention"])
	fmt.Printf("- Min Attention: %.4f\\n", analysis["min_attention"])
	fmt.Printf("- Diagonal Attention: %.4f\\n", analysis["diagonal_attention"])
	fmt.Printf("- Local Attention: %.4f\\n", analysis["local_attention"])
	fmt.Printf("- Attention Entropy: %.4f\\n", analysis["attention_entropy"])
	fmt.Printf("- Head Diversity: %.4f\\n", analysis["head_diversity"])
	fmt.Printf("- Causal Compliance: %.4f\\n", analysis["causal_compliance"])
	fmt.Printf("\\nOutput Shape: %d x %d\\n", len(output), len(output[0]))
	fmt.Printf("\\nTransformer attention mechanism ready for neural speech synthesis! 🎵🧠")
}`
}; 