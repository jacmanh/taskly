export const appRoutes = {
  /**
   * Build the route for a project inside a workspace using both slugs.
   * Example: /workspace-slug/project-slug
   */
  workspaceProject(workspaceSlug: string, projectSlug: string) {
    const workspace = encodeURIComponent(workspaceSlug);
    const project = encodeURIComponent(projectSlug);
    return `/${workspace}/${project}`;
  },
};
