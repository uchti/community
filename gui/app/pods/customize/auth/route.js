// Copyright 2016 Documize Inc. <legal@documize.com>. All rights reserved.
//
// This software (Documize Community Edition) is licensed under
// GNU AGPL v3 http://www.gnu.org/licenses/agpl-3.0.en.html
//
// You can operate outside the AGPL restrictions by purchasing
// Documize Enterprise Edition and obtaining a commercial license
// by contacting <sales@documize.com>.
//
// https://documize.com

import { Promise as EmberPromise } from 'rsvp';

import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import constants from '../../../utils/constants';

export default Route.extend(AuthenticatedRouteMixin, {
	appMeta: service(),
	session: service(),
	global: service(),

	beforeModel() {
		if (!this.get("session.isGlobalAdmin")) {
			this.transitionTo('auth.login');
		}
	},

	model() {
		let data = {
			authProvider: this.get('appMeta.authProvider'),
			authConfig: null,
		};

		return new EmberPromise((resolve) => {
			this.get('global').getAuthConfig().then((config) => {
				switch (data.authProvider) {
					case constants.AuthProvider.Keycloak:
						data.authConfig = config;
						break;
					case constants.AuthProvider.Documize:
						data.authConfig = '';
						break;
				}

				resolve(data);
			});
		});
	},

	activate() {
		document.title = "Authentication | Documize";
	}
});
