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

package user

import (
	"fmt"

	"github.com/documize/community/model"
	"github.com/documize/community/model/account"
)

// User defines a login.
type User struct {
	model.BaseEntity
	Firstname string            `json:"firstname"`
	Lastname  string            `json:"lastname"`
	Email     string            `json:"email"`
	Initials  string            `json:"initials"`
	Active    bool              `json:"active"`
	Editor    bool              `json:"editor"`
	Admin     bool              `json:"admin"`
	ViewUsers bool              `json:"viewUsers"`
	Global    bool              `json:"global"`
	Password  string            `json:"-"`
	Salt      string            `json:"-"`
	Reset     string            `json:"-"`
	Accounts  []account.Account `json:"accounts"`
}

// ProtectSecrets blanks sensitive data.
func (user *User) ProtectSecrets() {
	user.Password = ""
	user.Salt = ""
	user.Reset = ""
}

// Fullname returns Firstname + Lastname.
func (user *User) Fullname() string {
	return fmt.Sprintf("%s %s", user.Firstname, user.Lastname)
}

// GetAccount returns matching org account using orgID
func (user *User) GetAccount(orgID string) (a account.Account, found bool) {
	for _, a := range user.Accounts {
		if a.OrgID == orgID {
			return a, true
		}
	}

	return a, false
}
