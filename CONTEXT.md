Skip to content
Navigation Menu
ryokun6
ryos

Type / to search

Code
Issues
1
Pull requests
37
Actions
Projects
Security
Insights
Owner avatar
ryos
Public
ryokun6/ryos
Go to file
t
Name		
ryokun6
ryokun6
Merge pull request #269 from ryokun6/cursor/fix-bun-build-errors-4936
edd301a
 · 
yesterday
.cursor
Remove the 'start' entry from environment.json for streamlined config…
3 weeks ago
api
Add Redis-based authentication and rate limit bypass for ryo
last week
public
Update music metadata parser instructions and add new video entry
2 weeks ago
scripts
Revert "Remove chat-rooms.js file and update ControlPanelsAppComponen…
2 weeks ago
src
Checkpoint before follow-up message
yesterday
.gitignore
Merge branch 'main' into codex/add-window-closing-usesound-to-dialog-…
3 months ago
.hintrc
Refactor TextEditAppComponent to improve code readability and maintai…
3 months ago
LICENSE
Add license section to README.md
3 months ago
README.md
Update README.md to include new themes and enhance description of ryO…
3 weeks ago
bun.lock
Replace bad-words with leo-profanity for enhanced profanity filtering
2 weeks ago
bun.lockb
Update WallpaperPicker component to increment IndexedDB version to 3,…
5 months ago
components.json
I apolog
7 months ago
eslint.config.js
I apolog
7 months ago
index.html
Improve mobile touch interactions and prevent unwanted gestures (#170)
last month
package.json
Replace bad-words with leo-profanity for enhanced profanity filtering
2 weeks ago
tailwind.config.js
Enhance Tailwind configuration with new OS theme colors and metrics. …
last month
tsconfig.app.json
Enhance TypeScript configuration and improve UI components
4 months ago
tsconfig.json
Enhance TypeScript configuration and improve UI components
4 months ago
tsconfig.node.json
I apolog
7 months ago
vercel.json
feat(vercel): enhance icon routing and caching strategy
3 weeks ago
vite.config.ts
chore(icons): refactor icon handling and update configurations
3 weeks ago
Repository files navigation
README
AGPL-3.0 license
ryOS — A web-based agentic AI OS, made with Cursor
A modern web-based desktop environment inspired by classic macOS, built with a cutting-edge web stack and AI. Features multiple built-in applications, a familiar desktop interface, and a system context-aware AI agent. Works on all devices—including mobile, tablet, and desktop.

Features
Desktop Environment
Authentic macOS and Windows-style desktop interactions
Multi-instance window manager with support for multiple windows per app
Cross-device window resizers
Menubar with app-specific menus (or taskbar + Start menu on Windows themes)
Icon and list views
Customizable wallpapers (photos, patterns, or videos)
System-wide sampled and synthesizer sound effects
System-wide UI, Chats, and Terminal sounds
System-wide Ryo AI, with tool calls and context of running applications
Virtual file system with local storage persistence and one-click Backup / Restore
Themes
Four switchable themes: System 7, Aqua (Mac OS X), Windows XP, Windows 98
Menu & chrome: mac themes use a top menubar with traffic-light controls; Windows themes use a bottom taskbar with a Start menu and classic window buttons
Fonts & icons: theme-specific system fonts and ThemedIcon assets for authentic look
Wallpapers: theme-specific default photo/tile/video wallpapers
Controls: select, dropdowns, buttons, and resizers are styled per theme, including mobile-safe resizers for XP/98
Built-in Applications
Finder: File manager with Quick Access & Storage Info
TextEdit: Rich text editing with markdown support and task lists
Multi-window support - open multiple documents simultaneously
Each window maintains independent document state
Automatic instance management and document tracking
Smart file opening with existing window detection
MacPaint: Classic bitmap graphics editor
Drawing tools (pencil, brush, spray, eraser)
Shape tools (rectangle, oval, line)
Fill patterns and colors
Spray tool simulates a dithered airbrush and defaults to a larger size
Brush tool starts with a thicker stroke while the pencil starts thin
Selection and move tools
Undo/redo support
Image file import/export support
Videos: Retro-style YouTube playlist player
VCR-style interface with LCD display
Add and manage YouTube videos
Playlist management with shuffle and repeat modes
Scrolling titles and classic CD player controls
Local storage persistence
Soundboard: Create and manage custom soundboards
Record sounds directly from microphone
Multiple soundboards support
Waveform visualization
Keyboard shortcuts (1-9)
Import/export functionality
Emoji and title customization
Enhanced synth effects
Synth: Virtual synthesizer with retro aesthetics
Virtual keyboard with computer key support
Multiple oscillator waveforms (sine, square, sawtooth, triangle)
Effects including reverb, delay, and distortion
Customizable synth parameters
MIDI input support
Preset saving and loading
Classic synthesizer UI design
Photo Booth: Camera app with effects
Take photos with your webcam
Multiple photo effects and filters
Brightness and contrast adjustments
Photo gallery with thumbnails
Multi-photo sequence mode
Export photos to Files
Real-time filter preview
Internet Explorer: Classic browser with a temporal twist
Time Machine view to explore snapshots across different years
AI reimagines pre-1996 sites and generates futuristic designs
Save favorites by year and share time-travel links
Chats: AI-powered chat with speech & tool calling
Natural conversation with Ryo AI
Join public chat rooms with @ryo mentions
Push-to-talk voice messages with real-time transcription
Text-to-speech for AI responses with word highlighting
Control apps and edit documents via chat commands
Nudge system (👋) with context-aware responses
ryOS FM DJ mode - when music plays, Ryo becomes a radio DJ
Tool calling capabilities for system integration
Save transcript to Markdown
Speech synthesis with volume controls
Control Panels: System preferences & power tools
Appearance & shader selection (CRT, Galaxy, Aurora)
UI / typing / Terminal sound toggles
One-click full Backup / Restore
Format or reset the virtual file system
Minesweeper: Classic game implementation
Virtual PC: DOS game emulator
Play classic games like Doom and SimCity
DOS environment emulation
Game save states
Terminal: Unix-like CLI with built-in AI
Familiar commands (ls, cd, cat, touch, vim, edit, …)
↑ / ↓ history & auto-completion
"ryo " to chat with AI assistant
Open documents in TextEdit or Vim straight from prompt
Toggle distinctive Terminal sounds in View ▸ Sounds
iPod: 1st-generation iPod-style music player
Import any YouTube URL to build your music library
Classic click-wheel navigation and back-light toggle
Shuffle and loop playback modes
Create playlists and organize tracks
Time-synced lyrics with multi-language translation
Interactive lyric offset adjustment via gestures
Multiple lyric alignment modes (Focus Three, Alternating, Center)
Chinese character variants (Traditional/Simplified) and Korean romanization
Fullscreen lyrics mode with video support
Real-time lyric highlighting during playback
Library persisted locally for offline playback
Project Structure
project/
├── public/           # Static assets
│   ├── assets/       # Videos, sounds, and other media
│   ├── fonts/        # Font files
│   ├── icons/        # UI icons organized by category
│   ├── patterns/     # Pattern files
│   └── wallpapers/   # Wallpaper images (photos and tiles)
├── src/
│   ├── apps/         # Individual application modules
│   │   └── [app-name]/ # Each app has its own directory
│   │       ├── components/ # App-specific components
│   │       ├── hooks/      # Custom hooks specific to the app
│   │       └── utils/      # Utility functions for the app
│   ├── components/   # Shared React components
│   │   ├── dialogs/    # Dialog components
│   │   ├── layout/     # Layout components
│   │   ├── shared/     # Shared components across applications
│   │   └── ui/         # UI components (shadcn components)
│   ├── config/       # Configuration files
│   ├── contexts/     # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Libraries and utilities
│   ├── stores/       # State management (e.g., Zustand stores)
│   ├── styles/       # CSS and styling utilities
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── api/              # API endpoints
└── ...config files   # e.g., vite.config.ts, tsconfig.json, package.json
Development
The project uses:

TypeScript for type safety
ESLint for code quality
Tailwind for utility-first CSS
shadcn/ui components built on Radix UI primitives
Lucide icons
Vercel for deployment
Scripts
bun dev - Start development server
bun run build - Build for production
bun run lint - Run ESLint
bun run preview - Preview production build
License
This project is licensed under the AGPL-3.0 License - see the LICENSE file for details.

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

About
ryOS, made with Cursor

os.ryo.lu
Resources
 Readme
License
 AGPL-3.0 license
 Activity
Stars
 682 stars
Watchers
 6 watching
Forks
 108 forks
Report repository
Releases
No releases published
Packages
No packages published
Contributors
7
@ryokun6
@cursoragent
@devin-ai-integration[bot]
@google-labs-jules[bot]
@ben-maclaurin
@gravelBridge
@markmready
Deployments
500+
 Production yesterday
 Preview yesterday
+ more deployments
Languages
TypeScript
91.0%
 
JavaScript
5.1%
 
CSS
3.5%
 
Other
0.4%
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
