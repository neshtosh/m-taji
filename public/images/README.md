# Hero Images Directory

This directory contains the images for the homepage hero slider.

## How to Add Your Images:

1. **Copy your images** to this directory (`public/images/`)
2. **Rename them** to match the paths in the code:
   - `hero-image-1.jpg` (or .png, .webp)
   - `hero-image-2.jpg` (or .png, .webp)

## Supported Formats:
- JPG/JPEG
- PNG
- WebP
- GIF

## Recommended Image Specifications:
- **Aspect Ratio**: 16:9 or 21:9 (landscape)
- **Resolution**: 1920x1080 or higher
- **File Size**: Under 2MB for optimal loading
- **Content**: High-quality images that represent your mission

## Example:
```
public/images/
├── hero-image-1.jpg
├── hero-image-2.jpg
└── README.md
```

## Update the Code:
After adding your images, update the paths in `src/components/home/HeroSection.tsx`:

```typescript
const heroImages = [
  '/images/your-actual-image-1.jpg',
  '/images/your-actual-image-2.jpg',
];
```

The images will automatically appear in the hero slider with smooth transitions! 