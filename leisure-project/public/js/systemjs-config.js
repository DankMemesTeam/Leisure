/* globals SystemJS */

SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        main: '/js/main.js',
        'plugin-babel': '/js/libs/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': '/js/libs/systemjs-plugin-babel/systemjs-babel-browser.js',
        register: '/js/auth/register.js',
        'validator-module': '/js/validation/validator.js',
        jquery: 'https://code.jquery.com/jquery-3.2.1.min.js',
        validator: 'https://cdnjs.cloudflare.com/ajax/libs/validator/8.0.0/validator.min.js',
        materialize: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.1/js/materialize.min.js',
        toastr: 'http://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min.js',
    },
});

