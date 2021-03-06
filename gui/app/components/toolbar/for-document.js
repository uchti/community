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

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import AuthMixin from '../../mixins/auth';
import TooltipMixin from '../../mixins/tooltip';
import ModalMixin from '../../mixins/modal';

export default Component.extend(ModalMixin, TooltipMixin, AuthMixin, {
	spaceService: service('folder'),
	session: service(),
	appMeta: service(),
	pinned: service(),
	pinState : {
		isPinned: false,
		pinId: '',
		newName: ''
	},
	saveTemplate: {
		name: '',
		description: ''
	},
	showTools: true, 			// show document related tools? favourite, delete, make template...
	showDocumentLink: false, 	// show link to document in breadcrumbs

	didReceiveAttrs() {
		this._super(...arguments);

		let doc = this.get('document');

		this.get('pinned').isDocumentPinned(doc.get('id')).then((pinId) => {
			this.set('pinState.pinId', pinId);
			this.set('pinState.isPinned', pinId !== '');
			this.set('pinState.newName', doc.get('name'));
			this.renderTooltips();
		});

		this.set('saveTemplate.name', this.get('document.name'));
		this.set('saveTemplate.description', this.get('document.excerpt'));
	},

	didInsertElement() {
		this._super(...arguments);

		this.modalInputFocus('#document-template-modal', '#new-template-name');
	},

	willDestroyElement() {
		this._super(...arguments);
		this.removeTooltips();
	},

	actions: {
		onDocumentDelete() {
			this.modalClose('#document-delete-modal');
			
			this.attrs.onDocumentDelete();
		},

		onPrintDocument() {
			window.print();
		},

		onUnpin() {
			this.get('pinned').unpinItem(this.get('pinState.pinId')).then(() => {
				$('#document-pin-button').tooltip('dispose');
				this.set('pinState.isPinned', false);
				this.set('pinState.pinId', '');
				this.eventBus.publish('pinChange');
				this.renderTooltips();
			});
		},

		onPin() {
			let pin = {
				pin: this.get('pinState.newName'),
				documentId: this.get('document.id'),
				folderId: this.get('space.id')
			};

			this.get('pinned').pinItem(pin).then((pin) => {
				$('#document-pin-button').tooltip('dispose');
				this.set('pinState.isPinned', true);
				this.set('pinState.pinId', pin.get('id'));
				this.eventBus.publish('pinChange');
				this.renderTooltips();
			});

			return true;
		},

		onSaveTemplate() {
			let name = this.get('saveTemplate.name');
			let excerpt = this.get('saveTemplate.description');

			if (is.empty(name)) {
				$("#new-template-name").addClass("is-invalid").focus();
				return;
			}

			if (is.empty(excerpt)) {
				$("#new-template-desc").addClass("is-invalid").focus();
				return;
			}

			$("#new-template-name").removeClass("is-invalid");
			$("#new-template-desc").removeClass("is-invalid");

			this.set('saveTemplate.name', '');
			this.set('saveTemplate.description', '');

			this.attrs.onSaveTemplate(name, excerpt);

			this.modalClose('#document-template-modal');

			return true;
		},
	}
});
