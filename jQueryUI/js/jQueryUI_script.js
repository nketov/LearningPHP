var allCities = [], allCountries = [];

var allCitiesContent = scanDirs();

for (var city in allCitiesContent) {
    allCities.push(city.trim());
}

for (var city in allCitiesContent) {

    if ($.inArray(allCitiesContent[city][0].trim(), allCountries) == -1) {
        allCountries.push(allCitiesContent[city][0].trim());
    }
}


$('document').ready(function () {


    var overlay = $('#overlay');
    $(".cityBlock,#cityBlockPattern").stop().hide();

    overlay.on("click", function () {
        window.getSelection().removeAllRanges();
        overlay.fadeOut(1500);
        $("#bigImage").stop()
            .effect('puff', {mode: 'hide'}, 1200);

    });

    $("#bigImage").on("dblclick", function () {
        window.getSelection().removeAllRanges();
        overlay.fadeOut(800);
        $("#bigImage").stop()
            .effect('clip', {mode: 'hide'}, 750);
    });

    //    RIGHT

    $("#rightOverlay").on("click",function (event) {

        event.stopPropagation();

        var  images = allCitiesContent[$("#bigImage").attr("href")][4];
        var index = images.indexOf( $("#bigImage").attr("name"));

        if (index < images.length-1) {
            index++;
        }
        else {
            index = 0;
        }


        $("#bigImage").stop(false,true)
            .effect('slide', {mode: 'hide', direction: 'right'}, 500);

        setTimeout(function () {
            $("#bigImage")
                .attr("src", "images/Cities/" +$("#bigImage").attr("href") + "/" + images[index])
                .effect('slide', {mode: 'show', direction: 'left'}, 450);


        }, 450);

        $("#bigImage").attr("name", images[index]);

    });


//    LEFT

    $("#leftOverlay").click(function (event) {
        event.stopPropagation();

        var  images = allCitiesContent[$("#bigImage").attr("href")][4];
        var index = images.indexOf( $("#bigImage").attr("name"));

        if (index > 0) {
            index--;
        }
        else {
            index = images.length-1;
        }


        $("#bigImage").stop(false,true)
            .effect('slide', {mode: 'hide', direction: 'left'}, 500);

        setTimeout(function () {
            $("#bigImage")
                .attr("src", "images/Cities/" + $("#bigImage").attr("href") + "/" + images[index])
                .effect('slide', {mode: 'show', direction: 'right'}, 450);
        }, 450);

        $("#bigImage").attr("name", images[index]);

    });

    refreshCities(checkPopulation(1000000,10000000));


//                              jQUERY UI

    $("#selectCitiesAccordion").accordion({
        collapsible: true,
        icons: {'header': 'ui-icon-circle-triangle-e', 'headerSelected': 'ui-icon-circle-triangle-s'},
        active: false,
        heightStyle: 'content'
    });


  


//                                                                                      Min Max Slider

    $("#slider").slider({
        min: 0,
        max: 10000000,
        values: [0, 10000000],
        range: true,

        stop: function (event, ui) {
            $("input#minPopulation")
                .val(number_format($("#slider").slider("values", 0).toString()));
            $("input#maxPopulation")
                .val(number_format($("#slider").slider("values", 1).toString()));

            refreshCities(checkPopulation($("#slider").slider("values", 0), $("#slider").slider("values", 1)));


        },
        slide: function (event, ui) {
            $("input#minPopulation")
                .val(number_format($("#slider").slider("values", 0).toString()));
            $("input#maxPopulation")
                .val(number_format($("#slider").slider("values", 1).toString()));
        }
    });


//                                                                                      Select Countries

    allCountries.forEach(function (country) {
        $("#selectCountry")
            .append("<li id=" + country + "><img src='images/Flags/" + country + ".png''></li>");
    });


    $("#selectCountry").selectable({

        stop: function () {
            var activeCountries = [];

            $(".ui-selected").each(function () {
                activeCountries.push($(this).attr("id"));
            });

            refreshCities(checkCountries(activeCountries));

        }
    });

    //                                                      City Tags

    $("#tags").autocomplete({source: allCities});

    $("#addButton").on("click", function () {


        addByName($(this).prev("input").val());
    });


////////////////////////////////////////////
})
;

//                                                                             FUNCTIONS


function scanDirs() {
    var cities = {};

    $.ajax({
        url: "jQueryUI.php?allCities=GET",
        dataType: 'json',
        async: false,
        success: function (json) {

            $.each(json, function (key, val) {
                cities[key] = val;
            });

        }
    });

    return cities;
}


function createCityBlock(cityName) {

    var content = allCitiesContent[cityName];

    var cityBlock = $("#cityBlockPattern").clone(true)
        .appendTo("#desktop");

    cityBlock.attr("id", cityName);


    cityBlock.find('.headerCityBlock')
        .text(cityName.replace(/_/g, ' '));

    cityBlock.find('.cityImage')
        .attr("src", "images/Cities/" + cityName + "/" + content[4][0]);


    cityBlock.find('.cityCountry')
        .text(allCitiesContent[cityName][0].replace(/_/g, ' '));

    cityBlock.find('.cityCountryFlag')
        .attr("src", 'images/Flags/' + content[0].trim() + '.png');


    cityBlock.find('.cityPopulation')
        .text(content[1] / 1000 + " тыc .чел.");

    if (content[1] > 1000000) {
        cityBlock.find('.cityPopulation')
            .text(content[1] / 1000000 + " млн.чел.");
    }


    cityBlock.find('.cityArea')
        .text(content[2] + " км²");

    if (content[3].length > 135) {
        cityBlock.find('.cityText')
            .css("font-size", 9);
    }

    cityBlock.find('.cityText')
        .text(content[3]);

    cityBlock.attr("name", content[4][0]);
    cityBlock.stop().show('fade', 1000);
    cityBlock.attr("class", "cityBlock");

    cityBlock.find(".cityAccordion").accordion({
        collapsible: true,
        heightStyle: 'content'
    });


    //                                                                  Image View


    cityBlock.on("dblclick", ".cityImage", function () {

        window.getSelection().removeAllRanges();
        var thisImage = cityBlock.attr("name");
        $("#bigImage").attr("name", thisImage);
        $("#bigImage").attr("href", cityBlock.attr("id"));


// Big Image

        $("#bigImage").attr("src", "images/Cities/" + cityName + "/" + thisImage);


        var width = $("body").width() - 350;
        var height = width / 1.77;
        $("#bigImage")
            .css({
                top: cityBlock.offset().top + 50 - $(window).scrollTop(),
                left: cityBlock.offset().left + 100,
                height: 0,
                width: 0

            }).css("display", "block");


        $("#overlay").fadeIn(300, function () {

            $("#bigImage").stop()
                .animate({
                    top: 17,
                    left: 185,
                    width: width,
                    height: height,

                }, 1000);

        });


    });




    //                                                                Hover  Image Change

    cityBlock.hover(function () {

            var thisBlock = $(this), images = allCitiesContent[thisBlock.attr("id")][4];
            var img = thisBlock.attr("name");
            var index = images.indexOf(img);


            thisBlock.find(".cityCountryFlag").stop().effect("bounce",{distance:6}, 1000);

            thisBlock.find(".headerCityBlock ")
                .css("text-shadow",
                    " 0 0 1px #FFE003," +
                    " 0 0 2px #FFE306," +
                    " 0 0 3px #FFE609," +
                    " 0 0 4px #FFE90C," +
                    " 0 0 5px #FFEC0F," +
                    " 0 0 6px #FFEF12," +
                    " 0 0 7px #FFF215," +
                    " 0 0 8px #FFF518");

            thisBlock.find('.cityCountry').css("text-shadow",
                " 0 0 1px #0FE489," +
                " 0 0 2px #12E78C," +
                " 0 0 3px #15EA8F," +
                " 0 0 4px #18ED92," +
                " 0 0 5px #1BF095," +
                " 0 0 6px #1EF398," +
                " 0 0 7px #21F69B," +
                " 0 0 8px #24F99E");

            interval = setInterval(function () {

                if (index < images.length - 1) {
                    index++;
                }
                else {
                    index = 0;
                }

                thisBlock.find(".cityImage").stop()
                    .effect('fade', {mode: 'hide'}, 500);

                setTimeout(function () {
                    thisBlock.find(".cityImage")
                        .attr("src", "images/Cities/" + thisBlock.attr("id") + "/" + images[index])
                        .effect('fade', {mode: 'show'}, 450);

                }, 450);
                thisBlock.attr("name", images[index]);


            }, 2000);

        },
        function () {

            clearInterval(interval);

            $(this).find(".headerCityBlock ")
                .css("text-shadow", "none");

            $(this).find('.cityCountry')
                .css("text-shadow", "none");
        }
    );


    setDesktopSize();
    return cityBlock;
}

function setDesktopSize() {
    var desktop = $(".cityBlock").last().offset().top + 405;
    $("#desktop").height(desktop);

}


function checkPopulation(min, max) {
    return allCities.filter(function (city) {
        return allCitiesContent[city][1] > min && allCitiesContent[city][1] < max;
    });

}

function checkCountries(countries) {
    return allCities.filter(function (city) {
        return $.inArray(allCitiesContent[city][0].trim(), countries) != -1;
    });
}


function addByName(city) {

    if ($.inArray(city, allCities) == -1) {
        alert("Такого города нет в списке");
    }
    else {
        var activeCities = [];
        $(".cityBlock").each(function (i) {
            activeCities.push(this.id);
        });

        if ($.inArray(city, activeCities) != -1) {
            alert("Город уже добавлен");
        }
        else {
            createCityBlock(city);
        }
    }


}


function refreshCities(activeCities) {

    var timeout = 0;

    $('#desktop .cityBlock').each(function () {
        $(this).stop().hide("fade", 330, function () {
            $(this).remove();
        });
        timeout = 350;
    });

    setTimeout(function () {
        activeCities.forEach(function (item) {
            createCityBlock(item);
        });
    }, timeout);

}


function number_format(str) {
    return str.replace(/(\s)+/g, '').replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ');
}


$(function () {
    $(window).resize(function () {
        setDesktopSize();
        $(":animated").stop();
    })
});