import { AuthContext } from '@app/front/provider/AuthProvider'
import { renderHook } from '@testing-library/react'
import { ReactNode } from 'react'
import { useAuth } from './useAuth'

const mockAuthContextValue = {
  id: '1',
  email: 'mock@company.com',
  username: 'Mock User',
  companyId: '2',
  toto: true,
}

const AuthProviderMock = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={mockAuthContextValue}>
    {children}
  </AuthContext.Provider>
)

describe('useAuth', () => {
  it('should return the auth context value', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProviderMock,
    })

    expect(result.current).toStrictEqual(mockAuthContextValue)
  })

  it('should return undefined when no AuthProvider is used', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current).toBeUndefined()
  })
})
