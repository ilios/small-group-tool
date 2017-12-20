import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  user: null,

  validUsers: null,
  group: null,
  matchedGroups: null,
  showSuccessMessage: false,

  classNames: ['small-group-tool'],

  unmatchedGroups: computed('validUsers.@each.subGroupName', function () {
    const validUsers = this.get('validUsers');
    if (!validUsers) {
      return [];
    }
    return validUsers.mapBy('subGroupName').uniq().filter(str => isPresent(str));
  }),
  allUnmatchedGroupsMatched: computed('unmatchedGroups.[]', 'matchedGroups.[]', function () {
    const unmatchedGroups = this.get('unmatchedGroups');
    const matchedGroups = this.get('matchedGroups');
    const groupsStillNotMatched = unmatchedGroups.filter(groupName => {
      const match = matchedGroups.findBy('name', groupName);
      return isEmpty(match);
    });

    return groupsStillNotMatched.length === 0;
  }),

  init(){
    this._super(...arguments);
    this.set('matchedGroups', []);
  },

  actions: {
    async addMatch(groupName, groupId) {
      const store = this.get('store');
      const group = await store.find('learner-group', groupId);
      const matchedGroups = this.get('matchedGroups').toArray();
      const match = matchedGroups.findBy('name', groupName);
      if (match) {
        match.set('group', group);
      } else {
        matchedGroups.pushObject(EmberObject.create({
          name: groupName,
          group,
        }));
      }

      this.set('matchedGroups', matchedGroups);
    },
    removeMatch(groupName) {
      const matchedGroups = this.get('matchedGroups').toArray();
      const match = matchedGroups.findBy('name', groupName);
      if (match) {
        matchedGroups.removeObject(match);
      }

      this.set('matchedGroups', matchedGroups);
    },
  },

  success: task(function* () {
    this.set('showSuccessMessage', true);
    this.set('group', null);
    this.set('validUsers', null);
    this.set('matchedGroups', null);
    yield timeout(5000);
    this.set('showSuccessMessage', false);
  }).restartable(),
});
