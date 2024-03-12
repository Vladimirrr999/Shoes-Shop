console.log("Hello");
function ajaxCallback(fajl, callback){
    $.ajax({
        url: fajl,
        method: "get",
        dataType: "json",
        success: function(niz){
            callback(niz);
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
}
$.ajax({
    url: "meni.json",
    method: "get",
    dataType: "json",
    success: function(niz){
        ispisNavigacije(niz);
    },
    error: function(xhr){
        console.log(xhr);
    }
})
window.onload = function(){
    ajaxCallback("proizvodi.json", function(niz){
        prikaziProizvode(niz);
    })
}
function dohvatiBrendProizvoda(id){
    return dohvatiBrendProizvoda.filter(b=>b.id == id)[0].naziv;
}
/*<h6>${dohvatiBrendProizvoda(proizvod.brend)}</h6>
   <p class="card-text">${dohvatiKategorijeProizvoda(proizvod.kategorije)}</p> */ 
function prikaziProizvode(podaci){
    let sadrzajZaIspis = "";
    for (let i = 0; i < podaci.length; i++) {
        let proizvod = podaci[i];
        sadrzajZaIspis += `<div class="col-lg-4 col-md-6 mb-4"><div class="card h-100">
                           <a href="#"><img class="card-img-top" src="${proizvod.slika.src}" alt="${proizvod.slika.alt}"></a>
                           <div class="card-body">
                           <h4 class="card-title"><a href="#">${proizvod.naziv}</a></h4>

                           <h5>$${proizvod.cena.trenutna}</h5>
                           ${proizvod.cena.prePopusta ? "<s>$" + proizvod.cena.prePopusta + "</s>": ""}
                           <p style="color:blue">${proizvod.besplatnaDostava ? "Besplatna dostava" : ""}</p>
    
                           <p class="card-text"> ${proizvod.opis}</p>
                           </div></div></div>`;
    }
    document.getElementById("proizvodi").innerHTML = sadrzajZaIspis;
}

function ispisNavigacije(arr){
    let sadrzajZaIspis = "";

    for(let obj of arr){
        sadrzajZaIspis += `<ul class="nav justify-content-center"><li class="nav-item"><a class="nav-link" aria-current = "page"
                                                 href="${obj.href}">${obj.tekst}</a></li></ul>`
    }
    $("#navigacija").html(sadrzajZaIspis);
}