import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import { all } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  store: service(),
  currentUser: service(),
  session: service(),
  model(){
    const currentUser = this.get('currentUser');
    return currentUser.get('model');
  },
  afterModel(user){
    const store = this.get('store');
    return all([
      user.get('schools'),
      store.findAll('program'),
      store.findAll('program-year'),
      store.findAll('cohort'),
    ]);
  },
  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
