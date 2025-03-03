'use client'

import { useGetMe } from '@app/front/features/users/api/users.api'

const UserPage = () => {
  const { data: user, isLoading } = useGetMe()

  return (
    <div className="p-4">
      <h1>User Profile</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      )}
    </div>
  )
}

export default UserPage
