import {
  create,
  clickable,
  collection,
  hasClass,
  property,
  text,
  visitable
} from 'ember-cli-page-object';

import selectable from '../helpers/selectable';

export default create({
  visit: visitable('/'),
  schools: collection({
    itemScope: '[data-test-school-filter] option',
    item: {
      text: text(),
      selected: property('selected'),
    },
  }),
  pickSchool: selectable('[data-test-school-filter]'),
  programs: collection({
    itemScope: '[data-test-program-filter] option',
    item: {
      text: text(),
      selected: property('selected'),
    },
  }),
  pickProgram: selectable('[data-test-program-filter]'),
  programYears: collection({
    itemScope: '[data-test-program-year-filter] option',
    item: {
      text: text(),
      selected: property('selected'),
    },
  }),
  pickProgramYear: selectable('[data-test-learner-group-chooser]'),
  learnerGroups: collection({
    itemScope: '[data-test-learner-group-chooser] option',
    item: {
      text: text(),
      selected: property('selected'),
    },
  }),
  pickLearnerGroup: selectable('[data-test-learner-group-chooser]'),

  selectCurrentGroup: clickable('[data-test-select-group]'),

  uploadedUsers: collection({
    itemScope: '[data-test-upload-data-users] tbody tr',
    item: {
      isInvalid: hasClass('invalid'),
      firstName: text('td', { at: 0 }),
      lastName: text('td', { at: 1 }),
      campusId: text('td', { at: 2 }),
      smallGroupName: text('td', { at: 3 }),
      errors: text('td', { at: 4 }),
    }
  }),
  confirmUploadedUsers: clickable('[data-test-upload-data-confirm]'),

  groupsToMatch: collection({
    itemScope: '[data-test-match-groups-unmatched] li',
    item: {
      name: text('label'),
      chooseGroup: selectable('select'),
    }
  }),

  finalData: collection({
    itemScope: '[data-test-final-data] tbody tr',
    item: {
      firstName: text('td', { at: 0 }),
      lastName: text('td', { at: 1 }),
      campusId: text('td', { at: 2 }),
      smallGroupName: text('td', { at: 3 }),
    }
  }),
});
