#!/usr/bin/env node

/**
 * Mobile Development Helper Script
 * Quick commands for mobile app development
 */

const { execSync } = require('child_process');
const fs = require('fs');

const commands = {
  'build-and-sync': () => {
    console.log('🏗️  Building web app...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('🔄 Syncing to mobile platforms...');
    execSync('npx cap sync', { stdio: 'inherit' });
    
    console.log('✅ Ready for mobile development!');
  },
  
  'android': () => {
    console.log('🤖 Opening Android Studio...');
    execSync('npx cap open android', { stdio: 'inherit' });
  },
  
  'ios': () => {
    console.log('🍎 Opening Xcode...');
    execSync('npx cap open ios', { stdio: 'inherit' });
  },
  
  'android-dev': () => {
    console.log('🤖 Starting Android development with live reload...');
    execSync('npx cap run android --livereload', { stdio: 'inherit' });
  },
  
  'ios-dev': () => {
    console.log('🍎 Starting iOS development with live reload...');
    execSync('npx cap run ios --livereload', { stdio: 'inherit' });
  },
  
  'status': () => {
    console.log('📊 Checking Capacitor status...');
    execSync('npx cap doctor', { stdio: 'inherit' });
  },
  
  'help': () => {
    console.log(`
📱 Kheticulture Mobile Development Commands:

npm run mobile build-and-sync  Build web app and sync to mobile
npm run mobile android         Open Android Studio
npm run mobile ios             Open Xcode  
npm run mobile android-dev     Start Android with live reload
npm run mobile ios-dev         Start iOS with live reload
npm run mobile status          Check Capacitor configuration
npm run mobile help            Show this help

Quick start:
1. npm run mobile build-and-sync
2. npm run mobile android (or ios)
3. Build and test in Android Studio/Xcode
    `);
  }
};

const command = process.argv[2];
const handler = commands[command];

if (handler) {
  handler();
} else {
  commands.help();
}