var $ = Dom7;
var app = new Framework7({
    name: 'My App Name',
    id: 'com.myapp',
    root: '#app',
    theme: 'ios',
    dialog: {
        title: 'Alert'
    },
    routes: routes
});

var mainView = app.views.create('.view-main', {
    url: '/',
    iosDynamicNavbar: false,
    xhrCache: true
});

function pagex(x, y) {
    app.router.navigate('/' + x + '/', {
        animate: (y) ? false : true
    });
}

function notify(txt) {
    var notifier = app.notification.create({
        icon: '<i class="f14 picons-thin-icon-thin-0316_email_mail_post_open"></i>',
        title: 'Notification',
        titleRightText: 'now',
        subtitle: 'An error report',
        text: txt,
        closeTimeout: 3000
    });
    notifier.open();
}