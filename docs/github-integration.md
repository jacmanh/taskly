# GitHub Integration Feature

## Overview

This feature allows users to connect a GitHub repository to their workspace. Once connected, an AI agent analyzes the repository and generates a comprehensive context summary. This context is then used to help generate more relevant user stories and tasks.

## Architecture

### Backend Components

#### 1. Database Schema (`apps/api/prisma/schema/workspace.prisma`)

Added new fields to the `Workspace` model:
- `githubRepoUrl`: Full GitHub repository URL
- `githubRepoName`: Repository name (e.g., "taskly")
- `githubOwner`: Repository owner/organization
- `aiGeneratedContext`: AI-generated context from repository analysis

#### 2. GitHub Module (`apps/api/src/github/`)

**Services:**
- `GitHubService`: Handles GitHub API interactions
  - OAuth authorization flow
  - Access token exchange
  - Repository listing
  - Repository file fetching
  - README retrieval

- `GitHubAnalysisService`: AI-powered repository analysis
  - Fetches repository details, README, and configuration files
  - Analyzes project structure and important files
  - Uses OpenAI to generate comprehensive context summary

**Controllers:**
- `GitHubController`: REST API endpoints
  - `GET /github/auth/initiate`: Start OAuth flow
  - `GET /github/auth/callback`: Handle OAuth callback
  - `POST /github/repositories`: List user's repositories
  - `POST /github/analyze`: Analyze a repository

**Endpoints in Workspace:**
- `POST /workspaces/:id/github/connect`: Connect repository and save analysis

### Frontend Components

#### 1. Services (`apps/front/features/github/services/`)

- `github.service.ts`: API client for GitHub operations
  - Initiating OAuth
  - Handling OAuth callback
  - Fetching repositories
  - Analyzing repositories
  - Connecting to workspace

#### 2. Hooks (`apps/front/features/github/hooks/`)

- `useGitHub.ts`: React hooks for GitHub operations
  - `useGitHubAuth()`: Initiate OAuth flow
  - `useGitHubRepositories()`: Fetch user's repositories
  - `useAnalyzeRepository()`: Analyze a repository
  - `useConnectGitHubToWorkspace()`: Connect repo to workspace

#### 3. UI Components

- `GitHubIntegration`: Main integration component
  - OAuth connection button
  - Repository selection dropdown
  - Repository analysis and connection
  - Display connected repository info
  - Show AI-generated context

- `WorkspaceSettingsModal`: Updated with tabs
  - General settings tab
  - GitHub integration tab

- OAuth callback page: `/settings/github/callback`
  - Handles OAuth redirect
  - Exchanges code for token
  - Posts message to parent window

## Setup

### Backend Configuration

Add the following environment variables to `apps/api/.env`:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
GITHUB_REDIRECT_URI=http://localhost:4200/settings/github/callback

# OpenAI (for repository analysis)
OPENAI_API_KEY=your_openai_api_key
```

### GitHub OAuth App Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: "Taskly"
   - Homepage URL: `http://localhost:4200` (or your domain)
   - Authorization callback URL: `http://localhost:4200/settings/github/callback`
4. Copy the Client ID and Client Secret to your `.env` file

### Database Migration

Run the Prisma migration to add the new fields:

```bash
pnpm prisma:migrate
```

## User Flow

1. **Open Workspace Settings**: User clicks on workspace settings
2. **Navigate to GitHub Tab**: User switches to the "GitHub" tab
3. **Connect GitHub**: User clicks "Connecter GitHub"
4. **OAuth Authorization**: Popup window opens for GitHub OAuth
5. **Select Repository**: After authorization, user selects a repository from dropdown
6. **Analyze & Connect**: User clicks "Analyser et connecter"
7. **AI Analysis**: Backend analyzes the repository:
   - Fetches README
   - Analyzes project structure
   - Reads important configuration files (package.json, etc.)
   - Generates comprehensive context using OpenAI
8. **Save Context**: AI-generated context is saved to workspace
9. **Display**: User can see connected repository and generated context

## AI Analysis Process

The AI analysis examines:

1. **Repository Metadata**:
   - Name, description, primary language
   - README content

2. **Project Structure**:
   - Directory organization
   - File tree analysis

3. **Configuration Files**:
   - Package managers (package.json, requirements.txt, etc.)
   - Build tools (tsconfig.json, webpack config, etc.)
   - Docker files
   - Framework-specific configs

4. **Context Generation**:
   - Main purpose and functionality
   - Key technologies and frameworks
   - Architecture and structure
   - Main features and capabilities
   - Domain model and business logic

## Usage in Task Generation

The generated context is automatically used when generating tasks:
- The AI service reads both manual context and GitHub-generated context
- This provides more accurate and relevant task suggestions
- Helps understand the technical stack and project architecture

## Security Considerations

1. **Access Tokens**: GitHub access tokens are NOT stored in the database
   - Tokens are only used during the analysis process
   - Users must re-authorize for subsequent analyses

2. **OAuth State**: CSRF protection using state parameter

3. **Permissions**: OAuth scope is limited to `repo` and `read:user`

4. **Rate Limits**: Consider implementing caching to avoid GitHub API rate limits

## Future Enhancements

- Cache repository analysis to avoid re-analyzing
- Periodic re-analysis to keep context up-to-date
- Support for private repositories with stored access tokens (encrypted)
- GitHub webhook integration to auto-update on code changes
- Analysis of specific branches or commits
- Integration with GitHub Issues for task suggestions
