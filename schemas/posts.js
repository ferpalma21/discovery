NEWSCHEMA('Posts', function(schema){
  schema.define('_id', 'UID');
  schema.define('userid', 'UID');
  schema.define('title', 'string');
  schema.define('body', 'string');
  schema.define('email', 'string');

  schema.addWorkflow('insert', function($){
    if (!$.user) return $.invalid(404);
    let model = {
      _id: UID(),
      userid: $.user._id,
      username: $.user.username,
      email: $.user.email,
      title: $.body.title,
      body: $.body.body,
      created: new Date().format('YYYY-MM-DD')
    };
    NOSQL('posts').insert(model);
    $.success({msg: 'Entrada en bitacora guardada con éxito'});
  });

  schema.addWorkflow('query', function($){
    if (!$.user) return $.invalid(404);
    NOSQL('posts').list().callback((err, res) => {
      if (err) return $.invalid('Error');
      return $.success(res);
    })
  })
});
