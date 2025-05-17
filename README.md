# Wiki Tooltip App

A modern Svelte 5 application that demonstrates various ways to implement tooltips, highlighting, and interactive elements using Svelte's new attachment system and traditional action patterns.

## Project Overview

This application showcases the powerful features of Svelte 5, particularly focusing on:

- Using `{@attach}` directive for tooltips and interactive elements
- Implementing traditional `use:` actions for backward compatibility
- Managing DOM behavior with attachments
- Handling accessibility concerns
- Demonstrating form interactions
- Working with advanced event handling
- Implementing intersection observer API with Svelte
- Creating Wikipedia-style tooltips for content enhancement

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wiki-tooltip-app.git
cd wiki-tooltip-app

# Install dependencies
npm install

# Start the development server
npm run dev -- --open
```

## Application Structure

The project is organized using a modular component approach:

- **TooltipExamples**: Demonstrates various ways to implement tooltips
- **WikiItem**: Wikipedia-style interactive content preview
- **WikiArticle**: Article content with highlighted terms and tooltips
- **IntersectionDemo**: Demonstrates Intersection Observer API integration
- **FormDemo**: Shows form interaction techniques
- **EventDemo**: Demonstrates event handling and mouse interactions
- **AccessibilityDemo**: Showcases accessibility features and enhancements

Each component is structured to separate concerns:
- `.svelte` files for component structure
- `.ts` files for TypeScript logic
- `.css` files for styling
- `index.ts` files for clean exports

## Key Features

### Tooltip System

The application implements tooltips in multiple ways:
- Modern Svelte 5 attachments using `{@attach}`
- Traditional Svelte actions using `use:`
- Programmatic tooltip creation

### Highlight Effects

Content can be highlighted with interactive behaviors:
- Hover effects with color transitions
- Highlighted text with tooltips
- Focus states for keyboard navigation

### Accessibility

The application demonstrates several accessibility enhancements:
- Keyboard navigation
- Screen reader announcements
- ARIA attributes
- Focus management

## Building for Production

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

## Documentation

For more details about the techniques used in this project:

- [Svelte Actions Usage Guide](docs/svelte-actions.md) - Detailed explanation of traditional and modern action approaches

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
