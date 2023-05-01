let param = window.location.search;
let search = new URLSearchParams(param);
let clickedlink = search.get("ID");

let latLang = {lat: 60.22380020028506, lng: 24.758146965502707};
    

async function initMap() {    // kartta alustetaan, keskitetään helsinkiin ja zoomataan vähän
    const map = new google.maps.Map(document.getElementById("map"), {
        center: latLang,
        zoom: 10,
    });

const time = 3000; //asetetaan timeout arvo

setTimeout(() => {
    if (typeof window.globaali !== undefined) { // jos globaali ei ole asetettu, ehdotetaan ladata sivu uudelleen, muuten jatketaan
        console.log("jutut on asetettu!")
    } else {
        alert("hups, tietoja ei löytynyt. Kokeile ladata sivu uudelleen!");
    }

    const duunit = window.globaali; // duunit haetaan gloaalista muuttujasta
    const idt = window.idt;

    const infowindow = new google.maps.InfoWindow();     // alustetaan infowindowit

    for (let i = 0; i < duunit.length; i++) {   // looppi jossa luodaan markerit ja niille infoboxit
        if (typeof duunit[i][0] !== `undefined` && typeof duunit[i][1] !== `undefined` && typeof duunit[i][2] !== `undefined` && typeof duunit[i][3] !== `undefined` && typeof duunit[i][4] !== `undefined`) { // jos kaikkea dataa ei löydy, ei piirretä markeria
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(duunit[i][1]._lat, duunit[i][1]._long),   //luodaan uusi markkeri, jolle otetaan koordinaatit ja nimi "duunit"-arraysta
                map: map,
                title: duunit[i][0]
            });

            let tagitString = duunit[i][4].join(", "); // tagit laitetaan stringiin

            google.maps.event.addListener(marker, "click", (function(marker, i){    // markkereille laitetaan "click" listener, joka avaa infowindowin
                return function() {                    
                    infowindow.setContent("<h3><b>"+ duunit[i][0] +"</h3></p><p>"
                    + "<p>Palkka: " + duunit[i][3] + "€</p>"
                    + duunit[i][2] + "</p><p>"
                    + "Tagit: " + tagitString + "</p>"
                    + `<p><a href="index.html?scroll=${idt[i]}">linkki</a></p>`
                    ); // laatikon content = Header + palkka + kuvaus + tagit + linkki
                    infowindow.open(map, marker);
                }
            })(marker, i))
            // delete if open not done
            if (typeof clickedlink !== `undefined`) {
                if (clickedlink == idt[i]) {
                    infowindow.setContent("<h3><b>"+ duunit[i][0] +"</h3></p><p>"
                    + "<p>Palkka: " + duunit[i][3] + "€</p>"
                    + duunit[i][2] + "</p><p>"
                    + "Tagit: " + tagitString + "</p>"
                    + `<p><a href="index.html?scroll=${idt[i]}">linkki</a></p>`
                    ); // laatikon content = Header + palkka + kuvaus + tagit + linkki
                    infowindow.open(map, marker);
                }
            }
            //stop here
        }
    }
    }, time);
}
