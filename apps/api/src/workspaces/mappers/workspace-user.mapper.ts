import { WorkspaceMember, User } from '@prisma/client';

type WorkspaceMemberWithUser = WorkspaceMember & {
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
};

/**
 * Maps workspace members to a list of users
 * Extracts only the user information from workspace member entities
 */
export class WorkspaceUserMapper {
  /**
   * Maps a single workspace member to user
   */
  static toUser(member: WorkspaceMemberWithUser) {
    return {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      avatar: member.user.avatar,
    };
  }

  /**
   * Maps an array of workspace members to users
   */
  static toUsers(members: WorkspaceMemberWithUser[]) {
    return members.map((member) => this.toUser(member));
  }
}
