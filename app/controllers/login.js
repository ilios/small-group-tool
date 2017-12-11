import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ENV from 'small-group-tool/config/environment';

export default Controller.extend({
  session: service(),
  jwt: null,
  error: null,
  actions: {
    async login(){
      this.set('error', null);
      const jwt = this.get('jwt');

      if (jwt) {
        const apiHost = ENV.apiHost;
        const url = `${apiHost}/auth/token`;
        const response = await fetch(url, {
          headers: {
            'X-JWT-Authorization': `Token ${jwt}`
          }
        });
        if (response.ok) {
          const obj = await response.json();
          const authenticator = 'authenticator:ilios-jwt';
          this.get('session').authenticate(authenticator, {jwt: obj.jwt});
        }
      }
    }
  }
});
