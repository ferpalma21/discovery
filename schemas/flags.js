NEWSCHEMA('flags', function(schema) {
  schema.define('_id', 'UID');
  schema.define('flag', 'String(32)');
  schema.define('used', 'Boolean');
  schema.define('sent', 'Boolean');
  schema.define('ip', 'String');
  schema.define('logged', 'Boolean');
  schema.define('action', 'string');

  schema.addWorkflow('set-as-used', function($){
    NOSQL('flags').update({used: true, ip: $.ip}).where('flag', $.body.flag).where('used', false).callback((err, res) =>{
      if (err) console.error(err, 'err');
      $.audit(`updated ${updated}`);
      $.success('Flag submitted correctly');
    });
  })
});

setTimeout(()=>{
  let db = NOSQL('flags');
  db.find().where('used', false).callback((err,flags)=>{
    if (flags.length > 0) return
    for (var i = 0; i < 160; i++) {
      let flag = FAKE('flags')
      flag.used = false;
      flag.sent = false;
      flag.ip = '';
      flag.logged = false;
      if (i < 20) flag.action = 'GET-ADMIN-LOGIN';
      else if (i < 40) flag.action = 'POST-ADMIN-LOGIN';
      else if (i < 60) flag.action = 'POST-API-V1-FLAG';
      else if (i < 80) flag.action = 'GET-FLAGS';
      else if (i < 100) flag.action = 'GET-SECURE';
      else if (i < 120) flag.action = 'GET-SECURE-HOSTS';
      else if (i <= 140) flag.action = 'GET-APP-VITALS';
      else if (i <= 160) flag.action = 'GET-USERS';
      db.insert(flag)
    }
  });
}, 1000)
