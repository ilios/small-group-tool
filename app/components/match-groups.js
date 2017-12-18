import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  group: null,
  validUsers: null,
  matchedGroups: null,
  allDescendantGroups: computed('group.allDescendants.[]', async function () {
    const group = this.get('group');
    return await group.get('allDescendants');
  }),
});
