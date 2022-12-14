import nock from 'nock'

import getDefaultPageProps from './'

describe('Components > ProjectHomePage > getDefaultPageProps', function () {
  const PROJECT = {
    id: '1',
    default_workflow: '1',
    primary_language: 'en',
    slug: 'test-owner/test-project',
    links: {
      active_workflows: ['1']
    }
  }

  const TRANSLATION = {
    translated_id: 1,
    strings: {
      display_name: 'Foo'
    }
  }

  const WORKFLOW = {
    id: '1',
    completeness: 0.4,
    grouped: false,
    links: {
      subject_sets: ['1', '2', '3']
    }
  }

  function subjectSet(id) {
    return {
      id,
      display_name: `test set ${id}`,
      set_member_subjects_count: 10
    }
  }

  describe('with the staging API', function () {
    before(function () {
      const slug = 'test-owner/test-project'
      const scope = nock('https://panoptes-staging.zooniverse.org/api')
        .get('/projects')
        .query(query => query.slug === slug)
        .reply(200, {
          projects: [PROJECT]
        })
        .get('/translations')
        .query(query => {
          return query.translated_type === 'workflow'
          && query.translated_id === '1'
          && query.language === 'en'
        })
        .reply(200, {
          translations: [TRANSLATION]
        })
        .get('/workflows')
        .query(query => query.id === '1')
        .reply(200, {
          workflows: [WORKFLOW],
          linked: {
            subject_sets: [
              subjectSet('1'),
              subjectSet('2'),
              subjectSet('3')
            ]
          }
        })
    })

    it('should return the project\'s active workflows', async function () {
      const params = {
        owner: 'test-owner',
        project: 'test-project'
      }
      const query = {
        env: 'staging'
      }
      const req = {
        connection: {
          encrypted: true
        },
        headers: {
          host: 'www.zooniverse.org'
        }
      }
      const res = {}
      const { props } = await getDefaultPageProps({ params, query, req, res })
      expect(props.workflows).to.deep.equal([
        {
          completeness: 0.4,
          default: true,
          grouped: false,
          id: '1',
          displayName: 'Foo',
          subjectSets: [
            subjectSet('1'),
            subjectSet('2'),
            subjectSet('3')
          ]
        }
      ])
    })
  })

  describe('with the production API', function () {
    before(function () {
      const slug = 'test-owner/test-project'
      const scope = nock('https://www.zooniverse.org/api')
        .get('/projects')
        .query(query => query.slug === slug)
        .reply(200, {
          projects: [PROJECT]
        })
        .get('/translations')
        .query(query => {
          return query.translated_type === 'workflow'
          && query.translated_id === '1'
          && query.language === 'en'
        })
        .reply(200, {
          translations: [TRANSLATION]
        })
        .get('/workflows')
        .query(query => query.id === '1')
        .reply(200, {
          workflows: [WORKFLOW],
          linked: {
            subject_sets: [
              subjectSet('1'),
              subjectSet('2'),
              subjectSet('3')
            ]
          }
        })
    })

    it('should return the project\'s active workflows', async function () {
      const params = {
        owner: 'test-owner',
        project: 'test-project'
      }
      const query = {
        env: 'production'
      }
      const req = {
        connection: {
          encrypted: true
        },
        headers: {
          host: 'www.zooniverse.org'
        }
      }
      const res = {}
      const { props } = await getDefaultPageProps({ params, query, req, res })
      expect(props.workflows).to.deep.equal([
        {
          completeness: 0.4,
          default: true,
          grouped: false,
          id: '1',
          displayName: 'Foo',
          subjectSets: [
            subjectSet('1'),
            subjectSet('2'),
            subjectSet('3')
          ]
        }
      ])
    })
  })
})