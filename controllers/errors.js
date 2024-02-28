exports.install = function() {
  ROUTE('#404', not_found); // Not Found
}

async function not_found() {
  this.req.xhr ? this.invalid(404) : this.view('404');
}
