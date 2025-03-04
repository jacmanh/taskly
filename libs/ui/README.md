# UI Component Library

This library contains reusable UI components for the Taskly application. Components are organized into atoms (basic building blocks) and molecules (combinations of atoms).

## Component Structure

- **Atoms**: Basic UI components like Button, Card, Field, FormField, and Typography
- **Molecules**: More complex components like Avatar, Dropdown, and TaskItem

## Testing Approach

The UI components in this library are tested using Storybook's interaction testing capabilities. This approach provides several advantages:

### Visual Testing

Storybook provides a visual way to test components, allowing developers to:
- Verify component appearance in different states
- Ensure consistent styling across the application
- Document component variants and use cases

### Interaction Testing

Each component story includes interaction tests using the `play` function, which:
- Tests component rendering
- Verifies interactive behavior
- Ensures accessibility and proper DOM structure
- Validates component state changes

### Running Tests

To run the Storybook tests:

```bash
# Start Storybook development server
nx run ui:storybook

# Run Storybook tests in development mode
nx run ui:test-storybook

# Run Storybook tests in CI mode (build Storybook first, then run tests)
nx run ui:test
```

### CI Integration

The Storybook tests are integrated into our CI pipeline:

1. The GitHub Actions workflow builds the Storybook static site
2. It then starts an HTTP server to serve the static site
3. The test-storybook command runs against this server
4. Test results are saved in JUnit format for reporting

This ensures that all UI components are tested automatically on each pull request and push to main.

## Adding New Components

When adding new components:

1. Create the component file in the appropriate directory (atoms or molecules)
2. Create a stories file with the same name (e.g., `Button.stories.tsx`)
3. Include interaction tests in the stories using the `play` function
4. Document the component's props and usage

## Running unit tests

Run `nx test ui` to execute the unit tests via [Vitest](https://vitest.dev/).
