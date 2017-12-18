export default function() {

  this.get('users/:id');
  this.get('users', (schema, request) => {
    const params = request.queryParams;
    const keys = Object.keys(params);
    const campusIdKey = 'filters[campusId]';
    if (keys.includes(campusIdKey)) {
      const filter = params[campusIdKey];
      const users = schema.users.all().filter(user => {
        return filter == user.campusId;
      });

      return users;
    } else {
      return schema.users.all();
    }
  });
  this.get('schools/:id');
  this.get('permissions/:id');
  this.get('programs');
  this.get('cohorts');
  this.get('programyears', 'programYear');
  this.get('learnergroups', 'learnerGroup');
  this.get('learnergroups/:id', 'learnerGroup');
}
