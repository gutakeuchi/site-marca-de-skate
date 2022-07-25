window.addEventListener("load", function() {
    var labels = document.querySelectorAll('.manual-navigation label');
    var rotate = false;

    setInterval(() => {
        labels.forEach(function(label) {
            const radioId = label.getAttribute('for');
            const radio = document.getElementById(radioId);
        
            if(radio.checked && rotate == false) {
                let theId = radioId.replace( /^\D+/g, '');
                let realId = parseInt(theId) + 1;
                let radioElement = document.getElementById( 'radio' + realId );
    
                if(radioElement) {
                    rotate = true;
                    radioElement.click();
                } else {
                    radioElement = document.getElementById( 'radio1' );
                    radioElement.click();
                }
            } else {
                rotate = false;
            }
        });
    }, 3000);
});







function login()
{   
    var email = document.getElementById("email");
    var senha = document.getElementById("senha");

    console.log(email.value+senha.value);

    if(email.value == "vitor.silva1048@etec.sp.gov.br" || "gustavo.takeuchi@etec.sp.gov.br" || "gabriel.ferreira428@etec.sp.gov.br" || "gustavo.azevedo11@etec.sp.gov.br" && senha.value == "admin")
    {
        localStorage.setItem("acesso", true);
        window.location.href = "./inicio.html";
    }
    else
    {
        alert("Usuario ou senha invalidos!");
    }
}