import { describe, it, expect } from 'vitest'

import { DescriptionInfo } from './DescriptionInfo'
import { render, screen } from '../test/test-utils'

const sampleDescriptionInfo = {
  url: 'https://test.com',
  description: 'This is a description',
}
const sampleDescriptionInfoLongUrl = {
  url: 'https://test.com?this_is_a_long_url_to_test_url_truncation_is_working_nicely_with_super_long_urls_that_would_not_fit_well_on_a_wide_screen_that_most_us_priviledged_geeks_use_nowadays',
  description: '',
}

describe('DescriptionInfo', () => {
  it('renders without crashing', () => {
    expect(() => render(<DescriptionInfo diagnosticData={sampleDescriptionInfo} />)).not.toThrow()
  })

  it('displays basic info', () => {
    render(<DescriptionInfo diagnosticData={sampleDescriptionInfo} />)

    expect(screen.getByText(sampleDescriptionInfo.description)).toBeInTheDocument()
    expect(screen.getByTitle(sampleDescriptionInfo.url)).toBeInTheDocument()
  })

  it('truncates long URLs nicely', () => {
    render(<DescriptionInfo diagnosticData={sampleDescriptionInfoLongUrl} />)

    expect(screen.getByTitle(sampleDescriptionInfoLongUrl.url)).toBeInTheDocument()
    expect(
      screen.getByText(
        'https://test.com?this_is_a_long_url_to_test_url_truncation_is_working_nicely_with_super_lo...owadays'
      )
    ).toBeInTheDocument()
  })

  it('renders no description properly', () => {
    render(<DescriptionInfo diagnosticData={sampleDescriptionInfoLongUrl} />)

    expect(screen.getByText('No description provided')).toBeInTheDocument()
  })
})
