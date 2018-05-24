/* Tutto il codice viene eseguito solo dopo che l'intera pagina è stata caricata */
$(function() {

    /* Menu principale costruito mediante handlebarsjs a partire da un json esterno */
    $.getJSON(
        "./data/menu.json",
        function(menuData) { // Funzione di callback con il contenuto del json
            var menuHbs = $("#"+menuData.template).html(), // Leggo il template sotto forma di stringa
                menuTpl = Handlebars.compile(menuHbs); // Lo compilo (menuTpl è una funzione)
            menuData.items.forEach(function(item) { // Per ogni elemento (bottone) del menu
                $("#"+menuData.id).append(menuTpl(item)); // Creo un elemento del menu
            });
        }
    );

    /* Inizializzo la mappa con leafletjs */
    var map = L.map('map-container').setView([51.505, -0.09], 2);

    /** Tile di sfondo offerta da openstreetmap **/
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    /* Carico i dati del PIL per paese */
    $.getJSON(
        "./data/listaRANK_100077_2018.json",
        function(geoData) { // Funzione di callback con il contenuto del json

            // Calcolo il valore massimo del PIL tra tutti i paesi, trasformando opportunamente la stringa originale in un numero intero
            var maxValue = Math.max.apply(
                null,
                geoData.lista.map(function(el) { // Ritorna un array di numeri interi (i PIL di tutti i paesi)
                    return +el.valore.replace(/ /g,"");
                })
            );

            // Definisco la funzione che calcolerà lo stile per ogni paese
            var geoLayerStyle = function(feature) { // In feature c'è l'oggetto che rappresenta un paese sulla mappa

                var geoCountry = feature.properties,
                    geoISO = geoCountry.iso_a3,
                    /* Da una parte ho il paese corrente di cui calcolare lo stile,
                       dall'altra ho la lista di tutti i paesi con i PIL corrispondenti.
                       Qui devo filtrare il paese giusto dalla lista e lo faccio cercando il codice ISO
                       l'identificativo univoco che lo rappresenta
                    */
                    dataCountries = geoData.lista.filter(function(el) {
                        return el.iso === geoISO;
                    });
                
                // Verifico che il paese corrente esista nella lista di dati che ho...
                if (dataCountries.length > 0) {
                    var absValue = +dataCountries[0].valore.replace(/ /g,""),
                        relValue = absValue / maxValue; // Valore relativo rispetto al PIL massimo

                    return {
                        stroke: true,
                        fill: true,
                        color: '#000',
                        fillColor: getColor(relValue), // Funzione che ritorna il colore del riempimento in base al valore del PIL
                        fillOpacity: 0.5
                    };

                // Se di questo paese non ho i dati torno uno stile predefinito
                } else {

                    return {
                        stroke: true,
                        color: '#000'
                    };

                }
            };

            /** Confini nazionali del mondo generati e scaricati da https://geojson-maps.ash.ms/ **/
            /* Per caricarli da file ho usato un plugin di Leaflet: https://github.com/calvinmetcalf/leaflet-ajax */
            var geoLayer = L.geoJSON.ajax(
                "./geo/world.json",
                {
                    style: geoLayerStyle // Lo stile è ritornato da una funzione a cui viene passato il singolo paese
                }
            )
            .bindTooltip(function (e) { // Tooltip on mouseover con nome e valore del PIL

                /* Nel tooltip voglio mettere il nome del paese, ma anche il valore del PIL,
                   per cui devo identificare il paese anche nella lista dei miei dati in base al codice ISO
                   (esattamente come fatto prima)
                */
                var geoCountry = e.feature.properties,
                    geoISO = geoCountry.iso_a3,
                    dataCountries = geoData.lista.filter(function(el) { return el.iso === geoISO; });
                
                // Nel tooltip apparirà "Nome paese: valore PIL" o "Nome paese: N.A." se non disponibile
                return e.feature.properties.name + ": " + (dataCountries.length ? dataCountries[0].valore : "N.A.") + " mln $";

            })
            .addTo(map);

        }
    );

});

function getColor(value) {

    if (value > 0.9) {
        return '#800026';
    } else if (value > 0.4) {
        return '#BD0026';
    } else if (value > 0.1) {
        return '#E31A1C';
    } else if (value > 0.005) {
        return '#FC4E2A';
    } else {
        return '#FFEDA0';
    }

}