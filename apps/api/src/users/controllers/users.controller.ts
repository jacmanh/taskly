import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UsersService } from '../services/users.service';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findById(user.id);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  async updateCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateData: { name?: string; avatar?: string }
  ) {
    return this.usersService.updateProfile(user.id, updateData);
  }
}
