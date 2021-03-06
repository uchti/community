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

package pin

import "github.com/documize/community/model"

// Pin defines a saved link to a document or space
type Pin struct {
	model.BaseEntity
	OrgID      string `json:"orgId"`
	UserID     string `json:"userId"`
	FolderID   string `json:"folderId"`
	DocumentID string `json:"documentId"`
	Pin        string `json:"pin"`
	Sequence   int    `json:"sequence"`
}
