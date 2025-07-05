import { useState, useEffect, useRef } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import MonacoEditor from '@monaco-editor/react';
import { FaPlay, FaStop, FaDownload, FaCopy } from 'react-icons/fa';

interface MultiLanguageRunnerProps {
  initialLanguage?: 'javascript' | 'typescript' | 'python' | 'rust' | 'cpp' | 'go';
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}

interface Language {
  id: string;
  name: string;
  extension: string;
  runtime: 'sandpack' | 'pyodide' | 'wasm';
  defaultCode: string;
}

const languages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    runtime: 'sandpack',
    defaultCode: `// JavaScript Example - Interactive Data Visualization
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate fibonacci sequence
const fibSequence = Array.from({length: 10}, (_, i) => fibonacci(i));
console.log('Fibonacci Sequence:', fibSequence);

// Create a simple visualization
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 200;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
fibSequence.forEach((value, index) => {
  const height = (value / Math.max(...fibSequence)) * 150;
  ctx.fillStyle = \`hsl(\${index * 36}, 70%, 50%)\`;
  ctx.fillRect(index * 40, 200 - height, 30, height);
});`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: 'ts',
    runtime: 'sandpack',
    defaultCode: `// TypeScript Example - Type-safe Data Processing
interface DataPoint {
  timestamp: Date;
  value: number;
  category: string;
}

class DataProcessor {
  private data: DataPoint[] = [];

  addPoint(value: number, category: string): void {
    this.data.push({
      timestamp: new Date(),
      value,
      category
    });
  }

  getStatistics(): { mean: number; max: number; min: number } {
    const values = this.data.map(d => d.value);
    return {
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values)
    };
  }

  filterByCategory(category: string): DataPoint[] {
    return this.data.filter(d => d.category === category);
  }
}

// Demo usage
const processor = new DataProcessor();
processor.addPoint(10, 'sales');
processor.addPoint(15, 'marketing');
processor.addPoint(8, 'sales');
processor.addPoint(20, 'marketing');

console.log('Statistics:', processor.getStatistics());
console.log('Sales data:', processor.filterByCategory('sales'));`
  },
  {
    id: 'python',
    name: 'Python',
    extension: 'py',
    runtime: 'pyodide',
    defaultCode: `# Python Example - Data Analysis with NumPy
import numpy as np
import matplotlib.pyplot as plt
from js import document

# Generate sample data
np.random.seed(42)
data = np.random.normal(100, 15, 1000)

# Calculate statistics
mean_val = np.mean(data)
std_val = np.std(data)
median_val = np.median(data)

print(f"Dataset Statistics:")
print(f"Mean: {mean_val:.2f}")
print(f"Std Dev: {std_val:.2f}")
print(f"Median: {median_val:.2f}")

# Create histogram
plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, alpha=0.7, color='skyblue', edgecolor='black')
plt.axvline(mean_val, color='red', linestyle='--', label=f'Mean: {mean_val:.2f}')
plt.axvline(median_val, color='green', linestyle='--', label=f'Median: {median_val:.2f}')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.title('Sample Data Distribution')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# Outlier detection
q1, q3 = np.percentile(data, [25, 75])
iqr = q3 - q1
outliers = data[(data < q1 - 1.5*iqr) | (data > q3 + 1.5*iqr)]
print(f"\\nOutliers detected: {len(outliers)}")
print(f"Outlier values: {outliers[:5]}...")  # Show first 5`
  },
  {
    id: 'rust',
    name: 'Rust',
    extension: 'rs',
    runtime: 'wasm',
    defaultCode: `// Rust Example - High-Performance Computing
use wasm_bindgen::prelude::*;

// Import the \`console.log\` function from the \`console\` module
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Define a macro for easier console logging
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub struct MandelbrotGenerator {
    width: usize,
    height: usize,
    max_iterations: u32,
}

#[wasm_bindgen]
impl MandelbrotGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize, max_iterations: u32) -> MandelbrotGenerator {
        MandelbrotGenerator {
            width,
            height,
            max_iterations,
        }
    }

    #[wasm_bindgen]
    pub fn generate(&self) -> Vec<u8> {
        let mut data = vec![0u8; self.width * self.height * 4];
        
        for y in 0..self.height {
            for x in 0..self.width {
                let cx = (x as f64 / self.width as f64) * 3.0 - 2.0;
                let cy = (y as f64 / self.height as f64) * 2.0 - 1.0;
                
                let iteration = self.mandelbrot(cx, cy);
                let color_value = if iteration == self.max_iterations {
                    0
                } else {
                    ((iteration as f64 / self.max_iterations as f64) * 255.0) as u8
                };
                
                let pixel_index = (y * self.width + x) * 4;
                data[pixel_index] = color_value;     // R
                data[pixel_index + 1] = color_value / 2; // G
                data[pixel_index + 2] = 255 - color_value; // B
                data[pixel_index + 3] = 255;        // A
            }
        }
        
        data
    }

    fn mandelbrot(&self, cx: f64, cy: f64) -> u32 {
        let mut x = 0.0;
        let mut y = 0.0;
        let mut iteration = 0;

        while x*x + y*y <= 4.0 && iteration < self.max_iterations {
            let xtemp = x*x - y*y + cx;
            y = 2.0*x*y + cy;
            x = xtemp;
            iteration += 1;
        }

        iteration
    }
}

#[wasm_bindgen(start)]
pub fn main() {
    console_log!("Rust WebAssembly Mandelbrot Generator initialized!");
    
    let generator = MandelbrotGenerator::new(400, 400, 100);
    console_log!("Generating Mandelbrot set...");
    
    let data = generator.generate();
    console_log!("Generated {} bytes of image data", data.len());
}`
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    runtime: 'wasm',
    defaultCode: `// C++ Example - Physics Simulation
#include <emscripten.h>
#include <emscripten/bind.h>
#include <vector>
#include <cmath>
#include <iostream>

struct Particle {
    double x, y, vx, vy, mass;
    
    Particle(double x, double y, double vx, double vy, double mass)
        : x(x), y(y), vx(vx), vy(vy), mass(mass) {}
};

class PhysicsSimulation {
private:
    std::vector<Particle> particles;
    double gravity = 0.1;
    double damping = 0.999;

public:
    void addParticle(double x, double y, double vx, double vy, double mass) {
        particles.emplace_back(x, y, vx, vy, mass);
    }

    void update() {
        // Apply gravity and update positions
        for (auto& particle : particles) {
            particle.vy += gravity;
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply damping
            particle.vx *= damping;
            particle.vy *= damping;
            
            // Boundary collision
            if (particle.x < 0 || particle.x > 800) {
                particle.vx *= -0.8;
                particle.x = std::max(0.0, std::min(800.0, particle.x));
            }
            if (particle.y < 0 || particle.y > 600) {
                particle.vy *= -0.8;
                particle.y = std::max(0.0, std::min(600.0, particle.y));
            }
        }
        
        // Particle-particle interactions
        for (size_t i = 0; i < particles.size(); ++i) {
            for (size_t j = i + 1; j < particles.size(); ++j) {
                double dx = particles[j].x - particles[i].x;
                double dy = particles[j].y - particles[i].y;
                double distance = std::sqrt(dx*dx + dy*dy);
                
                if (distance < 20.0 && distance > 0) {
                    // Collision response
                    double overlap = 20.0 - distance;
                    double totalMass = particles[i].mass + particles[j].mass;
                    
                    particles[i].x -= (dx/distance) * overlap * (particles[j].mass/totalMass);
                    particles[i].y -= (dy/distance) * overlap * (particles[j].mass/totalMass);
                    particles[j].x += (dx/distance) * overlap * (particles[i].mass/totalMass);
                    particles[j].y += (dy/distance) * overlap * (particles[i].mass/totalMass);
                }
            }
        }
    }

    emscripten::val getParticleData() {
        emscripten::val data = emscripten::val::array();
        for (const auto& particle : particles) {
            emscripten::val p = emscripten::val::object();
            p.set("x", particle.x);
            p.set("y", particle.y);
            p.set("mass", particle.mass);
            data.call<void>("push", p);
        }
        return data;
    }

    void clear() {
        particles.clear();
    }
};

EMSCRIPTEN_BINDINGS(physics_module) {
    emscripten::class_<PhysicsSimulation>("PhysicsSimulation")
        .constructor<>()
        .function("addParticle", &PhysicsSimulation::addParticle)
        .function("update", &PhysicsSimulation::update)
        .function("getParticleData", &PhysicsSimulation::getParticleData)
        .function("clear", &PhysicsSimulation::clear);
}`
  },
  {
    id: 'go',
    name: 'Go',
    extension: 'go',
    runtime: 'wasm',
    defaultCode: `// Go Example - Concurrent Data Processing
package main

import (
    "context"
    "fmt"
    "math/rand"
    "sync"
    "syscall/js"
    "time"
)

type DataProcessor struct {
    input  chan int
    output chan Result
    workers int
}

type Result struct {
    Input  int
    Output int
    Worker int
}

func (dp *DataProcessor) Start(ctx context.Context) {
    var wg sync.WaitGroup
    
    // Start worker goroutines
    for i := 0; i < dp.workers; i++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                case num, ok := <-dp.input:
                    if !ok {
                        return
                    }
                    // Simulate processing work
                    result := dp.processNumber(num, workerID)
                    dp.output <- result
                }
            }
        }(i)
    }
    
    // Close output channel when all workers are done
    go func() {
        wg.Wait()
        close(dp.output)
    }()
}

func (dp *DataProcessor) processNumber(num, workerID int) Result {
    // Simulate some CPU-intensive work
    result := 0
    for i := 0; i < num*1000; i++ {
        result += i * i
    }
    
    return Result{
        Input:  num,
        Output: result % 1000000, // Keep result reasonable
        Worker: workerID,
    }
}

// WebAssembly exports
func startProcessing(this js.Value, args []js.Value) interface{} {
    workerCount := args[0].Int()
    dataPoints := args[1].Int()
    
    processor := &DataProcessor{
        input:   make(chan int, 100),
        output:  make(chan Result, 100),
        workers: workerCount,
    }
    
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    processor.Start(ctx)
    
    // Send data to process
    go func() {
        defer close(processor.input)
        for i := 0; i < dataPoints; i++ {
            processor.input <- rand.Intn(100) + 1
        }
    }()
    
    // Collect results
    results := make([]interface{}, 0)
    for result := range processor.output {
        jsResult := js.ValueOf(map[string]interface{}{
            "input":  result.Input,
            "output": result.Output,
            "worker": result.Worker,
        })
        results = append(results, jsResult)
    }
    
    return js.ValueOf(results)
}

func main() {
    js.Global().Set("goStartProcessing", js.FuncOf(startProcessing))
    
    // Keep the program running
    select {}
}`
  }
];

export default function MultiLanguageRunner({
  initialLanguage = 'javascript',
  initialCode,
  onCodeChange
}: Readonly<MultiLanguageRunnerProps>) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages.find(l => l.id === initialLanguage) || languages[0]
  );
  const [code, setCode] = useState(initialCode ?? selectedLanguage.defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef<any>(null);

  // Initialize Pyodide for Python execution
  useEffect(() => {
    if (selectedLanguage.runtime === 'pyodide' && !pyodideReady) {
      loadPyodide();
    }
  }, [selectedLanguage.runtime, pyodideReady]);

  const loadPyodide = async () => {
    try {
      const pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });
      await pyodide.loadPackage(['numpy', 'matplotlib', 'pandas']);
      pyodideRef.current = pyodide;
      setPyodideReady(true);
      setOutput('Python environment ready! 🐍');
    } catch (error) {
      setOutput('Error loading Python environment: ' + error);
    }
  };

  const handleLanguageChange = (langId: string) => {
    const lang = languages.find(l => l.id === langId);
    if (lang) {
      setSelectedLanguage(lang);
      setCode(lang.defaultCode);
      setOutput('');
      onCodeChange?.(lang.defaultCode);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value ?? '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      switch (selectedLanguage.runtime) {
        case 'pyodide':
          await executePython();
          break;
        case 'wasm':
          await executeWasm();
          break;
        default:
          setOutput('Execution for this language will be handled by Sandpack below.');
      }
    } catch (error) {
      setOutput('Error: ' + error);
    } finally {
      setIsRunning(false);
    }
  };

  const executePython = async () => {
    if (!pyodideReady || !pyodideRef.current) {
      setOutput('Python environment not ready. Please wait...');
      return;
    }

    try {
      // Capture console output
      pyodideRef.current.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);

      // Execute user code
      pyodideRef.current.runPython(code);

      // Get output
      const stdout = pyodideRef.current.runPython('sys.stdout.getvalue()');
      setOutput(stdout ?? 'Code executed successfully (no output)');
    } catch (error) {
      setOutput('Python Error: ' + error);
    }
  };

  const executeWasm = async () => {
    setOutput('WebAssembly compilation and execution would happen here.\n' +
             'For a full implementation, this would compile ' + selectedLanguage.name + 
             ' to WASM and execute it in the browser.\n\n' +
             'Current code preview:\n' + code.substring(0, 200) + '...');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${selectedLanguage.extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-900 rounded-lg">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <select
          value={selectedLanguage.id}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
        >
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={executeCode}
            disabled={isRunning || (selectedLanguage.runtime === 'pyodide' && !pyodideReady)}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {isRunning ? <FaStop /> : <FaPlay />}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          
          <button
            onClick={copyCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaCopy /> Copy
          </button>
          
          <button
            onClick={downloadCode}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaDownload /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
        {/* Code Editor */}
        <div className="border border-gray-600 rounded">
          {selectedLanguage.runtime === 'sandpack' ? (
            <Sandpack
              template={selectedLanguage.id === 'typescript' ? 'react-ts' : 'vanilla'}
              files={{
                [`/src/index.${selectedLanguage.extension}`]: code,
              }}
              theme="dark"
              options={{
                showNavigator: false,
                showTabs: false,
                showLineNumbers: true,
                editorHeight: 350,
              }}
            />
          ) : (
            <MonacoEditor
              height="350px"
              language={selectedLanguage.id}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
          )}
        </div>

        {/* Output Panel */}
        {selectedLanguage.runtime !== 'sandpack' && (
          <div className="bg-black text-green-400 p-4 rounded border border-gray-600 font-mono text-sm overflow-auto">
            <div className="mb-2 text-gray-400">Output:</div>
            <pre className="whitespace-pre-wrap">{output || 'Click "Run Code" to execute...'}</pre>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <strong>{selectedLanguage.name}</strong> - 
        {selectedLanguage.runtime === 'sandpack' && ' Interactive JavaScript/TypeScript execution'}
        {selectedLanguage.runtime === 'pyodide' && ' Python with NumPy, Matplotlib, Pandas'}
        {selectedLanguage.runtime === 'wasm' && ' WebAssembly compilation (demo)'}
      </div>
    </div>
  );
}