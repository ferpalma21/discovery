exports.install = function(){
  ROUTE('GET /', view_index);
  ROUTE('POST /', post_index);
  ROUTE('POST /login          *Users --> @login');
  ROUTE('POST /sign-up        *Users --> @sign-up');
  ROUTE('GET /logout          *Users --> @logout');
  ROUTE('POST /api/posts      *Posts --> @insert');
  ROUTE('GET /api/posts       *Posts --> @query');

  ROUTE('GET /sysadmin/login', view_admin_login);
  ROUTE('POST /sysadmin/login    *Users --> @admin-login');
  // ROUTE('POST /api/v1/flag    *Flag --> @set-as-used');
  ROUTE('POST /api/v2/flag', something);
  ROUTE('GET /flags', view_flag);
  ROUTE('GET /security', only_admin_secure);
  ROUTE('GET /security/hosts', only_admin_secure_hosts);
  ROUTE('GET /app/health', only_admin_app_vitals);
  ROUTE('+GET /users', view_users);

  ROUTE('/app', send_403);
  ROUTE('/app/health', send_403);
  ROUTE('/api', send_403);
  ROUTE('/api/v2', send_403);
  ROUTE('/sysadmin', send_403);
}


function send_403(){
  this.invalid(403);
}

function view_users(){
  let self = this;
  if (!this.user?.role !== 'user') {
    NOSQL('users').list().callback((err, users) => {
      let checkDB = NOSQL('flags').one();
      checkDB.where('ip', this.ip)
      checkDB.where('action', 'GET-USERS').callback((err, res) => {
        if (res) return self.view('check-users', {users: users});
        let db = NOSQL('flags').one();
        db.where('action', 'GET-SECURE');
        db.where('sent', false);
        db.where('used', false).callback((err, flag) => {
          return self.view('check-users', {users:users.items, flag: flag});
        });
      });
    });
  }
}


function something(){
  let self = this;
  NOSQL('flags').update({used: true, ip: self.ip}).where('flag', self.body.flag).where('used', false).callback((err, res) => {
    if (err || res == 0) return this.invalid('Wrong flag');
    else {
      self.audit(`updated ${res}`);
      let checkDB = NOSQL('flags').one();
      checkDB.where('ip', self.ip);
      checkDB.where('action', 'POST-API-V1-FLAG').callback((err, res) => {
        if (res) return self.success( {msg: 'Flag submitted correctly, MAYBE YOU passed this level :)'});
        let db = NOSQL('flags').one();
        db.where('action', 'POST-API-V1-FLAG');
        db.where('used', false).callback((err, res) => {
          let response = {
            msg:'Flag submitted correctly'
          };
          if (res) response.flag = res.flag;
          self.success(response);
        });
      });
    }
  });
}

function only_admin_secure(){
  let self = this;
  if (!this.user?.role !== 'admin') {
    let checkDB = NOSQL('flags').one();
    checkDB.where('ip', this.ip)
    checkDB.where('action', 'GET-SECURE').callback((err, res) => {
      if (res) return self.invalid(401, 'Maybe you passed this level :)');
      let db = NOSQL('flags').one();
      db.where('action', 'GET-SECURE');
      db.where('sent', false);
      db.where('used', false).callback((err, flag) => {
        return self.invalid(401, flag.flag);
      });
    });
  }
}
function only_admin_secure_hosts(){
  let self = this;
  if (!this.user?.role !== 'admin') {
    let checkDB = NOSQL('flags').one();
    checkDB.where('ip', this.ip)
    checkDB.where('action', 'GET-SECURE-HOSTS').callback((err, res) => {
      if (res) return self.invalid(401, 'Maybe you passed this level :)');
      let db = NOSQL('flags').one();
      db.where('action', 'GET-SECURE-HOSTS');
      db.where('sent', false);
      db.where('used', false).callback((err, flag) => {
        return self.invalid(401, flag.flag);
      });
    });
  }
}

function only_admin_app_vitals(){
  let self = this;
  if (!this.user?.role !== 'admin') {
    let checkDB = NOSQL('flags').one();
    checkDB.where('ip', this.ip);
    checkDB.where('action', 'GET-APP-VITALS').callback((err, res) => {
      return self.invalid(421, 'Maybe you passed this level :)');
      let db = NOSQL('flags').one();
      db.where('action', 'GET-APP-VITALS');
      db.where('sent', false);
      db.where('used', false).callback((err, flag) => {
        return self.invalid(401, flag.flag);
      });
    });
  }else {
    return this.success();
  }
}

function view_flag(){
  let checkDB = NOSQL('flags').one();
  checkDB.where('ip', this.ip)
  checkDB.where('action', 'GET-ADMIN-LOGIN').callback((err, res) => {
    if (res) return this.view('flag', {flag: 'Maybe you passed this level :)'})
    let db = NOSQL('flags').one();
    db.where('action', 'GET-ADMIN-LOGIN');
    db.where('ip', '');
    db.where('sent', false);
    db.where('used', false).callback((err, flag) => {
      if (!err) {
        this.view('flag', {flag: flag})
      }else {
        return $.invalid(404);
      }
    });
  });
}

function view_admin_login(){
  let checkDB = NOSQL('flags').one();
  checkDB.where('ip', this.ip).callback((err, res) => {
    if (res) return this.view('admin-login', {flag: 'Maybe you passed this level :)'})
    let db = NOSQL('flags').one();
    db.where('action', 'GET-ADMIN-LOGIN');
    db.where('ip', '');
    db.where('sent', false);
    db.where('used', false).callback((err, flag) => {
      if (!err) {
        this.view('admin-login', {flag: flag});
      }else {
        return $.invalid(404);
      }
    });
  });
}

function view_index(){
  let self = this;
  if (typeof self.query?.superpower == typeof '' && self?.query?.superpower != '' && self?.query?.superpower.length > 0) {
    let model = {
      superpower:  self.query.superpower
    }
    this.view('index', model);
  }else {
    this.view('index')
  }
}

function post_index(){
  let self = this;
  let model = {
    superheroeName:  `${self.body.superheroeName}`
  }
  this.json(model);
}
