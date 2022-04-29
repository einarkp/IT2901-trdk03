import { render } from '@testing-library/react'
import Nav from '../components/Nav'


it('renders Nav unchanged', () => {
  const { container } = render(<Nav />)
  expect(container).toMatchSnapshot()
})