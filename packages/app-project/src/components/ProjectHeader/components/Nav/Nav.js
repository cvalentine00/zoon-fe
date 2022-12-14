import counterpart from 'counterpart'
import { Box } from 'grommet'
import { arrayOf, shape, string } from 'prop-types'
import React from 'react'

import NavLink from '@shared/components/NavLink'
import en from './locales/en'

counterpart.registerTranslations('en', en)

function Nav (props) {
  const { navLinks } = props
  return (
    <Box aria-label={counterpart('ProjectNav.ariaLabel')} as='nav'>
      <Box as='ul' direction='row'>
        {navLinks.map(navLink => (
          <Box as='li' key={navLink.href} pad={{ left: 'medium' }}>
            <NavLink link={navLink} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

Nav.propTypes = {
  navLinks: arrayOf(
    shape({
      href: string
    })
  )
}

export default Nav
