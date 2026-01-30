# AI Prompts

This directory contains prompt templates used by the AI system to generate tasks and other content.

## Directory Structure

```
prompts/
├── prompt-loader.service.ts          # Service that provides prompts
├── task-generation.prompts.ts        # Task generation prompt constants
└── README.md                         # This file
```

## Prompt Types

### Task Generation

**Purpose**: Generate technical, implementation-level tasks based on user requests.

**Files**:
- `task-generation.prompts.ts` - Contains both system and user prompt templates as TypeScript constants

**Current Variant**: Technical tasks (developer-focused, implementation-level)

**Future Variants** (easy to add):
- Product-oriented tasks (product manager-focused, user story level)
- QA/Testing tasks (QA-focused, test case level)

## How to Modify Prompts

### 1. Edit Prompt Constants

Prompts are TypeScript constants - just edit them directly:

1. Open `task-generation.prompts.ts`
2. Edit `TASK_GENERATION_SYSTEM_PROMPT` or `TASK_GENERATION_USER_PROMPT_TEMPLATE`
3. Save the file
4. Restart the API server (`pnpm dev:api`)

### 2. Adding a New Prompt Variant

To add a new variant (e.g., product-oriented tasks):

1. Add new constants to `task-generation.prompts.ts`:
   ```typescript
   export const TASK_GENERATION_SYSTEM_PROMPT_PRODUCT = `...`;
   ```

2. Update `PromptLoader` to support variant selection:
   ```typescript
   getSystemPrompt(type: PromptType, variant?: string): string
   ```

3. Update the API to accept a `promptVariant` parameter in `GenerateTasksDto`

4. No database migration needed!

## Template Syntax

The user prompt template uses a simple Handlebars-like syntax for variable interpolation:

### Variables
```
{{variableName}}
```
- Replaces with the value of `variableName` from context
- Empty string if undefined or null

### Conditionals
```
{{#if variableName}}
  This is shown if variableName is truthy
{{/if}}
```

```
{{#if variableName}}
  This is shown if variableName is truthy
{{else}}
  This is shown if variableName is falsy
{{/if}}
```

### Available Variables

For task generation (`GenerateTasksContext`):
- `workspaceName` - Name of the workspace (required)
- `workspaceContext` - Additional workspace context (optional)
- `projectName` - Name of the project (required)
- `projectDescription` - Project description (optional)
- `projectContext` - Additional project context (optional)
- `prompt` - User's task generation request (required)
- `numberOfTasks` - Explicit number of tasks to generate (optional)

## Writing Effective Prompts

### System Prompts

**Do**:
- Be explicit about output format and structure
- Define clear quality constraints
- Specify what to avoid (e.g., "no generic tasks")
- Include acceptance criteria guidelines
- Align with your domain/tech stack

**Don't**:
- Use vague instructions
- Assume context the AI doesn't have
- Overcomplicate with unnecessary rules

### User Prompts

**Do**:
- Provide workspace/project context for domain alignment
- Use clear variable names
- Structure information logically
- Use conditionals to avoid empty sections

**Don't**:
- Hardcode values that should be variables
- Include sensitive information in templates

## Testing Prompts

### Local Testing

1. Start the API: `pnpm dev:api`
2. Use the `/workspaces/:id/ai/generate-tasks` endpoint
3. Review generated task batches in the UI or API response
4. Iterate on prompts based on output quality

### Quality Checklist

Good task generation output should have:
- ✅ Specific, actionable titles
- ✅ Clear descriptions with context
- ✅ Appropriate priorities
- ✅ Acceptance criteria (for technical tasks)
- ✅ No overlapping responsibilities
- ✅ Realistic scope (0.5-2 days per task)

## Versioning Strategy

For now, prompts are versioned through git:
- Track changes in git commits
- Use descriptive commit messages when updating prompts
- Document significant prompt changes in this README

Future: Consider prompt versioning if you need A/B testing or rollback capabilities.

## Architecture Benefits

This TypeScript constant approach provides:

1. **Separation of Concerns**: Prompts are isolated in dedicated files
2. **Type Safety**: Full TypeScript support and IDE features
3. **Version Control**: Track prompt evolution in git
4. **Reliability**: No file I/O, no build configuration, works everywhere
5. **Extensibility**: Add new variants by adding constants
6. **No Database Migration**: Changes don't require schema updates
7. **Production Ready**: No deployment concerns (Docker, serverless, etc.)

## Questions?

For technical questions about the prompt system, see:
- `prompt-loader.service.ts` - Implementation details
- `ai.provider.ts` - How prompts are used
- `ai.service.ts` - Business logic that calls the AI
