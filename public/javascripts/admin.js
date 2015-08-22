/**
 *  This file is part of PrimSchool project.
 *
 *  PrimSchool is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This Web application is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with PrimSchool.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @copyright     Copyright (c) PrimSchool
 * @link          http://primschool.org
 * @license       http://www.gnu.org/licenses/ GPLv3 License
 */

// *****************
// school management
// *****************

var showSchoolList = function () {
    var tableContent = '';

    $.getJSON('/admin/schoollist', function (data) {
        var text = $('<i />', {class: "glyphicon glyphicon-plus", html: "&nbsp;Nouvelle école"});
        var button = $('<a />', {
            class: "btn btn-primary btn-md active",
            href: "/admin/createschool/"
        });

        $('#title').html('Ecoles');
        $('#backdiv').hide();
        $('#newbutton').html('');
        text.appendTo(button);
        button.appendTo($('#newbutton'));
        $('<br />').appendTo($('#newbutton'));
        $('<br />').appendTo($('#newbutton'));
        $('#tablehead').html('<th>Nom</th><th>Responsable</th><th></th>');
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" rel="' + this._id + '" title="Show Details">' + this.name + '</a></td>';
            tableContent += '<td>' + this.owner.username + '</td>';
            tableContent += '<td><a class="btn btn-success btn-md active" onclick="showGroupList($(this));" href="#" rel="' + this._id + '">Groupes</a></td>';
            tableContent += '<td><a class="btn btn-warning btn-md active" onclick="showUserList($(this));" href="#" rel="' + this._id + '">Utilisateurs</a></td>';
            tableContent += '<td><a class="btn btn-danger btn-md active" onclick="deleteSchool(event, $(this));" href="#" rel="' + this._id + '"><i class="glyphicon glyphicon-remove">&nbsp;Supprimer</i></a></td>';
            tableContent += '</tr>';
        });
        $('#tablebody').html(tableContent);
    });
};

var addSchool = function (event, element) {
    event.preventDefault();

    var newSchool = {
        'name': $('#addschool fieldset input#inputName').val(),
        'idOwner': $('#addschool fieldset select#inputIdOwner').val(),
    };
    $.ajax({
        type: 'POST',
        data: newSchool,
        url: '/admin/addschool',
        dataType: 'JSON'
    }).done(function (response) {
        if (response.msg === '') {
            window.location.replace("/admin");
        } else {
            alert('Error: ' + response.msg);
        }
    });
};

var deleteSchool = function (event, element) {
    event.preventDefault();

    var confirmation = confirm('Etes-vous sûr de vouloir supprimer l\'école ?');

    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/admin/deleteschool/' + element.attr('rel')
        }).done(function (response) {
            if (response.msg !== '') {
                alert('Error: ' + response.msg);
            }
            showSchoolList();
        });
    } else {
        return false;
    }
};

// ****************
// group management
// ****************

var showGroupList = function (element) {
    var tableContent = '';

    $.ajax({
        dataType: 'json',
        url: '/admin/grouplist/' + element.attr('rel')
    }).done(function (data) {
        var text = $('<i />', {class: "glyphicon glyphicon-plus", html: "&nbsp;Nouveau groupe"});
        var button = $('<a />', {
            class: 'btn btn-primary btn-md active',
            href: '/admin/creategroup/' + element.attr('rel')
        });

        $('#title').html('Groupes');
        $('#backdiv').show();
        $('#backlink').attr('onclick', 'showSchoolList();');
        $('#newbutton').html('');
        text.appendTo(button);
        button.appendTo($('#newbutton'));
        $('<br />').appendTo($('#newbutton'));
        $('<br />').appendTo($('#newbutton'));
        $('#tablehead').html('<th>Sigle</th><th>Nom</th><th>Propriétaire</th><th></th>');
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" rel="' + this._id + '" title="Show Details">' + this.sigle + '</a></td>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.owner.username + '</td>';
            tableContent += '<td><a class="btn btn-success btn-md active" onclick="showUserListOfGroup(event, $(this));" href="#" rel="' + this._id + '"><i class="glyphicon glyphicon-plus">&nbsp;Liste des élèves</i></a></td>';
            tableContent += '<td><a class="btn btn-danger btn-md active" onclick="deleteGroup(event, $(this));" href="#" rel="' + this._id + '"><i class="glyphicon glyphicon-remove">&nbsp;Supprimer</i></a></td>';
            tableContent += '</tr>';
        });
        $('#tablebody').html(tableContent);
    });
};

var addGroup = function (event, element) {
    event.preventDefault();

    var newGroup = {
        'name': $('#addgroup fieldset input#inputName').val(),
        'sigle': $('#addgroup fieldset input#inputSigle').val(),
        'idOwner': $('#addgroup fieldset select#inputIdOwner').val(),
        'idSchool': $('#addgroup fieldset input#inputIdSchool').val()
    };
    $.ajax({
        type: 'POST',
        data: newGroup,
        url: '/admin/addgroup',
        dataType: 'JSON'
    }).done(function (response) {
        if (response.msg === '') {
            window.location.replace("/admin");
        } else {
            alert('Error: ' + response.msg);
        }
    });
};

var deleteGroup = function (event, element) {
    event.preventDefault();

    var confirmation = confirm('Etes-vous sûr de vouloir supprimer le groupe ?');

    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/admin/deletegroup/' + element.attr('rel')
        }).done(function (response) {
            if (response.msg !== '') {
                alert('Error: ' + response.msg);
            }
            showSchoolList();
        });
    } else {
        return false;
    }
};

// ***************
// user management
// ***************

var showUserList = function (element) {
    showUserList2(element.attr('rel'));
};

var showUserList2 = function (schoolID) {
    var tableContent = '';

    $.getJSON('/admin/userlist/' + schoolID, function (data) {
        $('#title').html('Utilisateurs');
        $('#backdiv').show();
        $('#backlink').attr('onclick', 'showSchoolList();');
        $('#newbutton').html('');
        $('#tablehead').html('<th>Login</th><th>Email</th><th>Prénom</th><th>Nom</th><th>Rôles</th><th></th><th></th><th></th>');
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" rel="' + this._id + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td>' + this.firstName + '</td>';
            tableContent += '<td>' + this.lastName + '</td>';
            tableContent += '<td>';
            this.roles.forEach(function (role) {
                tableContent += role + ' ';
            });
            tableContent += '</td>';
            if (this.roles.indexOf("student") !== -1 && this.groups.length == 0) {
                tableContent += '<td><a class="btn btn-success btn-md active" title="Affecter à un groupe" href="/admin/assignusertogroup/' + this._id + '/' + schoolID + '"><i class="glyphicon glyphicon-plus"></i></a></td>';
            } else {
                tableContent += '<td></td>';
            }
            if (this.username === 'root') {
                tableContent += '<td></td><td></td>';
            } else {
                if (this.isActive) {
                    tableContent += '<td><a class="btn btn-warning btn-md active" title="Desactiver" onclick="invalidateUser(event, $(this), \'' + schoolID + '\');" href="#" rel="' + this._id + '"><i class="glyphicon glyphicon-thumbs-down"></i></a></td>';
                } else {
                    tableContent += '<td><a class="btn btn-success btn-md active" title="Activer" onclick="validateUser(event, $(this), \'' + schoolID + '\');" href="#" rel="' + this._id + '"><i class="glyphicon glyphicon-thumbs-up"></i></a></td>';
                }
                tableContent += '<td><a class="btn btn-danger btn-md active" title="Supprimer" onclick="deleteUser(event, $(this), \'' + schoolID + '\');" href="#" rel="' + this._id + '"><i class="glyphicon glyphicon-remove"></i></a></td>';
            }
            tableContent += '</tr>';
        });
        $('#tablebody').html(tableContent);
    });
};

var deleteUser = function (event, element, idSchool) {
    event.preventDefault();

    var confirmation = confirm('Etes-vous sûr de vouloir supprimer l\'utilisateur ?');

    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/admin/deleteuser/' + element.attr('rel')
        }).done(function (response) {
            if (response.msg !== '') {
                alert('Error: ' + response.msg);
            }
            showUserList2(idSchool);
        });
    } else {
        return false;
    }
};

var validateUser = function (event, element, idSchool) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/admin/validateuser/' + element.attr('rel')
    }).done(function (response) {
        if (response.msg !== '') {
            alert('Error: ' + response.msg);
        }
        showUserList2(idSchool);
    });
};

var invalidateUser = function (event, element, idSchool) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/admin/invalidateuser/' + element.attr('rel')
    }).done(function (response) {
        if (response.msg !== '') {
            alert('Error: ' + response.msg);
        }
        showUserList2(idSchool);
    });
};

var showUserListOfGroup = function (event, element) {
    event.preventDefault();
    showUserListOfGroup2(element.attr('rel'));
};

var showUserListOfGroup2 = function (groupID) {
    var tableContent = '';

    $.getJSON('/admin/group/' + groupID, function (data) {
        $('#title').html('Elèves [' + data.name + ']');
        $.ajax({
            type: 'GET',
            url: '/admin/userlistofgroup/' + groupID,
            dataType: 'JSON'
        }).done(function (data) {
            var text = $('<i />', {class: "glyphicon glyphicon-plus", html: "&nbsp;Nouveau élève"});
            var button = $('<a />', {
                class: 'btn btn-primary btn-md active',
                href: '/admin/createusertogroup/' + groupID
            });

            $('#backdiv').show();
            $('#backlink').attr('onclick', 'showSchoolList();');
            $('#newbutton').html('');
            text.appendTo(button);
            button.appendTo($('#newbutton'));
            $('<br />').appendTo($('#newbutton'));
            $('<br />').appendTo($('#newbutton'));
            $('#tablehead').html('<th>Prénom</th><th>Nom</th><th></th><th></th>');
            $.each(data, function () {
                tableContent += '<tr>';
                tableContent += '<td>' + this.firstName + '</td>';
                tableContent += '<td>' + this.lastName + '</td>';
                if (this.username === 'root') {
                    tableContent += '<td></td><td></td>';
                } else {
                    tableContent += '<td><a class="btn btn-warning btn-md active" onclick="removeUserToGroup(event, $(this));" href="#" rel="' + this._id + '/' + groupID + '"><i class="glyphicon glyphicon-share">&nbsp;Retirer du groupe</i></a></td>';
                    tableContent += '<td><a class="btn btn-danger btn-md active" onclick="deleteUser(event, $(this));" href="#" rel="' + this._id + '"><i class="glyphicon glyphicon-remove">&nbsp;Supprimer</i></a></td>';
                }
                tableContent += '</tr>';
            });
            $('#tablebody').html(tableContent);
        });
    });
};

var addUserToGroup = function (event, element) {
    event.preventDefault();

    var newUser = {
        'firstName': $('#adduser fieldset input#inputFirstName').val(),
        'lastName': $('#adduser fieldset input#inputLastName').val(),
        'idGroup': $('#adduser fieldset input#inputIdGroup').val()
    };
    $.ajax({
        type: 'POST',
        data: newUser,
        url: '/admin/addusertogroup',
        dataType: 'JSON'
    }).done(function (response) {
        if (response.msg === '') {
            window.location.replace("/admin");
        } else {
            alert('Error: ' + response.msg);
        }
    });
};

var removeUserToGroup = function (event, element) {
    event.preventDefault();

    $.ajax({
        type: 'POST',
        url: '/admin/removeusertogroup/' + element.attr('rel')
    }).done(function (response) {
        var list = element.attr('rel').split('/');

        if (response.msg !== '') {
            alert('Error: ' + response.msg);
        }
        showUserListOfGroup2(list[1]);
    });
};

var assignUserToGroup = function (event, element) {
    event.preventDefault();

    $.ajax({
        type: 'POST',
        url: '/admin/assignusertogroup/' + $('#assignusertogroup fieldset input#inputIdUser').val() + '/' + $('#assignusertogroup fieldset select#inputIdGroup').val()
    }).done(function (response) {
        if (response.msg !== '') {
            alert('Error: ' + response.msg);
        }
        window.location.replace("/admin");
    });
};