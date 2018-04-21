// Leave this standard configuration codes
var back;
var page;
var panel = false;
var popover = false;
var popup = false;
var dialog = false;

$(document).on('panel:open', function(e, data) {
    panel = true;
});

$(document).on('panel:close', function(e, data) {
    panel = false;
});

$(document).on('popover:open', function(e, data) {
    popover = true;
});

$(document).on('popover:close', function(e, data) {
    popover = false;
});

$(document).on('popup:open', function(e, data) {
    popup = true;
});

$(document).on('popup:close', function(e, data) {
    popup = false;
});

$(document).on('dialog:opened', function(e, data) {
    dialog = true;
});

$(document).on('dialog:close', function(e, data) {
    dialog = false;
});

function keydown() {
    if (popover) {
        app.popover.close();
    } else if (popup) {
        app.popup.close();
    } else if (panel) {
        app.panel.close();
    } else if (dialog) {
        app.dialog.close();
    } else {
        app.router.back();
    }
}

function OpenMenu() {
    if (panel) {
        app.closePanel();
    } else {
        app.openPanel('left');
    }
}

function closeMenu() {
    app.closePanel();
}


var map;
var infowindow;

function initMap(a, b) {
    var pyrmont = {
        lat: a,
        lng: b
    };

    map = new google.maps.Map(document.getElementById("map"), {
        center: pyrmont,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 2500,
        type: [$('body').attr('data-type')]
    }, search_callback);
}

function search_callback(results, status) {
    //app.dialog.close();
    if (results.length < 1) {
        app.dialog.create({
            title: 'Oops!!',
            text: 'Could not locate any closer to you',
            buttons: [{
                text: 'ok',
            }],
            onClick: function() {
                app.router.back();
            },
            verticalButtons: false
        }).open();
    } else {

        var len = results.length;
        var name = $('body').attr('data-name');

        var mytext;
        if (len > 1) {
            mytext = "Found " + len + " " + name + " Close to you";
        } else {
            var cut = name.substring(0, name.length - 1);
            mytext = "Found " + len + " " + cut + " Close to you";
        }


        app.toast.create({
            text: mytext,
            closeTimeout: 4000,
        }).open();

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }

    }

}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function setType(e) {
    var type = $(e).attr('data-name');
    var name = $(e).find('.item-title').text();

    $('body').attr('data-type', type);
    $('body').attr('data-name', name);
    //app.dialog.progress();
}


function gpsFailed() {
    //app.dialog.close();
    app.dialog.create({
        title: 'Could not locate',
        text: 'Please turn on your <b>GPS</b> for better app performance',
        buttons: [{
            text: '<b>Turn On</b>',
        }],
        onClick: function() {
            app.router.back();
        },
        verticalButtons: false
    }).open();
}

function EnableLocation() {
    //app.dialog.close();
    try {
        cordova.plugins.locationAccuracy.request(function() {
            //app.dialog.progress();
            getCurrentLocation();
        }, function() {
            gpsFailed();
        }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    } catch (e) {
        gpsFailed();
    }

}


function gpsGotten(pos) {
    initMap(pos.coords.latitude, pos.coords.longitude);
}

function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(gpsGotten, EnableLocation, {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
    });
}

$(document).on('page:init', function(e, data) {
    page = e.detail.route.name;
    switch (page) {
        case 'Dashboard':
            getCurrentLocation();
            break;
        default:

    }
});