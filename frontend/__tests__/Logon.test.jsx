import { render } from '@testing-library/react'
import LoginForm from '../components/LoginForm'

it('renders LoginForm unchanged', () => {
  const { container } = render(<LoginForm />)
  expect(container).toMatchSnapshot()
})