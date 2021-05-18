import asyncStates from '@zooniverse/async-states'
import counterpart from 'counterpart'
import cuid from 'cuid'
import _ from 'lodash'
import { toJS } from 'mobx'
import { flow, getRoot, isValidReference, types } from 'mobx-state-tree'

import Classification, { ClassificationMetadata } from './Classification'
import ResourceStore from './ResourceStore'
import {
  ClassificationQueue,
  sessionUtils
} from './utils'

const ClassificationStore = types
  .model('ClassificationStore', {
    active: types.safeReference(Classification),
    demoMode: types.optional(types.boolean, false),
    resources: types.map(Classification),
    type: types.optional(types.string, 'classifications')
  })
  .views(self => ({
    annotation (task) {
      const validClassificationReference = isValidReference(() => self.active)
      if (validClassificationReference) {
        return self.active.annotation(task)
      }
      return null
    },

    get currentAnnotations () {
      const validClassificationReference = isValidReference(() => self.active)
      if (validClassificationReference) {
        return self.active.annotations
      }
      return []
    },

    get classificationQueue () {
      const client = getRoot(self).client.panoptes
      const { authClient } = getRoot(self)
      return new ClassificationQueue(client, self.onClassificationSaved, authClient)
    }
  }))
  .volatile(self => {
    return {
      onComplete: () => null
    }
  })
  .actions(self => {

    function createClassification (subject, workflow, project) {
      if (!subject || !workflow || !project) {
        throw new Error('Cannot create a classification without a subject, workflow, project')
      }

      const tempID = cuid()
      const newClassification = Classification.create({
        id: tempID, // Generate an id just for serialization in MST. Should be dropped before POST...
        links: {
          project: project.id,
          subjects: [subject.id],
          workflow: workflow.id
        },
        metadata: ClassificationMetadata.create({
          classifier_version: '2.0',
          source: subject.metadata.intervention ? 'sugar' : 'api',
          subjectSelectionState: {
            already_seen: subject.already_seen,
            finished_workflow: subject.finished_workflow,
            retired: subject.retired,
            selected_at: subject.selected_at,
            selection_state: subject.selection_state,
            user_has_finished_workflow: subject.user_has_finished_workflow
          },
          userLanguage: counterpart.getLocale(),
          workflowVersion: workflow.version
        })
      })

      self.resources.put(newClassification)
      self.setActive(tempID)
      self.loadingState = asyncStates.success
    }

    function addAnnotation (task, annotationValue) {
      const validClassificationReference = isValidReference(() => self.active)

      if (validClassificationReference) {
        const classification = self.active
        if (classification) {
          return classification.addAnnotation(task, annotationValue)
        }
      } else {
        if (process.browser) {
          // TODO: throw an error here?
          console.error('No active classification. Cannot add annotation.')
          return null
        }
      }
    }

    function completeClassification () {
      const validClassificationReference = isValidReference(() => self.active)
      const validSubjectReference = isValidReference(() => getRoot(self).subjects.active)

      if (validClassificationReference && validSubjectReference) {
        const classification = self.active
        const subjectDimensions = toJS(getRoot(self).subjectViewer.dimensions)

        const metadata = {
          finishedAt: (new Date()).toISOString(),
          session: sessionUtils.getSessionID(),
          subjectDimensions,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }

        const feedback = getRoot(self).feedback
        if (feedback.isValid) {
          metadata.feedback = toJS(feedback.rules)
        }

        // TODO store intervention metadata if we have a user...
        classification.metadata.update(metadata)

        classification.completed = true
        // Convert from observables
        let classificationToSubmit = classification.toSnapshot()

        const convertedMetadata = {}
        Object.entries(classificationToSubmit.metadata).forEach((entry) => {
          const key = _.snakeCase(entry[0])
          convertedMetadata[key] = entry[1]
        })
        classificationToSubmit.metadata = convertedMetadata

        const subject = getRoot(self).subjects.active
        self.onComplete(classification.toJSON(), subject.toJSON())

        if (process.browser) {
          console.log('Completed classification', classificationToSubmit)
        }

        if (self.demoMode) {
          // subject advance is observing for this to know when to advance the queue
          self.loadingState = asyncStates.posting
          if (process.browser) console.log('Demo mode enabled. No classification submitted.')
          return Promise.resolve(true)
        }

        return self.submitClassification(classificationToSubmit)
      } else {
        if (process.browser) {
          console.error('No active classification or active subject. Cannot complete classification')
        }
      }
    }

    function onClassificationSaved (savedClassification) {
      // handle any processing of classificatiions that have been saved to Panoptes.
    }

    function * submitClassification (classification) {
      self.loadingState = asyncStates.posting

      // Service worker isn't working right now, so let's use the fallback queue for all browsers
      try {
        yield self.classificationQueue.add(classification)
      } catch (error) {
        console.error(error)
        self.loadingState = asyncStates.error
      }
    }

    function setOnComplete (onComplete) {
      self.onComplete = onComplete
    }

    function setDemoMode (boolean) {
      self.demoMode = boolean
    }

    return {
      addAnnotation,
      completeClassification,
      createClassification,
      onClassificationSaved,
      setDemoMode,
      setOnComplete,
      submitClassification: flow(submitClassification)
    }
  })

export default types.compose('ClassificationResourceStore', ResourceStore, ClassificationStore)
