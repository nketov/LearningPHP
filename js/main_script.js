$('document').ready(function () {
        
//                                                                                           Logon Check
    var user = $('#user');
    $.post("users.php?action=logonCheck", {},
        function (checkResult) {
            if (checkResult == '') {
                $('#buttonLogon').fadeIn();
                user.fadeOut();
                $('#buttonLogout').fadeOut();
                $('#buttonDB').fadeOut();
            }

            else {
                $('#buttonLogon').fadeOut();
                user.find('span').html(checkResult);
                user.fadeIn();
                $('#buttonLogout').fadeIn();
                $('#buttonDB').fadeIn(2000);
            }
        });


//                                                                                              Completed
    var column = 1, buttonTopShift = 275;
    var buttonLeftShift = -370, isButtonActive = false;
    $('.complete').each(function () {

        if ($(this).prev().get(0).tagName=='BR' ) {
            buttonLeftShift = -370;
            buttonTopShift+=150;
        }
        $(this).css('top', buttonTopShift);
        buttonLeftShift += 375;

        $(this).animate({opacity: 1, left: buttonLeftShift}, 1000,
            function () {
                isButtonActive = true;
            });
    });

//                                                                                        Not completed
    var  buttonTopShift = 575, buttonLeftShift = -295;
    $('.not-complete').each(function () {

        buttonLeftShift += 300;

        if ($(this).prev().get(0).tagName=='BR' ) {
            buttonTopShift += 125;
            buttonLeftShift = 5;
        }

        $(this).animate({
            opacity: 1,
            left: buttonLeftShift,
            top: buttonTopShift,
            width: "250px",
            height: "65px"
        }, 1000);

    });

    //                                                                                      Button Hover
    $('.complete, #registration,.panelButtons,#enter, .closePanelButton,#buttonLogon,#buttonLogout').hover(
        function () {
            if (isButtonActive) {
                var top = parseInt($(this).css("height"), 10) / 17;
                $(this).stop().animate({marginTop: -top}, 500);
            }
        },
        function () {
            if (isButtonActive) {
                $(this).stop().animate({marginTop: 0}, 500);
            }

        });


//                                                                      Logon & Registration Panels
    var overlay = $('#overlay');
    var openPanel = $('.openPanel');
    var close = $('.closePanelButton, #overlay');
    var panel = $('.panel');

    openPanel.click(function (event) {
        event.preventDefault();
        var opening = $(this).attr('href');
        $(".error").html("");
        $('.panel').fadeOut(2000);

        overlay.fadeIn(500,
            function () {
                $(opening)
                    .css('display', 'block')
                    .animate({opacity: 0.95, top: '50%', right: '50%', width: '300px', height: '375px'}, 500);
            });
    });

    close.click(function () {
        panel
            .animate({opacity: 0, top: '25%', right: '15%', width: '50px', height: '60px'}, 500,
                function () {
                    $(this).css('display', 'none');
                    overlay.fadeOut(500);
                }
            );
    });


    //                                                                                                   Logon

    $("#enter").on("click", function () {

        $.post("users.php?action=enter", {
                login: $("#login").val(),
                password: $("#password").val()
            },            
            function (enterResult) {
                if (enterResult == "OK") {
                    $('.panel').fadeOut(1000);
                    overlay.fadeOut(500);
                    $('#buttonLogon').fadeOut(1000);
                    user.find('span').html($("#login").val());
                    user.fadeIn(1000);
                    $('#buttonLogout').fadeIn(1000);
                    $('#buttonDB').fadeIn(1000);
                }
                else {
                    $(".message").fadeOut();
                    $(".error").fadeOut().html(enterResult).fadeIn(1000);
                }
            });
    });

    //                                                                                                 Logout
    $("#buttonLogout").on("click", function () {

        $.post("users.php?action=logout", {},
            function () {
                overlay.fadeOut(500);
                user.fadeOut();
                $('#buttonLogon').fadeIn();
                user.fadeOut();
                $('#buttonLogout').fadeOut();
                $('#buttonDB').fadeOut();
            });
    });

    //                                                                                           Registration

    $("#registration").on("click", function () {

        if ($("#password1").val() != $("#password2").val()) {
            $('#password1, #password2').css("background", "linear-gradient(to right bottom, #F00 50%, #000 100%)");
            $(".error").fadeOut().html("Пароли не совпадают").fadeIn(1000);
        }
        else if ($("#email").val() == "") {
            $('#email').css("background", "linear-gradient(to right bottom, #F00 50%, #000 100%)");
            $(".error").fadeOut().html("Пустой E-mail").fadeIn(1000);
        }
        else {
            $('#password1, #password2, #email').css("background", "linear-gradient(to right bottom, #DDD 50%, #999 100%)");

            $.post("users.php?action=reg", {
                    login: $("#email").val(),
                    password: $("#password1").val()
                },
                function (regResult) {
                    if (regResult == "UserAdded") {
                        $("#buttonLogon").click();
                        $(".error").html("");
                        $(".message").fadeOut().html("Ссылка для активации отправлена").fadeIn(3500);
                    }
                        
                    else {
                        $(".error").fadeOut().html(regResult).fadeIn(1000);
                    }
                });

        }
    });

    //                                                                                  Send Password

    $("#sendPassword").on("click", function () {

            $.post("users.php?action=sendPassword", {
                    login: $("#emailForPassword").val()
                    },
                function (sendingResult) {
                    if (sendingResult == "PasswordSent") {
                        $("#buttonLogon").click();
                        $(".error").html("");
                        $(".message").fadeOut().html("Пароль отправлен").fadeIn(2500);
                    }
                    else {
                        $(".error").fadeOut().html(sendingResult).fadeIn(1000);
                    }
                });

    });




});