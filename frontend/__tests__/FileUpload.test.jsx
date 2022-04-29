import { render } from '@testing-library/react'
import FileUpload from '../components/FileUpload'


it('renders FileUpload unchanged', () => {
  const { container } = render(<FileUpload />)
  expect(container).toMatchSnapshot()
})