let ips = [];
let fs = require('fs');
// let torIPS = fs.readFileSync('torbulkexitlist.txt').toString().split("\n");
ON('controller', (controller) => {
  console.log(controller.req.$path, controller.ip);
  if (ips.indexOf(controller.ip) >= 0) return;
  // if (torIPS.indexOf(controller.ip) >= 0){
  //   console.error('tor ip');
  //   return controller.invalid();
  // }
  ips.push(controller.ip);
  NOSQL('ips').insert({id: UID(), ip: controller.ip});
})
