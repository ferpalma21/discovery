
var opt = {};

// A secret key
opt.secret = CONF.cookie_secret;
// A cookie name (optional)
opt.cookie = CONF.cookie;

opt.ddos = 10;

opt.onread = async function(meta, next) {
	// meta.sessionid {String}
	// meta.userid {String}
	// meta.ua {String} A user-agent
	// next(err, USER_DATA) {Function} A callback function
	NOSQL('users').one().where('_id', meta.userid).callback(next);
	// if (meta.userid) {
	// 	user = await db.asyncAggregate('users', [
	// 		{
	// 			$match: {_id: meta.userid}
	// 		},
	// 		{
	// 			$lookup: {
	// 				from: 'wallets',
	// 				localField: '_id',
	// 				foreignField: 'user',
	// 				as: 'wallet'
	// 			}
	// 		}]);
	// 		user = user && user[0] ? user[0] : {};
	// 		user.wallet = user.wallet && user.wallet[0] ? user.wallet[0] : {};
	// }
};

opt.expire = DEBUG ? '50 minutes' : '5 minutes';
//
AUTH(opt);

MAIN.session = opt;
