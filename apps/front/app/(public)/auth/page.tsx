import { redirect } from 'next/navigation'

const HelloPage = async () => {
  redirect('auth/signin')
}

export default HelloPage
