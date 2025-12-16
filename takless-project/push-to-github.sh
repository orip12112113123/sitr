#!/bin/bash

# Script to push Takless to GitHub
# Run this script after creating the repository on GitHub

set -e

echo "🚀 Takless - Push to GitHub"
echo "=============================="
echo ""

# Ask for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required!"
    exit 1
fi

echo ""
echo "Choose authentication method:"
echo "1) HTTPS (recommended for beginners)"
echo "2) SSH (if you have SSH keys configured)"
read -p "Enter choice (1 or 2): " AUTH_CHOICE

cd /home/user/takless

# Remove existing remote if it exists
git remote remove origin 2>/dev/null || true

# Set the remote based on choice
if [ "$AUTH_CHOICE" = "1" ]; then
    REPO_URL="https://github.com/${GITHUB_USERNAME}/takless.git"
    echo "📡 Using HTTPS: $REPO_URL"
elif [ "$AUTH_CHOICE" = "2" ]; then
    REPO_URL="git@github.com:${GITHUB_USERNAME}/takless.git"
    echo "🔐 Using SSH: $REPO_URL"
else
    echo "❌ Invalid choice!"
    exit 1
fi

echo ""
echo "⚙️  Configuring remote..."
git remote add origin "$REPO_URL"

echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your project is now on GitHub!"
    echo ""
    echo "🔗 Repository: https://github.com/${GITHUB_USERNAME}/takless"
    echo "📊 Pitch Deck: Open pitch-deck.html in your browser"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Go to: https://github.com/${GITHUB_USERNAME}/takless/settings/pages"
    echo "   2. Enable GitHub Pages (Source: main branch, root folder)"
    echo "   3. Your live pitch deck will be at:"
    echo "      https://${GITHUB_USERNAME}.github.io/takless/pitch-deck.html"
    echo ""
else
    echo ""
    echo "❌ Push failed! Common issues:"
    echo "   1. Make sure you created the repository on GitHub first"
    echo "   2. Check your GitHub credentials"
    echo "   3. If using HTTPS, you may need a Personal Access Token"
    echo ""
    echo "📖 See CREATE_REPO.md for detailed instructions"
fi
