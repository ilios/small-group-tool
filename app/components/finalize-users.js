import Component from '@ember/component';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { filter, map } from 'rsvp';

export default Component.extend({
  users: null,
  matchedGroups: null,
  group: null,
  invalidUsers: computed('users.[]', 'group', async function () {
    const users = this.get('users');
    const group = this.get('group');
    const allDescendantUsers = await group.get('allDescendantUsers');
    const allDescendantUserIds = allDescendantUsers.mapBy('id');

    return filter(users, async user => allDescendantUserIds.includes(user.userRecord.get('id')));
  }),
  finalData: computed('users.[]', 'matchedGroups.[]', 'group', function(){
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
    yield timeout(250);
    const finalData = this.get('finalData');
    const success = this.get('success');
    const treeGroups = yield map(finalData, async ({ group, user }) => {
      return group.addUserToGroupAndAllParents(user);
    });

    const flat = treeGroups.reduce((flattened, arr) => {
      return flattened.pushObjects(arr);
    }, []);

    yield flat.uniq().invoke('save');
    success();
  }).drop(),
});
