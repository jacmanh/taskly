import common from '../messages/en/common.json';
import auth from '../messages/en/auth.json';
import tasks from '../messages/en/tasks.json';
import projects from '../messages/en/projects.json';
import workspaces from '../messages/en/workspaces.json';
import { I18nNamespaces } from './config';

export const messages = {
  common,
  auth,
  tasks,
  projects,
  workspaces,
} satisfies { [ns in I18nNamespaces]: any };
