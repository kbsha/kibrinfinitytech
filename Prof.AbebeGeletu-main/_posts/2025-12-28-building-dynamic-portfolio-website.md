---
title: Building a Dynamic Portfolio Website
date: 2025-12-28
category: tutorial
author: Prof. Dr. D.Sc. Abebe Geletu
excerpt: Learn how to build a completely dynamic portfolio website with auto-detecting events, galleries, and content management.
---

## Introduction

Building a portfolio website that's both professional and maintainable is crucial for academic professionals. In this post, I'll share the approach used to create this dynamic portfolio system.

## Key Features

### 1. Dynamic Event Management
- Events are auto-detected from the `events/` folder
- No hardcoding required on the main page
- Each event has its own HTML file with preview and full content

### 2. Automatic Image Gallery
- Image counts are automatically detected
- Supports multiple image formats (.jpg, .JPG, .png, etc.)
- Responsive thumbnail gallery with navigation

### 3. Markdown-Based Blog Posts
- Posts stored in `_posts/` folder
- YAML front matter for metadata
- Automatically loaded and displayed on homepage

## Technical Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: CSS3 with responsive design
- **Content**: Markdown + HTML
- **Data Format**: YAML frontmatter

## Benefits

✅ No Database Needed - Files serve as database
✅ Version Control Friendly - Use Git for content management
✅ Easy to Maintain - Simple file structure
✅ Fast Loading - No server-side processing
✅ Scalable - Add content by creating files

## Conclusion

This approach provides a balance between simplicity and functionality, making it perfect for academic portfolios and research websites.
