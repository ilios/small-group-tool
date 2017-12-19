import { test } from 'qunit';
import moduleForAcceptance from 'small-group-tool/tests/helpers/module-for-acceptance';
import page from 'small-group-tool/tests/pages/small-group-tool';
import { authenticateSession } from '../helpers/ember-simple-auth';


moduleForAcceptance('Acceptance | small group', {
  beforeEach() {
    const userId = 1;
    let encodedData =  window.btoa('') + '.' +  window.btoa(`{"user_id": ${userId}}`) + '.';
    let token = {
      jwt: encodedData
    };
    authenticateSession(this.application, token);

    const school = server.create('school', {
      title: 'school 0'
    });
    const permission = server.create('permission', {
      tableName: 'school',
      tableRowId: 2,
      canRead: true
    });
    server.create('school', { title: 'school 1' });
    server.create('user', {
      id: 1,
      school,
      permissions: [permission],
    });
    const program = server.create('program', {
      title: 'program 0',
      school,
    });
    const programYear = server.create('program-year', {
      program,
    });
    const cohort =server.create('cohort', {
      title: 'class of this year',
      programYear,
    });
    server.create('learner-group', {
      title: 'group 0',
      cohort,
    });
    const group1 = server.create('learner-group', {
      title: 'group 1',
      cohort,
    });
    server.create('learnerGroup', {
      title: 'group 1 child 0',
      cohort,
      parent: group1,
    });
    server.create('learnerGroup', {
      title: 'group 1 child 1',
      cohort,
      parent: group1,
    });
  }
});

test('viewing small group', async function (assert) {
  await page.visit();
  assert.equal(page.schools().count, 2);
  assert.equal(page.schools(0).text, 'school 0');
  assert.ok(page.schools(0).selected);
  assert.equal(page.schools(1).text, 'school 1');
  assert.notOk(page.schools(1).selected);

  assert.equal(page.programs().count, 1);
  assert.equal(page.programs(0).text, 'program 0');
  assert.ok(page.programs(0).selected);

  assert.equal(page.programYears().count, 1);
  assert.equal(page.programYears(0).text, 'class of this year');
  assert.ok(page.programYears(0).selected);

  assert.equal(page.learnerGroups().count, 2);
  assert.equal(page.learnerGroups(0).text, 'group 0');
  assert.ok(page.learnerGroups(0).selected);
  assert.equal(page.learnerGroups(1).text, 'group 1');
  assert.notOk(page.learnerGroups(1).selected);

  await page.selectCurrentGroup();
});

let createFile = function(users){
  let file;
  let lines = users.map(arr => {
    return arr.join("\t");
  });

  let contents = lines.join("\n");
  file = new Blob([contents], { type: 'text/plain' });

  file.mime = 'text/plain';
  file.name = 'test.txt';
  return file;
};

let triggerUpload = async function(users, inputElement){
  let file = createFile(users);
  inputElement.triggerHandler({
    type: 'change',
    target: {
      files: {
        0: file,
        length: 1,
        item() { return file; }
      }
    }
  });
  await wait();
};

test('upload users', async function (assert) {
  await page.visit();
  await page.selectCurrentGroup();
  const input = await find('[data-test-user-upload]');
  server.create('user', {
    firstName: 'jasper',
    lastName: 'johnson',
    campusId: '1234567890',
    cohortIds: [1],
  });
  server.create('user', {
    firstName: 'jackson',
    lastName: 'johnson',
    campusId: '12345',
    cohortIds: [1],
  });
  let users = [
    ['jasper', 'johnson', '1234567890', '123Test'],
    ['jackson', 'johnson', '12345'],
  ];
  await triggerUpload(users, input);
  assert.equal(page.validUploadedUsers().count, 2);
  assert.equal(page.validUploadedUsers(0).firstName, 'jasper');
  assert.equal(page.validUploadedUsers(0).lastName, 'johnson');
  assert.equal(page.validUploadedUsers(0).campusId, '1234567890');
  assert.equal(page.validUploadedUsers(0).smallGroupName, '123Test');
  assert.equal(page.validUploadedUsers(1).firstName, 'jackson');
  assert.equal(page.validUploadedUsers(1).lastName, 'johnson');
  assert.equal(page.validUploadedUsers(1).campusId, '12345');
  assert.equal(page.validUploadedUsers(1).smallGroupName, '');

  assert.ok(page.showConfirmUploadButton);
});

test('upload user errors', async function (assert) {
  await page.visit();
  await page.selectCurrentGroup();
  const input = await find('[data-test-user-upload]');
  server.create('user', {
    firstName: 'jasper',
    lastName: 'johnson',
    campusId: '1234567890',
    cohortIds: [1],
  });
  server.create('user', {
    firstName: 'jackson',
    lastName: 'johnson',
    campusId: '12345',
    cohortIds: [1],
  });
  server.create('user', {
    firstName: 'mrs',
    lastName: 'maisel',
    campusId: '123456',
  });
  let users = [
    ['j', 'johnson', '1234567890', '123Test'],
    ['jackson', 'j', '12345'],
    ['', 'johnson', '12345', '123Test'],
    ['Magick', '', '12345'],
    ['Missing', 'Person', 'abcd'],
    ['mrs', 'maisel', '123456'],
  ];
  await triggerUpload(users, input);

  assert.equal(page.invalidUploadedUsers().count, 6);
  assert.equal(page.invalidUploadedUsers(0).errors, 'First Name does not match user record: jasper');
  assert.equal(page.invalidUploadedUsers(1).errors, 'Last Name does not match user record: johnson');
  assert.equal(page.invalidUploadedUsers(2).errors, 'First Name is required');
  assert.equal(page.invalidUploadedUsers(3).errors, 'Last Name is required');
  assert.equal(page.invalidUploadedUsers(4).errors, 'Could not find a user with the campusId abcd');
  assert.equal(page.invalidUploadedUsers(5).errors, "User is not in this group's cohort: class of this year");
  assert.notOk(page.showConfirmUploadButton);
});

test('choose small group match', async function (assert) {
  await page.visit();
  await page.pickLearnerGroup('group 1');
  await page.selectCurrentGroup();
  const input = await find('[data-test-user-upload]');
  server.create('user', {
    firstName: 'jasper',
    lastName: 'johnson',
    campusId: '1234567890',
    cohortIds: [1],
  });
  server.create('user', {
    firstName: 'jackson',
    lastName: 'johnson',
    campusId: '12345',
    cohortIds: [1],
  });
  let users = [
    ['jasper', 'johnson', '1234567890', '123Test'],
    ['jackson', 'johnson', '12345', '123Test'],
  ];
  await triggerUpload(users, input);
  assert.equal(page.validUploadedUsers().count, 2);
  await page.confirmUploadedUsers();
  assert.equal(page.groupsToMatch().count, 1);
  await page.groupsToMatch(0).chooseGroup('group 1 child 1');
});

test('finalize and save', async function (assert) {
  assert.expect(4);
  await page.visit();
  await page.pickLearnerGroup('group 1');
  await page.selectCurrentGroup();
  const input = await find('[data-test-user-upload]');
  server.create('user', {
    firstName: 'jasper',
    lastName: 'johnson',
    campusId: '1234567890',
    cohortIds: [1],
  });
  server.create('user', {
    firstName: 'jackson',
    lastName: 'johnson',
    campusId: '12345',
    cohortIds: [1],
  });
  let users = [
    ['jasper', 'johnson', '1234567890'],
    ['jackson', 'johnson', '12345', '123Test'],
  ];
  await triggerUpload(users, input);
  assert.equal(page.validUploadedUsers().count, 2);
  await page.confirmUploadedUsers();
  assert.equal(page.groupsToMatch().count, 1);
  await page.groupsToMatch(0).chooseGroup('group 1 child 1');

  server.put('learnergroups/:id', function (schema, request) {
    const id = request.params.id;
    const jsonData = this.serializerOrRegistry.normalize(JSON.parse(request.requestBody), 'learner-group');
    switch (id) {
    case '2':
      assert.deepEqual(jsonData.data.attributes.users, ['2', '3']);
      break;
    case '4':
      assert.deepEqual(jsonData.data.attributes.users, ['3']);
      break;
    default:
      assert.ok(false, `Unexpected group #${id} saved.`);
    }
  });
  await page.submitFinalData();
});
