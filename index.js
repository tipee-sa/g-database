/*jslint node: true, nomen: true */
module.exports = function (app) {
	'use strict';

	var logger = app.logger && app.logger.child({component: 'Database'}),
		nano = require('nano'),
		db = null;

	db = nano({
		url:	app.config.get('db:url'),
		log:	function (id, args) {
			if (!logger) {
				return;
			}

			if (args[0].method) {
				logger.debug('%s - %s', args[0].method, args[0].uri);
			}

			if (args[0].err === null) {
				logger.debug('[%s] - %s', args[0].headers['status-code'], args[0].body._id);
			}
		},
		request_options: {
			'pool.maxSockets': app.config.get('db:sockets')
		}
	});

	if (db instanceof Error) {
		if (logger) {
			app.logger.fatal('Erreur lors de la connection à la base de données %s', app.config.get('db:url'));
		}
		return new Error({code: 'DATABASE_CONNECT_FAIL'});
	}

	if (logger) {
		app.logger.info('Connecté à la base de données %s', app.config.get('db:url'));
	}

    return db;
};