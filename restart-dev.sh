#!/bin/bash

echo "🛑 Stopping Next.js dev server..."
pkill -f "next dev"
sleep 2

echo "🧹 Cleaning cache..."
cd /home/x/Desktop/y
rm -rf .next

echo "🚀 Starting dev server..."
npm run dev
