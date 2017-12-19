import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('finalize-users', 'Integration | Component | finalize users', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{finalize-users}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#finalize-users}}
      template block text
    {{/finalize-users}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
