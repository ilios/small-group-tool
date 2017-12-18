import {
  create,
  clickable,
  collection,
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
});
