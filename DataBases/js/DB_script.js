$('document').ready(function () {


    var selectButton = $('#selectButton').fadeToggle(500);

    drawOriginalTables();


    selectButton.on("click", function () {

        $('.originalTable').parent().stop().fadeOut(300);

        $('#selectButton').stop().fadeOut(310, function () {

            $('#backButton').stop().fadeIn(300);

            var category = $('#categorySelect').val('1').fadeIn(0);

            $('body').append(drawSelectBar("artist"));

            $('#artistSelectBar').change(function () {
                artistAlbumSelect();
            });

            category.change(function () {

                    var selectBar = $('.selectBar');

                    $('table').parent().stop().fadeOut();

                    switch (category.val()) {

                        case "1":
                            selectBar.replaceWith(drawSelectBar("artist"));
                            $('#artistSelectBar').change(function () {
                                artistAlbumSelect();
                            });
                            break;

                        case "2":
                            selectBar.replaceWith(drawSelectBar("year10"));
                            $('#year10SelectBar').change(function () {
                                yearAlbumSelect();
                            });
                            break;

                        case "3":
                            selectBar.replaceWith(drawSelectBar("artistFirstCharacter"));
                            $('#artistFirstCharacterSelectBar').change(function () {
                                artistFirstCharacterSongSelect();
                            });
                            break;
                    }
                }
            );
        });

        $("#backButton").on("click", function () {

            $('#backButton').stop().fadeOut(0);
            $('.selectBar').remove();
            $("table[class != originalTable]").parent().stop().fadeOut();
            $('#categorySelect').stop().fadeOut(0).val("1");
            selectButton.stop().fadeIn(500);
            $('.originalTable').parent().stop().fadeIn(500);
        })
    });
});
//__________________________________________________________


//                                                                                           Draw Table

function drawTable(tableID, name, columns, selecting) {
    var table = $("#tablePattern").clone().appendTo("body");
    table.stop().fadeToggle(500);
    table.find("h2").html(name);
    table.find("table").attr("id", tableID);

    for (i in columns) {
        table.find("table thead tr").append("<th>" + columns[i] + "</th>");
    }

    url = "data_bases.php?table=" + tableID;

    if (selecting) {
        url += "&" + selecting[0] + '=' + selecting[1];
        table.find("table").attr("class", tableID + "Table");
    } else {
        table.find("table").attr("class", "originalTable");
    }

    $.ajax({
        url: url,
        dataType: 'json',
        success: function (json) {
            var out = '', line;

            if (json.length == 1) {
                out += "<tr><td></td><td colspan='3'>Подходящих записей нету</td></tr>";
            }
            else {
                for (j = 0; j <= json.length - 2; j++) {
                    line = '';
                    for (var i in json[j]) {
                        if (i == 'id') {
                            line += "<td>" + (j + 1) + "</td>";
                            var ID = json[j][i];
                        }
                        else {
                            line += "<td name=" + i + ">" + json[j][i] + "</td>";
                        }
                    }
                    if (table.find("table").attr("class") == "originalTable") {
                        line += "<td class='buttonsCRUD'></td>";
                    }
                    out += "<tr name=" + ID + ">" + line + "</tr>";
                }
            }

            table.find('tbody').html(out);
            if (table.find("table").attr("class") != "originalTable") {
                table.append("<label> SQL: " + json[json.length - 1] + "</label></br>");

            } else {

                table.find('.buttonsCRUD').append("<span class='buttonView'><img src='images/view_button.png'></span>")
                    .append("<span class='buttonEdit'><img src='images/edit_button.png'></span>")
                    .append("<span class='buttonDelete'><img src='images/delete_button.png'></span>");

                table.find('tbody').append("<tr>" + line + "</tr>");
                line = table.find('tr').last();
                createLine(line);

            }
        }
    });
    return table;
}

//                                                                            Draw Original Tables

function drawOriginalTables() {

    var columns = ["Название песни", "Альбом", "Жанр"];
    drawTable("song", "Песни", columns).css("float", "left");

    columns = ["Исполнитель", "Возраст", "Пол", "Начало"];
    drawTable("artist", "Исполнители", columns).css("float", "right");

    columns = ["Название альбома", "Дата выхода", "Исполнитель"];
    drawTable("album", "Альбомы", columns).css("float", "right");

    columns = ["Жанр"];
    drawTable("genre", "Жанры", columns).css("float", "right");

    // CRUD   Panels

    var overlay = $('#overlay');
    var close = $('.closePanelButton, #overlay, .saveButton');
    var panel, x, y;

    $('table').on("click", ".buttonsCRUD span", function () {


        x = $(this).offset().left - $(window).scrollLeft();
        y = $(this).offset().top - $(window).scrollTop();
        if (y < 425) y = 425;


        switch ($(this).attr("class")) {
            case 'buttonView':
                panel = viewPanel(x + 17, y + 17, $(this).parents('.originalTable').attr("id"), $(this).parents('tr').attr("name"));
                break;

            case 'buttonEdit':
                panel = editPanel(x + 17, y + 17, $(this).parents('.originalTable').attr("id"), $(this).parents('tr').attr("name"));
                break;

            case 'buttonDelete':
                panel = null;

                if (confirm('Удалить запись?')) {
                    var editTableName = $(this).parents('.originalTable').attr("id");
                    var deleting = $(this).parents('tr').attr("name");

                    $.post("data_bases.php?table=" + editTableName, {
                            deleting: deleting
                        },
                        function (deletingResult) {
                            if (deletingResult == "0") {
                                alert("Нельзя удалить связанную запись");
                            }
                            else {
                                $(".originalTable").parent().remove();
                                drawOriginalTables();
                            }
                        });
                }

                break;
        }

        var height = panel.val();

        overlay.stop().fadeIn(300,
            function () {
                panel.stop()
                    .css('display', 'block').stop()
                    .animate({
                        opacity: 0.95,
                        top: y - height + 17,
                        left: x - 325 + 17,
                        width: '325px',
                        height: height
                    }, 500);
            });
    });

    close.on("click", function () {
        overlay.stop().fadeOut(500);
        panel.stop()
            .animate({
                    opacity: 0,
                    top: y + 17,
                    left: x + 17,
                    width: '0px',
                    height: '0px'
                }, 500,
                function () {
                    $(this).css('display', 'none');
                    overlay.stop().fadeOut(300);
                    panel.remove();
                }
            );
    });

    $('table').on("click", ".createButton", function () {
            if (confirm("Создать запись?")) {

                var create = $(this).parent('tr').find("td").map(function () {
                    return [$(this).attr('name'), $(this).children().val()];
                }).get();

                var tableName = $(this).parents('table').attr("id");
                $.post("data_bases.php?table=" + tableName, {
                        create: create
                    },

                    function () {
                        $(".originalTable").parent().remove();
                        drawOriginalTables();
                    });
            }
        }
    );

}


//                                                                                       Draw Select Bar
function drawSelectBar(select, defaultValue) {

    url = "data_bases.php?selectBar=" + select;


    var selectBar = $("#selectPattern").clone();

    if ($("#backButton").css("display") == "none") {
        selectBar.attr("id", select + "SelectBarOriginal").attr("class", "selectBarOriginal");
    }
    else {
        selectBar.attr("id", select + "SelectBar").attr("class", "selectBar");
    }

    // Artist or Genre or Album

    if (select == "artist" || (select == "genre") || (select == "album")) {

        var selectHead;

        switch (select) {

            case "artist":
                selectHead = "Выбор исполнителя";
                break;

            case "genre":
                selectHead = "Выбор жанра";
                break;

            case "album":
                selectHead = "Выбор альбома";
                break;
        }

        selectBar.find("option:first").html(selectHead).val("");


        $.ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                var out = '';
                for (j = 0; j <= json.length - 2; j++) {
                    out += "<option value=" + json[j]['id'] + ">" + json[j]['name'] + "</option>";
                }
                selectBar.append(out);
                selectBar.find(":contains(" + defaultValue + ")").attr("selected", "selected");
            }
        });
    }

    // Year

    if (select == "year") {
        selectBar.find("option:first").html("Выбор годa").val("");

        var out = '';
        for (j = 1950; j <= 2016; j++) {
            out += "<option value=" + j + ">" + j + "</option>";
        }

        selectBar.append(out);
        selectBar.find(":contains(" + defaultValue + ")").attr("selected", "selected");
    }


    // Year 10

    if (select == "year10") {
        selectBar.find("option:first").html("Выбор годов").val("");

        var out = '';
        for (j = 50; j <= 110; j += 10) {
            out += "<option value=" + j + ">" + j % 100 + "-е</option>";
        }
        selectBar.append(out);
    }

    // age

    if (select == "age") {
        selectBar.find("option:first").html("Возраст").val("");

        var out = "<option value=''>Коллектив</option>";
        for (j = 18; j <= 110; j++) {
            out += "<option value=" + j + ">" + j + "</option>";
        }
        out += "<option value=''>R.I.P.</option>";
        selectBar.append(out);
        selectBar.find(":contains(" + defaultValue + ")").attr("selected", "selected");
    }

    // Sex

    if (select == "sex") {
        selectBar.find("option:first").html("Пол").val("");

        var out = "<option value=''>Коллектив</option>";
        out += "<option value='1'>Мужской</option>";
        out += "<option value='0'>Женский</option>";
        selectBar.append(out);
        selectBar.find(":contains(" + defaultValue + ")").attr("selected", "selected");
    }


    // Artist First Character

    if (select == "artistFirstCharacter") {
        selectBar.find("option:first").html("Выбор первой буквы исполнителя").val("");

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (json) {

                var out = '';
                for (j = 0; j <= json.length - 2; j++) {

                    var artistFirstCharacter = json[j]['name'].charAt(0);
                    out += "<option value=" + artistFirstCharacter + ">" + artistFirstCharacter + "</option>";
                }
                selectBar.append(out);
            }
        });
    }

    return selectBar;
}


//                                                                          Artist Albums Table
function artistAlbumSelect() {

    var artistID = ['artistID', $('#artistSelectBar').val()];

    $('table').parent().hide();

    if (artistID[1]) {
        columns = ["Название альбома", "Дата выхода"];
        drawTable("album", "", columns, artistID);
    }
}

//                                                                          Years Albums Table
function yearAlbumSelect() {
    var yearID = ['yearID', $('#year10SelectBar').val()];
    $('table').parent().hide();

    if (yearID[1]) {
        columns = ["Название альбома", "Дата выхода", "Исполнитель"];
        drawTable("album", "", columns, yearID);
    }
}

//                                                Artist First Characters Albums Table
function artistFirstCharacterSongSelect() {

    var artistFirstCharacterID = ['artistFirstCharacterID', $('#artistFirstCharacterSelectBar').val()];

    $('table').parent().hide();

    if (artistFirstCharacterID[1]) {
        columns = ["Название песни", "Альбом", "Жанр", "Исполнитель"];
        drawTable("song", "", columns, artistFirstCharacterID);
    }
}

//                                                                                             View Panel

function viewPanel(x, y, viewTableName, viewID) {

    var panel = $("#panelPattern").clone(true).appendTo("body"), height = 32;

    panel.css("top", y).css("left", x);

    url = "data_bases.php?table=" + viewTableName + "&panel=view&ID=" + viewID;

    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function (json) {

            for (var i in json[0]) {
                panel.append("<p>" + i + ":</p>").append("<p id=" + i + ">" + json[0][i] + "</p>");
                height += 50;
            }
            panel.val(height);
        }

    });
    return panel;
}

//                                                                                             Edit Panel

function editPanel(x, y, editTableName, viewID) {

    var panel = viewPanel(x, y, editTableName, viewID);

    var value = panel.find('#name').html();

    panel.find('#id').html("<span>" + viewID + "</span>");
    panel.find('#id').children().val(viewID);
    panel.find('#name').html("<input type='text' value='" + value + "' size=35></<input>");
    panel.find('#artist_name').html(drawSelectBar('artist', panel.find('#artist_name').html()));
    panel.find('#album_name').html(drawSelectBar('album', panel.find('#album_name').html()));
    panel.find('#genre_name').html(drawSelectBar('genre', panel.find('#genre_name').html()));

    panel.find('#age').html(drawSelectBar('age', panel.find('#age').html()));

    panel.find('#sex').html(drawSelectBar('sex', panel.find('#sex').html()));


    panel.find('#year').html(drawSelectBar('year', panel.find('#year').html()));

    panel.find('.selectBarOriginal').find("option:first").remove();

    var defaultDate = new Date(panel.find('#date').html());
    panel.find('#date').html("<input type='text'  size=10>");
    panel.find('#date').find('input').datepicker({
        dateFormat: 'yy-mm-dd', showAnim: 'show', changeYear: true
    }).datepicker("setDate", defaultDate);

    panel.val(120 + Number(panel.val()));
    panel.find('.saveButton').stop().fadeIn(1000);

    panel.on("click", ".saveButton", function () {

        if (confirm("Сохранить изменения?")) {
            var update = $(this).parent('div').find("p:nth-child(even)").map(function () {
                return [$(this).attr('id'), $(this).children().val()];
            }).get();


            $.post("data_bases.php?table=" + editTableName, {
                    update: update
                },

                function () {
                    $(".originalTable").parent().remove();
                    drawOriginalTables();
                });
        }
    });
    return panel;
}

// Create Line

function createLine(line) {

    line.find('td').first().replaceWith("<div class='createButton'></div>");

    line.find("td[name='name']").html("<input type='text' value='" + "Новая запись" + "' size=30></<input>");
    line.find("td[name='artist_name']").html(drawSelectBar('artist'));
    line.find("td[name='album_name']").html(drawSelectBar('album'));
    line.find("td[name='genre_name']").html(drawSelectBar('genre'));

    line.find("td[name='age']").html(drawSelectBar('age'));

    line.find("td[name='sex']").html(drawSelectBar('sex'));

    line.find("td[name='year']").html(drawSelectBar('year'));

    line.find("td[name='date']").html("<input type='text'  size=10>");

    line.find("td[name='date']").find('input').datepicker({
        dateFormat: 'yy-mm-dd', showAnim: 'show', changeYear: true, defaultDate: '-25y'
    });
}

