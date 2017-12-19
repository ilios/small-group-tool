import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  matches: null,
  groups: null,
  groupName: null,
  matchedGroupId: computed('matches.[]', 'groupName', function () {
    const matches = this.get('matches');
    const groupName = this.get('groupName');
    const match = matches.findBy('name', groupName);
    if (match) {
      return match.get('group.id');
    }

    return null;
  }),
  actions: {
    matchGroup(learnerGroupId) {
      const groupName = this.get('groupName');
      const unsetMatch = this.get('unsetMatch');
      const setMatch = this.get('setMatch');
      if (learnerGroupId === 'null') {
        unsetMatch(groupName);
      } else {
        setMatch(groupName, learnerGroupId);
      }

    }
  }
});


/**
 *
create a group matcher dropdown component that takes all the child groups and the one group to match as
  well as an array of groups matvhed by name.Then each componet can decide its match and just
send up name / matchId to be added to the array
 */
