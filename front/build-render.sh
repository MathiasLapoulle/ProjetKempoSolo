#!/bin/bash
echo "🚀 Starting optimized build for Render..."

# Set environment variables for build optimization
export DISABLE_ESLINT_PLUGIN=true
export ESLINT_NO_DEV_ERRORS=true
export SKIP_PREFLIGHT_CHECK=true
export GENERATE_SOURCEMAP=false
export CI=false

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run optimized build
echo "🔨 Building application..."
npm run build:prod

echo "✅ Build completed successfully!"

# Show build size
echo "📊 Build size:"
du -sh build/

# Show main files
echo "📁 Main build files:"
ls -la build/static/js/ | head -5
ls -la build/static/css/ | head -5
