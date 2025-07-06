#!/bin/bash

set -e

echo "🦀 Building Rust Neural Vocoder for WebAssembly..."

# Install wasm-pack if not already installed
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# Create Rust project structure if it doesn't exist
if [ ! -f "Cargo.toml" ]; then
    echo "Creating Cargo.toml for neural vocoder..."
    cat > Cargo.toml << 'EOF'
[package]
name = "neural-vocoder"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
js-sys = "0.3"
wee_alloc = { version = "0.4", optional = true }

[dependencies.web-sys]
version = "0.3"
features = [
  "console",
  "AudioContext",
  "AudioNode",
  "AudioBuffer",
  "Float32Array",
]

[features]
default = ["wee_alloc"]
EOF
fi

# Build WebAssembly module
echo "Compiling Rust to WebAssembly..."
wasm-pack build \
    --target web \
    --out-dir public/wasm/neural-vocoder \
    --no-typescript \
    --release

# Optimize WASM file
if command -v wasm-opt &> /dev/null; then
    echo "Optimizing WASM binary..."
    wasm-opt -Oz --enable-simd \
        public/wasm/neural-vocoder/neural_vocoder_bg.wasm \
        -o public/wasm/neural-vocoder/neural_vocoder_bg.wasm
fi

echo "✅ Rust Neural Vocoder WASM build complete!"
echo "📁 Output: public/wasm/neural-vocoder/"