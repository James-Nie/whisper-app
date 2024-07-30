/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

const encode = function (obj : any) {
	var str = '';

	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			if (str.length) str += '&';
			str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
		}
	}

	return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

const decode = function (qs : string) {
	var qry = {};
	var pairs = qs.split('&');
	for (var i = 0, l = pairs.length; i < l; i++) {
		var pair = pairs[i].split('=');
		qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	}
	return qry;
};

export {
	encode,
	decode
}