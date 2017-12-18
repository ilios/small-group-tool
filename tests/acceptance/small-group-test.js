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
