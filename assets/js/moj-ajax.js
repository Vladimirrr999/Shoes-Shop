const BASEURL = "assets/data/";
var url = window.location.pathname;
var greske = 0;
function ajaxIspis(putanjaDoFajla, rezultat){
    $.ajax({ 
        url: BASEURL + putanjaDoFajla,
        method: "get",
        dataType: "json",
        success: rezultat,
        error: function(xhr,ex){
            var msg = '';
            if(xhr.status === 0){
                msg = 'Not connected.\n Check your network.';
            }
            else if(xhr.status === 400){
                msg = 'Bad Request.\n The request cannot be fulfilled due to bad syntax.';
            }else if(xhr.status === 408){
                msg = 'Request Timeout. \n The server timed out waiting for the request.';
            }else if(xhr.status === 403){
                msg = 'Forbidden. \n The request was a legal request, but the server is refusing to respond to it';
            }else if(xhr.status === 404){
                msg = 'Not Found. \n The request page could not be found.';
            }else if(xhr.status === 415){
                msg = 'Unsupported Media Type. \n The server will not accept the request, because the media type is not supported ';
            }else if(xhr.status === 500){
                msg = 'Internal Server Error. \n A generic error message, given when no more specific message is suitable';
            }else if(xhr.status === 503){
                msg = 'Service Unavailable. \n The server is currently unavailable (overloaded or down)';
            }else if(xhr.status === 505){
                msg = 'HTTP Version Not Supported \n The server does not support the HTTP protocol version used in the request'; 
            }else 
            msg = 'Uncaught Error. \n' + xhr.responseText;
            ex(msg);
        }
    })
}
$(window).on('load', function() {
    $('#loader').fadeOut(1500);
    $('#preloader').delay(1500).fadeOut(500);
  });
  
  setTimeout(function(){
    $('body').removeClass('fade-out');
  }, 5000);
  
$(document).ready(function() {
    brojProizvoda();
    $("#in").val("600");
        $(window).scroll(function() {
          if ($(this).scrollTop() > 100) {
            $('.scroll-to-top').fadeIn();
          } else {
            $('.scroll-to-top').fadeOut();
          }
        });
      
        $('.scroll-to-top').click(function() {
          $('html, body').animate({scrollTop : 0},800);
          return false;
        });
      

    ajaxIspis("ikone-footer.json", function(rezultat){
        ispisIkonicaFooter(rezultat);
    });
    ajaxIspis("nav-meni.json", function(rezultat){
        ispisNavigacije(rezultat);
    });
    if(url == "/" || url == "/index.html"){
        
        ajaxIspis("patike.json", function(rezultat){
            ispisBlokovaPatikaIndeksStrane(rezultat);
        });
        ajaxIspis("feature-prikaz-patika.json", function(rezultat){
            ispisFeatureSekcije(rezultat);
        });
        ajaxIspis("recenzije.json", function(rezultat){
            ispisRecenzija(rezultat);
        });
        document.getElementById("clickBtn").addEventListener("click",proveriMejl);
    }
    if(url == "/shop.html"){
        brojProizvoda();
        ajaxIspis("patike.json", function(rezultat){
            ispisShopa(rezultat);
            sacuvajLokalStorage("svePatike", rezultat);
            naziviPatika(rezultat);
        });
        ajaxIspis("brendovi.json", function(rezultat){
            padajucaLista(rezultat, "model", "Brand", "blok-brend");
        });
        ajaxIspis("velicine.json", function(rezultat){
            padajucaLista(rezultat,  "velicina", "Size", "vel");
            sacuvajLokalStorage("dropDownVelicineForma", rezultat);
        });
        ajaxIspis("pol.json", function(rezultat){
            padajucaLista(rezultat, "tip", "For", "pol");
        });
        ajaxIspis("sort.json", function(rezultat){
            padajucaLista(rezultat, "sort", "Order by", "sortiraj");
        });
        ajaxIspis("popusti.json" ,function(rezultat){
            sacuvajLokalStorage("popusti", rezultat );
        })
        $(document).on("change", "#model", promeni);
        $(document).on("change", "#velicina", promeni);
        $(document).on("change", "#tip", promeni);
        $(document).on("change", "#sort", promeni);
        $("#search").on("input", promeni);
        $("#in").on("input", promeni);

    }
    if(url == "/author.html"){
        $("#autor").hide().delay(100).slideDown(1500);

    }
    if(url == "/contact.html"){
        var dropVelicine = uzmiIzLocalStorage("dropDownVelicineForma");
        padajucaLista(dropVelicine, "velicine", "Size", "ispis-dropVelicina");
        var dropModel = uzmiIzLocalStorage("naziviPatika");
        padajucaLista(dropModel, "modeli", "Model", "ispis-dropModel");

        document.querySelector("#Posalji").addEventListener("click", obradaForme);
    }
    if(url == "/cart.html"){
        prikaziProdukte();
        potvrdiPorudzbinu();
    }
});
$("#kliknuto").click(resetujStranicu);
function prikazPoruke(){
    let dugme = document.getElementById("potvrda");
    dugme.parentElement.nextElementSibling.classList.remove("sakrij");
    $("#pot-p").html("Your order has been confirmed. Please wait while we proccess it.").fadeIn();
    setTimeout(function() {
        $("#pot-p").fadeOut();
    }, 2000);
}
function proveriMejl(){
    greske = 0;
  var vrednostInputa = document.getElementById("proveri");
  console.log(vrednostInputa);
  regEmail = /^([a-zzšđčćž]{3,20}(\.)?[0-9]*)+(([a-z]*[0-9]*)(\.)?)+\@((gmail|yahoo|ict.edu|outlook)(.rs|.com))$/;
  if(!regEmail.test(vrednostInputa.value)){
    vrednostInputa.parentElement.nextElementSibling.classList.remove("sakrij");
    vrednostInputa.classList.add("jaca");
    vrednostInputa.parentElement.nextElementSibling.innerHTML = "Incorrect mail. Try: peraperic125@gmail.com";
    greske++;
  }
  else{
    vrednostInputa.parentElement.nextElementSibling.classList.add("sakrij");
    vrednostInputa.classList.remove("jaca");
    vrednostInputa.parentElement.nextElementSibling.innerHTML = "";
  }
  console.log(greske);
  if(greske == 0){
    document.getElementById("sve-ok").innerHTML = "<p class='alert alert-success' id='visina-taga'>Succefully sent!</p>";
  }
}  
function resetujStranicu() {
  $("#model").val("0");
  $("#velicina").val("0");
  $("#tip").val("0");
  $("#search").val("");
  $("#in").val("600");
  $("#rangeValue").text("0 $");
  kliknuto = false;
  promeni();
}
function potvrdiPorudzbinu(){
    var potvrdaBtn = document.getElementById("potvrda");
    if (potvrdaBtn !== null) {
      potvrdaBtn.addEventListener("click", prikazPoruke);
    }
}
let kliknuto = false;
$("#klik").click(function() {
  kliknuto = !kliknuto;
  promeni();
});
function naziviPatika(arr){
    const niz = arr;
    const podaci = niz.map(x => ({ id: x.id, naziv: x.naziv }));
    sacuvajLokalStorage("naziviPatika", podaci);
}
function promeni(){
    $("#product").hide().delay(100).slideDown(500);
    let svePatike = uzmiIzLocalStorage("svePatike");
    svePatike = filtriraj(svePatike, "brend");
    svePatike = filtriraj(svePatike, "size");
    svePatike = filtriraj(svePatike, "for");
    svePatike = filtriraj(svePatike, "klik");
    svePatike = filtrirajPoUnetimKarakterima(svePatike);
    svePatike = filtrirajPoInputRange(svePatike);
    svePatike =sortiraj(svePatike);
    if (svePatike.length === uzmiIzLocalStorage("svePatike").length) {
        $("#kliknuto").hide();
    } else {
        $("#kliknuto").show();
    }
    ispisShopa(svePatike);
}
function filtriraj(nizPatika, tipFiltera) {
    let filtriranePatike = [];
    let dohvaceniId = null;
    let callback = null;
  
    switch (tipFiltera) {
        case "brend":
            dohvaceniId = $("#model").val();
            callback = proizvod => proizvod.brendId === parseInt(dohvaceniId);
          break;
        case "size":
            dohvaceniId = $("#velicina").val();
            callback = proizvod => proizvod.velicine.includes(parseInt(dohvaceniId));
          break;
        case "for":
            dohvaceniId = $("#tip").val();
            callback = proizvod => proizvod.polId === parseInt(dohvaceniId);
          break;
          case "klik":
            if (kliknuto) {
                document.getElementById("klik").innerHTML = `<p class="popust-tag">Ukloni filter popusta X`;
                let callbacks = [];
                let popusti = [1, 2, 3, 4, 5];
                for (let i = 0; i < popusti.length; i++) {
                callback = proizvod => proizvod.popustId === parseInt(popusti[i]);
                callbacks.push(callback);
                }
                callback = callbacks.reduce((acc, callback) => {
                return function(proizvod) {
                    return acc(proizvod) || callback(proizvod);
                };
                });
            } else {
                callback = proizvod => true;
                document.getElementById("klik").innerHTML = `<a href="#" id="klik"><i class="fa fa-solid fa-tag"></i>
                                                                <p class="popust-tag">On discount</p></a>`;
            }
            break;
        default:
          break;
    }
    if (dohvaceniId !== "0") {
        filtriranePatike = nizPatika.filter(callback);
    } else {
        filtriranePatike = nizPatika;
    } 
    return filtriranePatike;
}
function filtrirajPoUnetimKarakterima(arr){
    let unete = $("#search").val();
    var noviNiz = arr.filter((x) => (x.naziv.toLowerCase().includes(unete.toLowerCase())));
    return noviNiz;
}
function filtrirajPoInputRange(arr){
    let input = $("#in").val();
    $('#in').change(function() {
        $('#rangeValue').text($(this).val() + " $");
      });
    let niz = arr.filter(el => el.cena.novaCena <= input);
    if(input == "600"){
        niz = arr;
    }
    if(input == "0"){
        $("#product").html(`<div class="row">
                                <div class="col-12">
                                    <p class="alert alert-danger" style="font-size:25px;">We dont have currently certain criteria. Contact us</p>
                                </div>
                            </div>`);
    }
    return niz;
}
function sortiraj(arr) {

    let izabranaVrednost =  $("#sort").val();

    switch (izabranaVrednost) {
      case "1":
        return arr.sort((a, b) => b.cena.novaCena - a.cena.novaCena);
      case "2":
        return arr.sort((a, b) => a.cena.novaCena - b.cena.novaCena);
      case "3":
        return arr.sort((a, b) => a.naziv.localeCompare(b.naziv));
      case "4":
        return arr.sort((a, b) => b.naziv.localeCompare(a.naziv));
      case "5":
        return arr.sort((a, b) => new Date(b.godinaDodavanja) - new Date(a.godinaDodavanja));
      case "6":
        return arr.sort((a, b) => new Date(a.godinaDodavanja) - new Date(b.godinaDodavanja));
      default:
        return arr;
    }
  }
function ispisNavigacije(niz){
    let html = "";
    for(let obj of niz){
        html += `
        <a class="nav-link" href="${obj.href}">${obj.naziv}</a>`
    }
    $("#ispis").html(html);
}
function ispisBlokovaPatikaIndeksStrane(niz){
    var elementNizaSedam = 6;
    var isecenNiz = niz.slice(0, elementNizaSedam);
    let ispisMain = "";
    for(let obj of isecenNiz){
        ispisMain += `<div class="box">
                        <div class="popust">
                            <h4>New</h4>
                        </div>
                        <div class="icons">
                        </div>
                        <div class="content">
                            <img src="${obj.slika}" alt="${obj.naziv}">
                            <h3>${obj.naziv}</h3>
                            <div class="price">${obj.cena.novaCena}&euro; <span></span></div>
                            <div class="stars">
                             ${ispisZvezdica(obj)}
                            </div>
                        </div>
                    </div>`
    };
    document.getElementById("prikaz").innerHTML = ispisMain;
    $("#prikaz .box").hide().delay(1500).show(1500);
}
function ispisShopa(arr){
    let nizPopusti = uzmiIzLocalStorage("popusti");
    let ispis = "";
    if(!Array.isArray(arr) || arr.length === 0){
        ispis += `<div class="row">
        <div class="col-12">
            <p class="alert alert-danger" style="font-size:25px;">We dont have currently certain criteria. Contact us</p>
        </div>
        </div>`;
        $("#product").hide().delay(100).slideDown(500);
    }
    else{
        for(objPatika of arr){
            ispis += `<div class="box">
                    <div>
                        <h4>${popusti(objPatika.popustId, nizPopusti)}</h4>
                    </div>
                <div class="icons">

                </div>
                <div class="content">
                    <img src="${objPatika.slika}" alt="${objPatika.naziv}">
                    <h3>${objPatika.naziv}</h3>
                    <div class="price">${objPatika.cena.novaCena}&euro; <span>${ispisZnakaValute(objPatika.cena.staraCena)}</span></div>
                    <div class="stars">
                        ${ispisZvezdica(objPatika)}
                    </div>
                <div class="cart">
                    <a class="add-to-cart" data-id = ${objPatika.id}>
                        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </div>`;
        }
    }
    document.getElementById("product").innerHTML = ispis;
    $("#product").hide().delay(100).slideDown(500);
    $(".add-to-cart").click(dodajUKorpu);
}
function ispisZnakaValute(obj){
    let valuta = "";
    if(obj != null){
        valuta += `${obj}&euro;`
    }
    return valuta;
}
function ispisZvezdica(indeks){
    let zvezda = "";
    for(let i = 0; i < indeks.zvezdice.broj; i++) {
        zvezda += `<i class="fa fa-star"></i>`;
    } 
    return zvezda;
}
function padajucaLista(niz, listaId, labela, IdDiv){
    let ispisDdl = `<div class="form-group">
                        <label>${labela}</label>
                        <select class="form-control drop" id="${listaId}">
                            <option value="0">Choose..</option>`
                            for(let obj of niz){      
                                ispisDdl += `<option value="${obj.id}">${obj.naziv}</option>`
                                }        
            ispisDdl += `</select>
                    </div>`;
   document.querySelector(`#${IdDiv}`).innerHTML = ispisDdl;
}
function ispisIkonicaFooter(arr){
    let footer = arr.map(x => `<a href="${x.href}" target=_blank>${x.naziv}</a>`).join('');
    document.querySelector("#mojeIkone").innerHTML = footer;
}
function ispisFeatureSekcije(niz) {
    let ispis = "";
    ispis = `<h1 class="heading">${niz.naslov} <span>${niz.obojeniDeoNaslova}</span></h1>
              <div class="row">
                  <div class="image-container">
                      <div class="small-image">
                          ${ispisNizaSlika(niz.slika)}
                      </div>
                      <div class="big-image">
                          <img src="${niz.velikaSlika}" alt="${niz.naslov + niz.obojeniDeoNaslova}" class="big-image-1" id="velika">
                      </div>
                  </div>
                  <div class="content">
                      <h3>${niz.sadrzaj}</h3>
                      <div class="stars">
                          ${ispisZvezdica(niz)}
                      </div>
                      <p>${niz.tekst}</p>
                      <div class="price">${niz.cena}&euro;</div>
                      <a href="shop.html" class="btn">Shop Now</a>
                  </div>
              </div>`
    $("#fearured").html(ispis).hide().delay(2500).show(2000);
}
function ispisNizaSlika(niz) {
    let ispis = "";
    for (let slika of niz) {
      ispis += `<img src="${slika.src}" alt="${slika.alt}" class="small-image" onclick="promeniSliku(this)">`;
    }
    return ispis;
}
function promeniSliku(slika) {
    document.getElementById("velika").src = slika.src;
}
function ispisRecenzija(arr){
    let recenzije = "";
        arr.forEach(x => {
        recenzije +=`<div class="box">
                    <img src="${x.slika}" alt="${x.ime}">
                    <h3>${x.ime}</h3>
                    <p>${x.tekst} </p>
                    <div class="stars">
                    ${ispisZvezdica(x)}
                    </div>
                </div>`
    })
    $("#ispisRec").html(recenzije).hide().delay(4000).show(2500);
}
function sacuvajLokalStorage(ime, vrednost){
    localStorage.setItem(ime, JSON.stringify(vrednost));
}
function uzmiIzLocalStorage(ime){
    return JSON.parse(localStorage.getItem(ime));
}
function popusti(id, niz){
    let ispisPopusta = "";
    let objPopust = null;

    if(Array.isArray(niz)){  // add this check
        if( id != null){
            for(let obj of niz){
                if(obj.id == id){
                    objPopust = obj;
                }
            }
            ispisPopusta += `<div class="${objPopust.klasa}">
                                <h4>${objPopust.iznos}</h4>
                            </div>`
        }
    }
    return ispisPopusta;
}
function obradaForme(){

    greske = 0;
    let ime, prezime, email, velicina, model, notifikacije, politikaKoriscenja;
    ime = document.getElementById("ime");
    prezime = document.getElementById("prezime");
    email = document.getElementById("mejl");
    model = document.getElementById("modeli");
    velicina = document.getElementById("velicine");
    notifikacije = document.getElementsByName("rb1");
    politikaKoriscenja = document.getElementsByName("chbTerms");
    
    let cekiraniRadio = "";
    for(let i=0;i<notifikacije.length;i++){
        if(notifikacije[i].checked){
            cekiraniRadio = notifikacije[i].value;
            break;
        }
    }
    let cekiraniCheckBox = "";
    for(let i=0; i<politikaKoriscenja.length;i++){
        if(politikaKoriscenja[i].checked){
            cekiraniCheckBox += politikaKoriscenja[i].value;
        }
    }
    proveriCekiranePodatke(cekiraniRadio, notifikacije, "You must choose Yes or no.");
    proveriCekiranePodatke(cekiraniCheckBox, politikaKoriscenja, "You must agree with our terms of use.");

    let regImePrezime, regEmail;
    regImePrezime = /^([A-Z][a-z]{2,15}\s?)+$/;
    regEmail = /^([a-zzšđčćž]{3,20}(\.)?[0-9]*)+(([a-z]*[0-9]*)(\.)?)+\@((gmail|yahoo|ict.edu|outlook)(.rs|.com))$/;

    obradaDropDownListi(velicina, "Choose the size u want.");
    obradaDropDownListi(model, "Choose the model you are interested in.");
    
    blurDogadjaj(ime, regImePrezime, "Incorrect format. Try something like: Vladimir..");
    blurDogadjaj(prezime, regImePrezime, "Invalid format. Try something like: Lobanov, Peric..");
    blurDogadjaj(email, regEmail, "Invalid email format.Example: vladimir.lobanov@gmail.com");
    blurDogadjajZaDropDownListu(velicina, "Choose the size u want.");
    blurDogadjajZaDropDownListu(model, "Choose the model you are interested in.");

    proveriPodatke(regImePrezime, ime, "Incorrect format. Try something like: Vladimir..");
    proveriPodatke(regImePrezime, prezime, "Invalid format. Try something like: Lobanov, Peric..");
    proveriPodatke(regEmail, email, "Invalid email format.Example: vladimir.lobanov@gmail.com");

function blurDogadjaj(tipPolja,reg, msg){
    tipPolja.addEventListener("blur", function() {
        proveriPodatke(reg, tipPolja, msg);
        if (tipPolja.classList.contains("zelena")) {
            tipPolja.classList.add("zelena");
        }
    });
}
function blurDogadjajZaDropDownListu(tipDdl, por){
    tipDdl.addEventListener("blur", function() {
        obradaDropDownListi(tipDdl, por);
      });
}
    if(greske == 0){
        document.getElementById("ispis-forme").innerHTML = "<p class='alert alert-success' id='visina-taga'>Succefully sent!</p>";
    }
    else{
        document.getElementById("ispis-forme").innerHTML = "";
    }
}
function proveriPodatke(regularni, polje, porukaGreske){
    if(!regularni.test(polje.value)){
        polje.nextElementSibling.classList.remove("sakrij");
        polje.nextElementSibling.innerHTML = porukaGreske;
        polje.classList.add("crvena");
        polje.classList.remove("zelena");
        greske++;
    }
    else{
        polje.nextElementSibling.classList.add("sakrij");
        polje.nextElementSibling.innerHTML = "";
        polje.classList.remove("crvena");
        polje.classList.add("zelena");
    }
}
function obradaDropDownListi(tipDdl, poruka){
    var izabraniOption = tipDdl.options[tipDdl.selectedIndex].value;
    if(izabraniOption == "0"){
        tipDdl.parentElement.parentElement.nextElementSibling.classList.remove("sakrij");
        tipDdl.parentElement.parentElement.nextElementSibling.innerHTML = poruka;
        tipDdl.classList.add("crvena");
        tipDdl.classList.remove("zelena");
        greske++;
    }
    else{
        tipDdl.parentElement.parentElement.nextElementSibling.classList.remove("crvena");
        tipDdl.parentElement.parentElement.nextElementSibling.innerHTML = "";
        tipDdl.classList.remove("crvena");
        tipDdl.classList.add("zelena");
        tipDdl.parentElement.parentElement.nextElementSibling.classList.add("sakrij");
    }
}
function proveriCekiranePodatke(tipPolja, arr, por){
    if(tipPolja == "" || tipPolja == "accepted policy" || tipPolja == "accepted terms"){
        arr[0].parentElement.nextElementSibling.nextElementSibling.classList.remove("sakrij");
        arr[0].parentElement.nextElementSibling.nextElementSibling.innerHTML = por;
        greske++;
    }
    else{
        arr[0].parentElement.nextElementSibling.nextElementSibling.classList.add("sakrij");
        arr[0].parentElement.nextElementSibling.nextElementSibling.innerHTML = "";
    }
}
function prikaziProdukte() {
    const productsCart = uzmiIzLocalStorage("cart");
  
    if (!productsCart || !productsCart.length) {
      praznaKorpa();
      return;
    }
    productsCart.forEach((product) => {
      stampanjeKorpe();
    });
}
function praznaKorpa(){
    $("#sadrzaj").html(`<p>No selected products.</p>`);
    $("#suma").html("");
    $("#potvrdi").html("");
}
function stampanjeKorpe() {
    let allProducts = uzmiIzLocalStorage("svePatike");
    let cartProducts = uzmiIzLocalStorage("cart");
    let cartItems = [];
    for (let i = 0; i < allProducts.length; i++) {
      let product = allProducts[i];
      for (let j = 0; j < cartProducts.length; j++) {
        let cartProduct = cartProducts[j];
        if (product.id == cartProduct.id) {
          product.kolicina = cartProduct.kolicina;
          cartItems.push(product);
        }
      }
    }
    stampanjeTabele(cartItems);
}  
function stampanjeTabele(products) {
    let html = `
      <table class="timetable_sub">
        <thead>
          <tr>
            <th>Product</th>
            <th>Product Name</th>
            <th>Base Price</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr class="rem1">
              <td class="invert-image">
                <a href="#">
                  <img src="${p.slika}" style="height:100px" alt="${p.slika}" class="img-responsive">
                </a>
              </td>
              <td class="invert-name">${p.naziv}</td>
              <td class="invert-price">$${p.cena.novaCena}</td>
              <td class="invert">
                <a href="#" class="smanjiKolicinu ${p.kolicina === 1 ? 'disabled' : ''}" data-id="${p.id}">-</a>
                ${p.kolicina}
                <a href="#" class="povecajKolicinu" data-id="${p.id}">+</a>
              </td>
              <td class="invert">$${p.cena.novaCena * p.kolicina}</td>
              <td class="invert">
                <div class="rem">
                  <div class="">
                    <button class="btn-remove" data-id="${p.id}">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    let suma = products.reduce((total, p) => total + p.cena.novaCena * p.kolicina, 0);
    suma = Math.round(suma * 100) / 100;
  
    $("#sadrzaj").html(html);
    $(".btn-remove").click(ukloniIzKorpe);
    $(".smanjiKolicinu").click(smanjiKolicinu);
    $(".povecajKolicinu").click(povecajKolicinu);
    $("#suma").html(`<strong>Total price: $${suma}</strong>`);
    $("#potvrdi").html(`<input type="button" name="potv" id="potvrda" value="Confirm your order" />`);
} 
function ukloniIzKorpe(){
    let kliknutiProizvodZaUklanjanje = $(this).data("id");
    let proizvodiIzKorpe = uzmiIzLocalStorage("cart");
    let filtriraniProizvodi = proizvodiIzKorpe.filter(x => x.id != kliknutiProizvodZaUklanjanje);
    if(filtriraniProizvodi.length == 0){
        localStorage.removeItem("cart");
    }
    else{
        sacuvajLokalStorage("cart", filtriraniProizvodi);
    }
    prikaziProdukte();
    brojProizvoda();
    potvrdiPorudzbinu();
}
function dodajUKorpu(){
    let idPatike = $(this).data("id");  
    let proizvodiIzKorpe = uzmiIzLocalStorage("cart");
  
    $("#message").html("Succefully added to cart!").fadeIn();
    setTimeout(function() {
        $("#message").fadeOut();
    }, 1000);
    
    if(proizvodiIzKorpe == null){
        dodajPrviProizvodUKorpu();
        brojProizvoda();
    }
    else{
        if(proizvodJeUKorpi()){
            azurirajKolicinu();
        }
        else{
            dodajProizvodUKorpu();
            brojProizvoda();
        }
    }
    function dodajPrviProizvodUKorpu(){
        let products = [
            {
                id: idPatike,
                kolicina: 1
            }
        ];
  
        sacuvajLokalStorage("cart", products);
    }
  
    function proizvodJeUKorpi(){
        return proizvodiIzKorpe.filter(x => x.id == idPatike).length;
    }
  
    function azurirajKolicinu(){
  
        let proizvodiIzKorpe = uzmiIzLocalStorage("cart");

        for(let p of proizvodiIzKorpe){
            if(p.id == idPatike){
                p.kolicina++;
                break;
            }
        }
  
        sacuvajLokalStorage("cart", proizvodiIzKorpe);
    }
  
    function dodajProizvodUKorpu(){
        let proizvodiIzKorpe = uzmiIzLocalStorage("cart");
  
        proizvodiIzKorpe.push({
            id: idPatike,
            kolicina: 1
        });
        sacuvajLokalStorage("cart", proizvodiIzKorpe);
    }
}
function brojProizvoda(){
    let proizvodiIzKorpe = uzmiIzLocalStorage("cart");
  
    if(proizvodiIzKorpe == null){
        $(".num-proizvoda").html(`(<span style="color:black;">0</span>)`);
    }
    else{
        let brojProizvoda = proizvodiIzKorpe.length;
        $(".num-proizvoda").html(`(<span style="color:red;">${brojProizvoda}</span>)`)
    }
}
function povecajKolicinu(e){
    e.preventDefault();
    let id= $(this).data("id");
    let products = uzmiIzLocalStorage("cart");
    products.forEach(p=>{
      if(p.id == id){
        p.kolicina = p.kolicina + 1;
        sacuvajLokalStorage("cart", products);
      }
    });
    stampanjeKorpe();
    potvrdiPorudzbinu();
}
function smanjiKolicinu(e){
    e.preventDefault();
    let id= $(this).data("id");
    let products = uzmiIzLocalStorage("cart");
    products.forEach(p=> {
      if(p.id == id){
        if(p.kolicina==1){
          return;
        } else {
            p.kolicina = p.kolicina - 1;
            sacuvajLokalStorage("cart", products);
          }
      }
    });
    stampanjeKorpe();
    potvrdiPorudzbinu();
}