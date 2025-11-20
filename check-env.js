#!/usr/bin/env node

/**
 * Script to check if .env file exists and create it from .env.sample if it doesn't
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envSamplePath = path.join(__dirname, '.env.sample');

console.log('🔍 Checking environment configuration...\n');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found!');
  
  if (fs.existsSync(envSamplePath)) {
    console.log('📋 Creating .env from .env.sample...');
    fs.copyFileSync(envSamplePath, envPath);
    console.log('✅ .env file created successfully!\n');
    console.log('📝 Please review the .env file and update any values if needed.\n');
  } else {
    console.error('❌ ERROR: .env.sample file not found!');
    console.error('   Please create a .env file manually with the following content:');
    console.error('   VITE_SERVER_URL=https://wdd330-backend.onrender.com/\n');
    process.exit(1);
  }
} else {
  console.log('✅ .env file exists!\n');
}

// Verify that VITE_SERVER_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('VITE_SERVER_URL=')) {
  console.error('❌ ERROR: VITE_SERVER_URL is not set in .env file!');
  console.error('   Please add: VITE_SERVER_URL=https://wdd330-backend.onrender.com/\n');
  process.exit(1);
}

console.log('🚀 Environment is ready! You can now run the project.\n');
