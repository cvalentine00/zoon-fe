import { Modal, SpacedText } from '@zooniverse/react-components'
import counterpart from 'counterpart'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, DataTable, Heading, Paragraph } from 'grommet'

import { columns, fetchRows, fetchSubjects, searchParams } from './helpers'
import en from './locales/en'

counterpart.registerTranslations('en', en)

/*
  Grommet is opinionated about line-height and links it to font-size.
  Reset the heading baselines here so that spacing is measured from
  the tops and bottoms of the letters (without changing the text size.)
  https://matthiasott.com/notes/the-thing-with-leading-in-css
*/

const StyledBox = styled(Box)`
  min-height: 30px;
`
const StyledHeading = styled(Heading)`
  line-height: 100%;
`

const SubjectDataTable = styled(DataTable)`
  button {
    padding: 0;
  }
  th button {
    color: ${props => props.theme.global.colors['dark-1']};
    font-weight: bold;
    text-transform: uppercase;
  }
  th svg {
    stroke: ${props => props.theme.global.colors['dark-1']};
  }
`

const PAGE_SIZE = 100

export default function SubjectPicker({ baseUrl, subjectSet, workflow }) {
  const [ rows, setRows ] = useState([])
  const [ query, setQuery ] = useState('')
  const [ sortField, setSortField ] = useState('subject_id')
  const [ sortOrder, setSortOrder ] = useState('asc')
  const { indexFields } = subjectSet.metadata
  const customHeaders = indexFields ? indexFields.split(',') : ['date', 'title', 'creators']

  async function fetchSubjectData() {
    const subjects = await fetchSubjects('15582', query, sortField, sortOrder, PAGE_SIZE)
    const rows = await fetchRows(subjects, workflow, PAGE_SIZE)
    setRows(rows)
  }

  useEffect(function onChange() {
    fetchSubjectData()
  }, [query, sortField, sortOrder])

  function search(data) {
    const query = searchParams(data)
    setQuery(query)
  }

  function sort(data) {
    const { property: sortField, direction: sortOrder } = data
    if (sortField === 'status') {
      return true;
    }
    setSortField(sortField)
    setSortOrder(sortOrder)
  }

  const background = {
    header: "accent-2",
    body: ["white", "light-1"]
  }
  const pad = {
    header: "xsmall",
    body: "xsmall"
  }

  /*
    Vertical spacing for the picker instructions.
    The theme's named margins are set in multiples of 10px, so set 15px explicitly.
  */
  const textMargin = {
    top: '15px',
    bottom: 'medium'
  }
  return (
    <>
      <StyledHeading
        level={3}
        margin={{ top: 'xsmall', bottom: 'none' }}
      >
        {counterpart('SubjectPicker.heading')}
      </StyledHeading>
      <Paragraph
        margin={textMargin}
      >
        {counterpart('SubjectPicker.byline')}
      </Paragraph>
      <StyledBox
        background='brand'
        fill
        pad={{
          top: '5px',
          bottom: 'none',
          horizontal: 'none'
        }}
      >
        <Paragraph
          color="white"
          margin='none'
          textAlign='center'
        >
          <SpacedText
            margin='medium'
            weight='bold'
          >
            {subjectSet.display_name}
          </SpacedText>
        </Paragraph>
      </StyledBox>
      <SubjectDataTable
        background={background}
        columns={columns(customHeaders, baseUrl)}
        data={rows}
        fill
        onSearch={debounce(search, 500)}
        onSort={sort}
        pad={pad}
        pin
        replace
        sortable
        step={PAGE_SIZE}
      />
    </>
  )
}