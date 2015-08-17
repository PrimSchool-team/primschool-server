var showUserList = function () {
    var tableContent = '';

    $.getJSON('/admin/userlist', function (data) {
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td>' + this.firstName + '</td>';
            tableContent += '<td>' + this.lastName + '</td>';
            if (this.isActive) {
                tableContent += '<td><a class="btn btn-warning btn-md active" href="#"><i class="glyphicon glyphicon-thumbs-down">&nbsp;Desactiver</i></a></td>';
            } else {
                tableContent += '<td><a class="btn btn-success btn-md active" href="#"><i class="glyphicon glyphicon-thumbs-up">&nbsp;Activer</i></a></td>';
            }
            tableContent += '<td><a class="btn btn-danger btn-md active" onclick="deleteUser(event, $(this));" href="#" rel="' + this._id + '"><i class="glyphicon glyphicon-remove">&nbsp;Supprimer</i></a></td>';
            tableContent += '</tr>';
        });
        $('#userList table tbody').html(tableContent);
    });
};

var deleteUser = function (event, element) {
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
            showUserList();
        });
    } else {
        return false;
    }
};