import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  user: null,
  validUsers: null,
  group: null,

  matchedGroups: null,
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

  finalData: computed('validUsers.[]', 'matchedGroups.[]', function () {
    const validUsers = this.get('validUsers');
    if (!validUsers) {
      return [];
    }
    const matchedGroups = this.get('matchedGroups');
    const group = this.get('group');
    return validUsers.map(({ firstName, lastName, campusId, subGroupName }) => {
      let groupTitle = group.get('title');
      if (subGroupName) {
        const match = matchedGroups.findBy('name', subGroupName);
        if (match) {
          groupTitle = match.get('groupTitle');
        }
      }

      return { firstName, lastName, campusId, groupTitle };
    });
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
        match.set('groupId', group.get('id'));
        match.set('gropuTitle', group.get('title'));
      } else {
        matchedGroups.pushObject(EmberObject.create({
          name: groupName,
          groupId: group.get('id'),
          groupTitle: group.get('title'),
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
    }
  }
});
