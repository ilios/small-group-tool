import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { map } from 'rsvp';

export default Component.extend({
  users: null,
  matchedGroups: null,
  group: null,
  finalData: computed('users.[]', 'matchedGroups.[]', function(){
    const users = this.get('users');
    const group = this.get('group');
    const matchedGroups = this.get('matchedGroups');
    const finalUsers = users.map(obj => {
      let selectedGroup = group;
      if (obj.subGroupName) {
        const match = matchedGroups.findBy('name', obj.subGroupName);
        if (match) {
          selectedGroup = match.group;
        }
      }
      return {
        user: obj.userRecord,
        group: selectedGroup
      };
    });

    return finalUsers;
  }),

  save: task(function* () {
    const finalData = this.get('finalData');
    const treeGroups = yield map(finalData, async ({ group, user }) => {
      return group.addUserToGroupAndAllParents(user);
    });

    const flat = treeGroups.reduce((flattened, arr) => {
      return flattened.pushObjects(arr);
    }, []);

    yield flat.uniq().invoke('save');
  }),
});
