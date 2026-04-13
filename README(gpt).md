# Prompt2Video – An AI-Assisted Remotion Tutorial Project
## Overview
This project is a tutorial-style demo that explores **Remotion**, a web-based video generation framework that was not covered in class, and shows how it can be integrated into a modern full-stack JavaScript application.
The application allows a user to:
1. Enter a natural-language prompt 2. Send the prompt to an AI model to generate structured video content 3. Preview the resulting video in the browser using Remotion Player 4. Render and export the final video as an MP4 file on the server
This project is designed as a **technology tutorial** rather than a production application. Its goal is to demonstrate how a student familiar with React / Node / Express can learn and apply a new tool outside the course material.
---
## Chosen Topic
The chosen topic for this assignment is:
> **Remotion for programmatic video generation in web development**
### Why this topic?
In this course, we focused on the MERN stack and modern web development practices. However, there are many useful tools and frameworks that extend what web developers can build.
Remotion is interesting because it allows developers to create videos using:
- React components- JavaScript / TypeScript- declarative UI patterns- frame-based animation logic
This makes it a strong example of a “beyond-the-course” technology that still connects naturally to concepts from MERN, especially React and Node.js.
---


## Main Idea

The main idea of this demo is to treat video generation as a **data-driven pipeline**:

```text
User Prompt
   ↓
AI generates structured video configuration (JSON)
   ↓
React + Remotion interpret that JSON as scenes and animations
   ↓
Server renders final MP4 output
```

Instead of manually editing a video in a timeline editor, this project uses code and structured data to generate the video automatically.

------

## Learning Goals

This project demonstrates:

- how to integrate a new web technology outside lecture content
- how to connect a React frontend to an Express backend
- how to use Remotion to create videos with React components
- how to turn AI output into structured JSON for media generation
- how to build a small full-stack tutorial project with documentation

------

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Remotion Player

### Backend

- Node.js
- Express
- CORS
- dotenv

### Video Generation

- Remotion
- `@remotion/player`
- `@remotion/renderer`
- `@remotion/bundler`

### AI / Validation

- OpenAI SDK (configured to call DeepSeek API)
- Zod
- `@remotion/zod-types`

------

## Project Structure

```

PROMPT2VIDEO/
├── frontend/                   # React frontend for prompt input and preview
│   ├── src/
│   │   ├── App.tsx            # Main frontend logic and UI
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Frontend styling
│   └── ...
│
├── remotion/
│   └── src/
│       ├── Root.tsx           # Registers Remotion compositions
│       ├── render.tsx         # Entry used by server-side rendering
│       ├── index.tsx          # Remotion entry
│       └── video/
│           ├── HelloWorld.tsx # Main video composition logic
│           └── HelloWorld/
│               ├── Logo.tsx
│               ├── Background.tsx
│               ├── Title.tsx
│               ├── Subtitle.tsx
│               └── FeatureScene.tsx
│
├── server/
│   ├── server.mjs             # Express backend and rendering pipeline
│   └── out/                   # Rendered MP4 output files
│
├── .env                       # API key file (not committed)
├── package.json               # Root package for Remotion-related setup
└── README.md
``
```



## Key Concepts in the Codebase

### 1. Frontend control layer

The frontend (`frontend/src/App.tsx`) is responsible for:

- collecting the user prompt
- calling backend APIs
- storing the current video configuration in React state
- previewing the generated video using Remotion Player
- sending the current configuration to the backend for export

### 2. Backend pipeline

The backend (`server/server.mjs`) is responsible for:

- receiving the user prompt
- calling an AI model to generate structured JSON
- returning that JSON to the frontend
- bundling and rendering the Remotion composition into an MP4 file

### 3. Remotion video system

The Remotion folder contains the actual video logic.

- `Root.tsx` defines what compositions exist
- `HelloWorld.tsx` interprets scene data and turns it into timed video content
- subcomponents such as `Logo`, `Title`, and `FeatureScene` handle visual pieces of the video

------

## How the Application Works

### Step 1 – User enters a prompt

A user types a theme such as:

- “technology”
- “healthy food”
- “study tips”
- “coding productivity”

### Step 2 – AI generates video configuration

The backend sends that prompt to an AI model, which returns structured JSON such as:

```json
{
  "themeColor": "#FFFFFF",
  "logoColor1": "#91EAE4",
  "logoColor2": "#86A8E7",
  "scenes": [
    {
      "type": "intro",
      "title": "Smart Study Strategies",
      "subtitle": "Work better, not harder"
    },
    {
      "type": "features",
      "title": "Three Key Ideas",
      "items": [
        "Plan your sessions",
        "Remove distractions",
        "Review actively"
      ]
    }
  ]
}
```

### Step 3 – Frontend previews the video

This JSON is stored in React state and passed into the Remotion Player.
 The preview updates automatically because the video is rendered from props.

### Step 4 – Server renders the MP4

When the user clicks export, the frontend sends the current `videoConfig` to the backend.
 The backend uses Remotion’s renderer to generate a real MP4 file.

------

## Important Files Explained

## `frontend/src/App.tsx`

This is the main frontend controller.

It:

- stores `videoConfig`
- handles user input
- calls `/api/generate-config`
- calls `/api/render`
- calculates total frame count for preview
- renders the preview player

This file is important because it connects the UI to the backend and the video engine.

------

## `server/server.mjs`

This is the backend service.

It contains two main endpoints:

### `POST /api/generate-config`

This endpoint:

- receives the prompt
- sends the prompt to the AI model
- asks the model to return strict JSON
- parses the response
- returns a video configuration object

### `POST /api/render`

This endpoint:

- receives the current video config
- bundles the Remotion project
- selects the correct composition
- renders the final MP4 file
- returns the output path

This file is important because it shows how AI and video rendering are integrated into one backend pipeline.

------

## `remotion/src/Root.tsx`

This file registers Remotion compositions.

It defines:

- composition ID
- frame rate
- resolution
- default props
- validation schema
- dynamic duration calculation

This file is important because it shows how Remotion organizes video projects.

------

## `remotion/src/video/HelloWorld.tsx`

This is the most important video file in the project.

It:

- defines the schema for the expected JSON input
- reads the current frame
- calculates animation values
- maps scene data onto timed sequences
- renders different scene types such as intro and feature list

This file is the best example of how data can drive video generation.

------

## Why This Project Is Relevant to MERN

This project is related to MERN in the following ways:

- **React** is used for the frontend interface
- **Node.js + Express** are used for the backend API
- the project follows a modern full-stack web workflow
- it extends MERN by adding a new media-generation technology

------

## Comparison: Remotion vs Traditional Web UI

### Similarities

- both use React components
- both use props and state
- both can be broken into reusable components
- both benefit from TypeScript and modular design

### Differences

- web UI reacts to user events and browser state
- Remotion reacts to **video frames and timeline position**
- video composition requires timing, sequencing, and animation logic
- rendering a final MP4 requires server-side or CLI rendering tools

------

## Comparison: Remotion vs Traditional Video Editors

### Advantages of Remotion

- videos can be generated from data
- templates are easy to reuse
- content can be personalized automatically
- developers can use familiar React patterns
- integrates well with APIs and AI

### Trade-offs

- requires programming knowledge
- frame-based thinking can be unfamiliar
- not ideal for all creative editing tasks
- rendering can be computationally expensive





## Setup Instructions

## 1. Clone the repository

```shell
git clone <your-github-classroom-repo-url>
cd PROMPT2VIDEO
```

## 2. Install dependencies

Install root dependencies:

```shell
npm install	
```

 Install frontend dependencies:

```shell
cd frontend
npm install
cd ..
```



Install server dependencies:

```shell
cd server
npm install
cd ..
```

## 3. Configure environment variables

Create a `.env` file in the **project root**:

```
DEEPSEEK_API_KEY=your_api_key_here
```



## 4.Start the backend

```shell
cd server
node server.mjs
```

The backend should start on:

```
http://localhost:5000
```

## 5. Start the frontend

Open another terminal:

```shell
cd frontend
npm run dev
```

Vite will usually start the frontend on something like:

```
http://localhost:5173
```

## 6. Use the app

1. Open the frontend in your browser
2. Enter a prompt
3. Click **Generate** to create a video config
4. Preview the video in the Remotion player
5. Click **Export** to render the final MP4

Rendered videos will be saved in:

```
server/out/
```

## Example Prompt Ideas

Try prompts such as:

- `healthy breakfast ideas`
- `future of AI education`
- `eco-friendly lifestyle`
- `coding tips for beginners`
- `productivity for university students`

------

## Troubleshooting

### Problem: Cannot connect to backend

Make sure:

- the backend is running
- the frontend is calling the correct port
- CORS is enabled

### Problem: AI generation fails

Check:

- your `.env` file exists
- the API key is valid
- the backend terminal shows no API errors

### Problem: Render fails

Check:

- the Remotion composition ID matches the backend
- all dependencies are installed
- the video config matches the expected schema

### Problem: Empty or broken preview

Check:

- that the generated JSON includes a valid `scenes` array
- that each scene has the required fields
- that `videoConfig` is being passed correctly to the player

------

## Limitations

This is a tutorial/demo project, so it has some limitations:

- limited scene types
- no user authentication
- no database persistence
- no cloud deployment
- no job queue for long renders
- AI output depends on model quality and prompt clarity

------

## Possible Future Improvements

If this project were extended, useful next steps would include:

- adding more scene types
- adding voiceover and subtitles
- saving prompt history in MongoDB
- supporting user accounts
- deploying render jobs to the cloud
- allowing custom templates
- adding a better download flow in the frontend

------

## What I Learned

This project taught me:

- how Remotion structures a video project
- how React concepts can be applied to media generation
- how to use structured AI output in a web pipeline
- how frontend, backend, and rendering logic can work together

------

## Notes for Peer Reviewers

To run this project successfully, please make sure you:

1. install dependencies in the root, frontend, and server folders
2. create a valid `.env` file in the project root
3. run the backend before using the frontend
4. use the provided example prompts if needed

If something still does not work, please check the terminal output first, as most errors will appear there.



## Author

Created as an individual course COMPSCI732 assignment exploring a web development tool outside the lecture material.

Topic focus: **Remotion + AI-assisted prompt-to-video generation**

E-mail: zluo596@aucklanduni.ac.nz





