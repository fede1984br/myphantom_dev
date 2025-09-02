#!/bin/bash

echo "Creating project configuration files..."

# Create package.json
cat <<EOF > package.json
{
  "name": "my-phantom-ai",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "lucide-react": "^0.363.0",
    "date-fns": "^2.29.3"
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "tailwindcss": "^3.4.1",
    "typescript": "^4.9.5",
    "@types/react": "^18.2.74",
    "@types/react-dom": "^18.2.24",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# Create tsconfig.json
cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["*"]
    }
  },
  "include": [
    "Components",
    "Pages",
    "Layout.js"
  ]
}
EOF

# Create tailwind.config.js
cat <<EOF > tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Layout.js",
    "./Pages/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Create postcss.config.js
cat <<EOF > postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create styles/index.css
mkdir -p styles
cat <<EOF > styles/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Create README.md
cat <<EOF > README.md
# MyPhantom.AI

This is a React-based web application that serves as a learning companion for students. It includes features like a student dashboard, quest maps, achievements, and progress tracking.

## Getting Started

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or [Yarn](https://yarnpkg.com/)) installed on your machine.

### Installation

1. Clone the repository:
   \`\`\`sh
   git clone <repository-url>
   \`\`\`
2. Navigate to the project directory:
   \`\`\`sh
   cd <project-directory>
   \`\`\`
3. Run the setup script:
   \`\`\`sh
   bash setup.sh
   \`\`\`
4. Install the dependencies:
   \`\`\`sh
   npm install
   \`\`\`
   or
   \`\`\`sh
   yarn install
   \`\`\`

### Running the Application

To start the development server, run:

\`\`\`sh
npm start
\`\`\`
or
\`\`\`sh
yarn start
\`\`\`

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Status

This project is currently missing some key components:

*   **Data Layer**: The data fetching logic, which is expected to be in the \`@/entities\` directory, is not implemented. The components currently use placeholder data or expect a data-fetching implementation that does not exist.
*   **Tests**: There are no automated tests for the components or the application.

## Learn More

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
EOF

# Create .gitignore
cat <<EOF > .gitignore
# Dependencies
/node_modules

# Build artifacts
/build
/dist
.DS_Store

# Local environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

echo "Project configuration files created successfully."
echo "You can now run 'npm install' to install dependencies."
