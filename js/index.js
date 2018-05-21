var menuData = {
    "id": "menu",
    "template": "menu-item-template",
    "items": [
        {
            "name": "Popolazione e Società",
            "id": "PopSoc",
            "items": [
                { "name": "Cultura, istruzione, ricerca", "link": "#" },
                { "name": "Demografia", "link": "#" },
                { "name": "Difesa", "link": "#" }
            ]
        },
        {
            "name": "Economia",
            "id": "Eco",
            "items": [
                { "name": "Dati generali", "link": "#" },
                { "name": "Lavoro", "link": "#" },
                { "name": "Turismo", "link": "#" }
            ]
        },
        {
            "name": "Agricoltura, allevamento, pesca",
            "id": "AgrAllPes",
            "items": [
                { "name": "Allevamento bestiamo e prodotti derivati", "link": "#" },
                { "name": "Cereali", "link": "#" },
                { "name": "Foresta e pesca", "link": "#" }
            ]
        },
        {
            "name": "Industria",
            "id": "Ind",
            "items": [
                { "name": "Industria alimentare e del tabacco", "link": "#" },
                { "name": "Industria chimica, petrolchimica e del cemento", "link": "#" },
                { "name": "Industria del legno, mobili e carta  ", "link": "#" }
            ]
        },
        {
            "name": "Energia e minerali",
            "id": "EnMin",
            "items": [
                { "name": "Energia elettrica", "link": "#" },
                { "name": "Minerali energetici", "link": "#" },
                { "name": "Minerali metalliferi", "link": "#" }
            ]
        }
    ]
};

$(function() {

    /* Menu principale */
    var menuHbs = $("#"+menuData.template).html(),
        menuTpl = Handlebars.compile(menuHbs);
    menuData.items.forEach(function(item) {
        $("#"+menuData.id).append(menuTpl(item));
    });

});