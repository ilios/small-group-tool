import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  user: null,
  group: null,
  schoolId: null,
  programId: null,
  programYearId: null,
  groupId: null,
  selectedSchool: computed('schoolId', 'user.{school,schools}', async function(){
    const user = this.get('user');
    const schoolId = this.get('schoolId');
    if (!schoolId) {
      return user.get('school');
    }

    const schools = await user.get('schools');
    return schools.findBy('id', schoolId);
  }),

  programs: computed('selectedSchool.programs.[]', async function(){
    const selectedSchool = await this.get('selectedSchool');
    return selectedSchool.get('programs');
  }),

  selectedProgram: computed('programId', 'selectedSchool.programs.[]', async function(){
    const selectedSchool = await this.get('selectedSchool');
    const programId = await this.get('programId');
    const programs = await selectedSchool.get('programs');
    if (!programId) {
      return programs.sortBy('title').get('firstObject');
    }

    return programs.findBy('id', programId);
  }),

  programYears: computed('selectedProgram.programYears.[]', async function(){
    const selectedProgram = await this.get('selectedProgram');
    return selectedProgram.get('programYears');
  }),

  selectedProgramYear: computed('programYearId', 'selectedProgram.programYears.[]', async function(){
    const selectedProgram = await this.get('selectedProgram');
    const programYearId = await this.get('programYearId');
    const programYears = await selectedProgram.get('programYears');
    if (!programYearId) {
      return programYears.sortBy('title').get('firstObject');
    }

    return programYears.findBy('id', programYearId);
  }),

  learnerGroups: computed('selectedProgramYear.cohort.learnerGroups.[]', async function(){
    const selectedProgramYear = await this.get('selectedProgramYear');
    const cohort = await selectedProgramYear.get('cohort');
    return cohort.get('rootLevelLearnerGroups');
  }),

  selectedGroup: computed('groupId', 'learnerGroups.[]', async function(){
    const groupId = await this.get('groupId');
    const groups = await this.get('learnerGroups');
    if (!groupId) {
      return groups.sortBy('title').get('firstObject');
    }

    return groups.findBy('id', groupId);
  }),

  actions: {
    changeSchoolId(schoolId){
      this.set('schoolId', schoolId);
      this.set('programId', null);
    },
    changeProgramId(programId){
      this.set('programId', programId);
      this.set('programYearId', null);
    },
    changeProgramYearId(programYearId){
      this.set('programYearId', programYearId);
      this.set('groupId', null);
    },
    async setGroup() {
      const selectedGroup = await this.get('selectedGroup');
      const setGroup = this.get('setGroup');
      setGroup(selectedGroup);
    },
    async unsetGroup() {
      const group = this.get('group');
      const setGroup = this.get('setGroup');
      if (group) {
        const cohort = await group.get('cohort');
        const programYear = await cohort.get('programYear');
        const program = await programYear.get('program');
        const school = await program.get('school');

        this.set('programYearId', programYear.get('id'));
        this.set('programId', program.get('id'));
        this.set('schoolId', school.get('id'));
      }
      setGroup(null);
    }
  }
});
