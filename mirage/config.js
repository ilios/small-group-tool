export default function() {

  this.get('users/:id');
  this.get('schools/:id');
  this.get('permissions/:id');
  this.get('programs');
  this.get('cohorts');
  this.get('programyears', 'programYear');
  this.get('learnergroups', 'learnerGroup');
}
