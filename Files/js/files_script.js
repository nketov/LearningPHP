$('document').ready(function () {

    $('#createButton').on("click", function () {

        $('#chooseButton').nextAll().remove();

        $('body').append("</br><input type='text' class='temporary' placeholder='Имя файла' size=35> </input>");
        $('body').append("<div id='OKButton' class='button temporary'>OK</div>");

        $('#OKButton').on("click", function () {
            var fileName = $('input').val();
            if (fileName == '') {
                alert("Пустое имя файла");
            }
            else if (!(/^([a-zа-яё0-9_.]+)$/i.test(fileName))){
                alert("Недопустимые символы");
            }
            else
            {

                $('#chooseButton').nextAll().remove();
                $.post("files.php?button=create", {
                        fileName: fileName
                    },

                    function (isExist) {
                        if (isExist == 1) {
                            $('body').append("<h2>Фаил с таким именем уже существует.</h2>");
                        } else {
                            $('body').append("<h2>Фаил " + fileName + " создан.</h2>");
                        }
                    });
            }
        });

    });

    $('#chooseButton').on("click", function () {
        $('#chooseButton').nextAll().remove();

        $.get("files.php?scan=1", {},
            function (scanResult) {
                if (scanResult.length < 1) {
                    $('body').append("<h2>Нету созданных файлов.</h2>");
                } else {
                    $('body').append("</br><select class='hidden' size='1'></select>");

                    for (var i = 0, len = scanResult.length; i < len; ++i) {
                        $('select').append("<option value=" + scanResult[i] + ">" + scanResult[i] + "</option>");
                    }

                    $('body').append("</br><div id='openButton'  class='button'>Открыть файл</div>");
                    $('body').append("<div id='deleteButton' class='button'>Удалить файл</div>");

                    $('#deleteButton').on("click", function () {
                        var fileName = $('select option:selected').val();

                        if (confirm("Удалить фаил?")) {

                            $.post("files.php?button=delete", {
                                    fileName: fileName
                                },
                                function () {
                                    $('select option:selected').remove();
                                    if ($('select').find('option').length == 0) {
                                        $('#chooseButton').nextAll().remove();
                                    }
                                });
                        }
                    });

                    $('#openButton').on("click", function () {
                            var fileName = $('select option:selected').val();

                            $.post("files.php?button=open", {
                                    fileName: fileName
                                },

                                function (fileContent) {
                                    $('#chooseButton').nextAll().remove();
                                    $('body').append("</br><textarea cols=75 rows=15>" + fileContent + "</textarea>");
                                    $('body').append("</br><div id='saveButton' class='button'>Сохранить файл: " + fileName + "</div>");

                                    $('#saveButton').on("click", function () {
                                        if (confirm("Перезаписать фаил?")) {
                                            $.post("files.php?button=save", {
                                                    fileName: fileName,
                                                    content: $('textarea').val()
                                                },

                                                function () {
                                                    $('#chooseButton').nextAll().remove();
                                                    $('body').append("<h2>Фаил " + fileName + " сохранён</h2>");
                                                });
                                        }
                                    });
                                });
                        }
                    );
                }
            }, "json");

    });

});





