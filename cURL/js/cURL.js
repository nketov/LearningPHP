$('document').ready(function () {

    $(".newsButtons").buttonset();

    $("#sitesTabs").tabs({});

    $(".page").height($(window).height() * 0.7);

    $(".page").each(function () {
        var thisPage = $(this);

        $.ajax({
            url: thisPage.attr("id") + ".php?GET=size",
            success: function (size) {
                thisPage.attr("name", size);
            }
        });

        $.ajax({
            url: thisPage.attr("id") + ".php?GET=0",
            success: function (html) {
                thisPage.append(html);
                thisPage.find(".newsButtons").attr("name", "0");
            }
        });               

    });


    $(".siteImg").on("dblclick", function () {
            switch ($(this).parent().attr("href")) {

                case "#kramatorsk_info":
                    window.open("http://www.kramatorsk.info/", "_blank");
                    break;

                case "#hi_dn_ua":
                    window.open("http://hi.dn.ua/", "_blank");
                    break;

                case "#6264_com_ua":
                    window.open("http://www.6264.com.ua/", "_blank");
                    break;
            }
        }
    );


    $("button").on("click", function () {

        var thisPage=$(this).parent().parent();
        var number = thisPage.find(".newsButtons").attr("name");
        var maxNumber = thisPage.attr("name");

        if ($(this).hasClass("next")) {
            if (number < maxNumber - 1) {
                number++;
            }
            else {
                number = 0;
            }
        }

        else {
            if (number > 0) {
                number--;
            }
            else {
                number = maxNumber - 1;
            }

        }

        thisPage.find(".newsButtons").attr("name", number);

        $.get({
            url: thisPage.attr("id") +".php?GET=" + number,
            success: function (html) {

                thisPage.find(".newsButtons").nextAll().fadeOut(500);

                setTimeout(function () {
                    thisPage.find(".newsButtons").nextAll().remove();
                    thisPage.append(html);
                    thisPage.find(".newsButtons").nextAll().fadeOut(0).fadeIn(750);
                }, 555);
            }
        });
     });

    $(function () {
        $(window).resize(function () {
            $(".page").height($(window).height() * 0.70);
            $(":animated").stop();
        });
    })

 

});


