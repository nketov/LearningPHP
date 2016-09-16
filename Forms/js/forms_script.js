$('document').ready(function () {

    var uploadedFile = $("#file"), buttonClearUploaded = $("#buttonClearUploaded"), buttonUpload = $('#buttonUpload').find('span');
    buttonClearUploaded.fadeOut();
    //                                                                                          Hover Buttons
    $('.button').hover(function() {
        $(this).animate({ bottom: "7%", width: "145px"}, 100);

    },function(){        
        $(this).animate({ bottom: "5%", width: "128px" }, 100);
    });
    
//                                                                                             Uploader
    var uploader = new AjaxUpload(buttonUpload, {
        action: 'form_submit.php?button=upload',

        onSubmit: function () {
            buttonUpload.text('Загрузка... ');
            this.disable();
            $('#imageLoad').show();
        },

        onComplete: function (file) {
            $('#imageLoad').hide();
            uploadedFile.text(file);
            uploadedFile.fadeIn(2000);
            buttonClearUploaded.fadeIn(2000);
            buttonUpload.text("Фаил загружен").css('opacity', '0.5');
        }
    });
    
    buttonClearUploaded.on("click", function () {
        uploader.enable();
        $.get("form_submit.php?button=clearUploaded");
        buttonUpload.text('Выбрать файл').css('opacity', '1');
        uploadedFile.fadeOut(2000);
        buttonClearUploaded.fadeOut(2000);
    });
    
    //                                                                                              DataPicker
    $("#birthdate").datepicker({
        dateFormat: 'dd/mm/yy ', showAnim: 'show', defaultDate: '-20y', changeYear: true
    });

    //                                                                                     Buttons Clicks
    $("#right-button").on("click", function () {
        $('#page1').fadeToggle(1000);
        $('#page2').fadeToggle(2000);
    });

    $("#left-button").on("click", function () {

        $('#page2').fadeToggle(1000);
        $('#page1').fadeToggle(2000);

    });

    $("#mail-button").on("click", function () {

        $.post("form_submit.php?button=mail", {
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                sex: $('input:radio[name=sex]:checked').val(),
                birthdate: $("#birthdate").val(),
                optionallyInformation: $("#optionallyInformation").val(),
                emailAddress: $("#emailAddress").val()
            },

            function (mailResult) {
                $('#mailResult').append(mailResult);
            });

        $('#page2').fadeToggle(1000);
        $('#page3').fadeToggle(2000);
    });

    $("#blank-button").on("click", function () {

        $("#firstName").val("");
        $("#lastName").val("");
        $('input:radio[name=sex]').prop('checked', false);
        $("#birthdate").val("");
        $("#optionallyInformation").val("");
        $("#emailAddress").val("");
        buttonClearUploaded.click();
        $('#mailResult').text('');

        $('#page3').fadeToggle(1000);
        $('#page1').fadeToggle(2000);

    });

    $("#close-button").on("click", function () {

        location.assign("../../index.html");
        buttonClearUploaded.click();
    });

});





