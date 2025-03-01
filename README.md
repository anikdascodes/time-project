# TaskFlow Pro

A modern task management application built with React and TypeScript, featuring time tracking, task organization, and smart notifications.



## Features

### 📋 Task Management
- Create tasks with titles, descriptions, estimated time, priorities, and due dates
- Tag-based organization system
- Filter tasks by status, priority, and search terms
- Drag-and-drop task organization (coming soon)

### ⏱️ Time Tracking
- Built-in timer for active tasks
- Break tracking
- Time statistics and progress visualization
- Automatic overtime detection
- Track total active time and break periods

### 📊 Statistics & Analytics
- Task completion rates
- Time estimation accuracy
- Productivity trends
- Break time analysis

### 📝 Sticky Notes
- Quick note-taking functionality
- Color-coded notes
- Edit and organize notes
- Persistent storage

### 🎨 User Experience
- Clean, modern interface
- Dark mode support
- Responsive design
- Desktop notifications
- Sound alerts
- Local storage persistence

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (coming soon)
- **Database**: PostgreSQL (coming soon)

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/taskflow-pro.git
cd taskflow-pro
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open http://localhost:5173 in your browser

## Usage

### Creating a Task

1. Click "Add New Task" button
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Estimated time in minutes (required)
   - Priority level
   - Due date (optional)
   - Tags (optional)
3. Click "Add Task" to create

### Managing Tasks

- Start a task: Click the "Start" button
- Pause a task: Click the "Pause" button while task is running
- Complete a task: Click the "Complete" button
- Delete a task: Click the "Delete" button

### Time Tracking

- Active task timer appears at the bottom of the screen
- Shows elapsed time, remaining time, and total estimated time
- Progress bar indicates completion percentage
- Sound alerts when estimated time is reached
- Toggle sound notifications on/off

### Using Sticky Notes

- Click "Add Note" in the sidebar
- Write your note content
- Notes are automatically saved
- Edit or delete notes as needed
- Color-coding is automatically assigned

## Project Structure

\`\`\`
src/
├── components/          # React components
│   ├── TaskForm.tsx    # Task creation form
│   ├── TaskList.tsx    # Task list container
│   ├── TaskItem.tsx    # Individual task component
│   ├── Timer.tsx       # Task timer component
│   └── ...
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/               # Third-party integrations
\`\`\`

## Development Status

Current Version: 0.1.0

### Upcoming Features

- [ ] Task categories and projects
- [ ] Data synchronization with Supabase
- [ ] User authentication
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] Mobile app version
- [ ] Calendar integration
- [ ] Export/import functionality

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Animation library by [Framer Motion](https://www.framer.com/motion)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)
