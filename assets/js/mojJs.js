console.log("Hello");
var nizBrendova, nizVelicina,nizPol,nizPopusti, nizPatike;
var url = window.location.pathname;
window.onload = function(){
  
    if(url == "/" || url == "/index.html"){
        animacijaPatika();
    }
    if(url == "/shop.html"){

        animacijaPatika();

    }
    if(url == "/author.html"){

    }
    if(url == "/contact.html"){

    }
}
function animacijaPatika(){
    $(document).ready(function(){
        $('.content img').mouseover(function() {
            $(this).css({ 
              transform: 'rotate(-50deg) scale(1.2)',
              transition: "transform .2s;",
      
            });
        });
      
        $('.content img').mouseout(function() {
            $(this).css({ 
                transform: 'rotate(0deg)',
               transition: "transform .2s;"
            });
        });
      });
}

