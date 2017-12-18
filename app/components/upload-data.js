import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { Promise as RSVPPromise, map } from 'rsvp';
import { isEmpty, isPresent } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import PapaParse from 'papaparse';

export default Component.extend({
  store: service(),
  iliosConfig: service(),
  classNames: ['upload-data'],
  file: null,
  data: null,

  sampleData: computed(function(){
    const sampleUploadFields = ['First', 'Last', 'CampusID', 'Sub Group Name'];

    const str = sampleUploadFields.join("\t");
    const encoded = window.btoa(str);

    return encoded;
  }),

  validUsers: computed('data', function () {
    const data = this.get('data');
    return data.filterBy('isValid');
  }),

  init(){
    this._super(...arguments);
    this.set('data', []);
  },

  actions: {
    updateSelectedFile(files){
      // Check for the various File API support.
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        if (files.length > 0) {
          this.get('parseFile').perform(files[0]);
        }
      } else {
        throw new Error('This browser is not supported');
      }
    },
  },

  parseFile: task(function* (file) {
    const store = this.get('store');
    const proposedUsers = yield this.getFileContents(file);
    const data = yield map(proposedUsers, async ({firstName, lastName, campusId, subGroupName }) => {
      const errors = [];
      if (isEmpty(firstName)) {
        errors.push('First Name is required');
      }
      if (isEmpty(lastName)) {
        errors.push('Last Name is required');
      }
      if (isEmpty(campusId)) {
        errors.push('Campus ID is required');
      }
      let userId = null;
      if (errors.length === 0) {
        const users = await store.query('user', {
          filters: {
            campusId,
            enabled: true,
          }
        });
        if (users.get('length') === 0) {
          errors.push(`Could not find a user with the campusId ${campusId}`);
        } else if (users.get('length') > 1) {
          errors.push(`Multiple users found with the campusId ${campusId}`);
        } else {
          const user = users.get('firstObject');
          if (user.get('firstName') != firstName) {
            errors.push(`First Name does not match user record: ` + user.get('firstName'));
          }
          if (user.get('lastName') != lastName) {
            errors.push(`Last Name does not match user record: ` + user.get('lastName'));
          }
          userId = user.get('id');
        }
      }

      return {
        firstName, lastName, campusId, subGroupName, userId,
        errors,
        isValid: errors.length === 0
      };
    });

    this.set('data', data);
  }).restartable(),

  /**
   * Extract the contents of a file into an array of user like objects
   * @param Object file
   *
   * @return array
   **/
  getFileContents(file){
    return new RSVPPromise(resolve => {
      this.set('fileUploadError', false);
      let allowedFileTypes = ['text/plain', 'text/csv', 'text/tab-separated-values'];
      if (!allowedFileTypes.includes(file.type)) {
        this.set('fileUploadError', true);
        throw new Error(`Unable to accept files of type ${file.type}`);
      }

      let ProposedUser = EmberObject.extend({
      });
      let complete = ({data}) => {
        let proposedUsers = data.map(arr => {
          return ProposedUser.create({
            firstName: isPresent(arr[0])?arr[0]:null,
            lastName: isPresent(arr[1])?arr[1]:null,
            campusId: isPresent(arr[2])?arr[2]:null,
            subGroupName: isPresent(arr[3])?arr[3]:null,
          });
        });
        let notHeaderRow = proposedUsers.filter(obj => String(obj.firstName).toLowerCase() !== 'first' || String(obj.lastName).toLowerCase() !== 'last');

        resolve(notHeaderRow);
      };

      PapaParse.parse(file, {
        complete
      });
    });
  },
});
