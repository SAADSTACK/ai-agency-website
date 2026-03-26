# AI Agency Blog Section - Stitch Screen

**Project:** AI Agency Contact  
**Project ID:** 10480929957664153397  
**Screen:** AI Agency Blog Section  
**Screen ID:** 2f089da8023e424e9adbc993ea36a2c3

## Files Included

- **blog.html** - Main blog page HTML with Material Design System styling
  - Tailwind CSS framework with custom Material Design color tokens
  - Responsive Grid layout with 3-column article feed
  - Featured insight section with hero image
  - Newsletter subscription CTA
  - Navigation header with blog active state
  - Footer with social links

## Image Assets

The HTML references 15 images that should be downloaded to the `images/` directory:

### Image Mapping

| Image | Usage | URL Position |
|-------|-------|--------------|
| image-1.jpg | User Avatar (Top Nav) | Header user profile |
| image-2.jpg | Featured Article Hero | Featured article large image |
| image-3.jpg | Featured Article Author | Elena Rodriguez author photo |
| image-4.jpg | Article 1 Thumbnail | "Zero-Touch Office" article |
| image-5.jpg | Article 1 Author | Marcus Thorne photo |
| image-6.jpg | Article 2 Thumbnail | "AI Security" article |
| image-7.jpg | Article 2 Author | Sarah Chen photo |
| image-8.jpg | Article 3 Thumbnail | "Meeting Culture" article |
| image-9.jpg | Article 3 Author | David Lau photo |
| image-10.jpg | Article 4 Thumbnail | "Fine-Tuning ROI" article |
| image-11.jpg | Article 4 Author | Elena Rodriguez photo |
| image-12.jpg | Article 5 Thumbnail | "Financial Reporting" article |
| image-13.jpg | Article 5 Author | Marcus Thorne photo |
| image-14.jpg | Article 6 Thumbnail | "Top Agency 2024" article |
| image-15.jpg | Article 6 Author | David Lau photo |

## Design System Tokens

### Colors
- **Primary:** #0041a2 (Blue 700)
- **Background:** #f8f9fa
- **Surface:** #f8f9fa
- **Typography Colors:** On-surface, On-surface-variant
- **Error:** #ba1a1a

### Typography
- **Headline Font:** Manrope (500, 600, 700, 800 weights)
- **Body Font:** Inter (400, 500, 600 weights)

### Border Radius
- **Default:** 1rem
- **Large:** 2rem
- **XLarge:** 3rem

## Responsive Breakpoints

- **Mobile First** - Single column layout
- **md (768px)** - 2 column grid  
- **lg (1024px)** - 3 column grid

## Key Components

1. **TopAppBar** - Fixed header with navigation and search
2. **Featured Insight** - Hero section with image and content
3. **Topic Filters** - Category toggle buttons
4. **Article Feed** - Grid of article cards with hover states
5. **Newsletter CTA** - Email subscription section
6. **Footer** - Links and social media

## Setup Instructions

1. Place all downloaded images in the `images/` directory
2. Update image paths in blog.html if using a different naming scheme
3. Ensure all external fonts and scripts load (Tailwind CSS, Material Symbols, Google Fonts)
4. Test responsive behavior at breakpoints: 480px, 768px, 1024px, 1280px

## Color Tokens Reference

Full Material Design System color palette is configured in the Tailwind config within the HTML file, including:
- Primary & Primary Container
- Secondary & Secondary Fixed states  
- Tertiary & Tertiary Container states
- Surface containers (low, default, high, highest)
- Error states
- Outline and outline-variant

