//Récup les données du localstorage
function getLocalStorage() 
{
    let produitDansLocalStorage = JSON.parse(localStorage.getItem("productInCart"));
    console.log(produitDansLocalStorage);
  
    // Creation d'un dictionnaire pour stocker les données
    // Structure du dictionnaire = {id: {col: qt, col:qt}}  
    let panier = {};
  
    // Récupération de l'ID, couleur et quantité
    for(let k = 0; k < produitDansLocalStorage.length; k++) 
    {     
      let id = produitDansLocalStorage[k][0];
      let col= produitDansLocalStorage[k][1];
      let qt = parseInt(produitDansLocalStorage[k][2]); 
  
     
      if (id in panier) 
      {
        // Si la couleur et l'id sont les même, on augmente la quantité
        if (col in panier[id]) 
        { 
          panier[id][col] += qt
        } 
        // on ajoute une autre couleur
        else 
        {
          panier[id][col]  = qt 
        }
      }
      // si pas dans le panier, on l'ajoute (id, couleur et quantité) 
      else 
      {
        panier[id] = {};
        panier[id][col] = qt; 
      }
    } 
    console.log(panier)
    // On retourne le panier avec les éléments qui ont été modifier
    return panier
}
  
//Envoie les données vers localstorage
function setLocalStorage(panier) 
{
  // Prend le param le dico
  // Copie de tableau vers localStorage
  // On pousse les éléments vers localStorage 
  produitDansLocalStorage = []
  for (id in panier) 
  {
    for (col in panier[id]) 
    {
      produitDansLocalStorage.push( [id, col, panier[id][col] ] )
    }
  }
    localStorage.setItem("productInCart", JSON.stringify(produitDansLocalStorage));
}
  
//Recup element localStorage pour les stocker dans panier
let panier = getLocalStorage();

//Position dans le HTML
const positionHtml = document.querySelector('#cart__items');
  
//si le panier est vide on affiche "le panier est vide"
if ( Object.keys(panier).length === 0 )
{
    positionHtml.innerHTML = `  <H2>Le panier est vide</H2>  `;
    document.querySelector("#totalPrice").innerHTML = 0;
    document.querySelector("#totalQuantity").innerHTML = 0;
    document.querySelector(".cart__order").style.display = "none";
} 
else 
{
  //Sinon on charge les éléments de l'api et du localstorage 
  let totalPrice = 0;
  let totalProduct = 0;

  for (let id in panier) 
  {
    //On récupère les informations complémentaires via l'API
    fetch("http://localhost:3000/api/products/" + id)
    .then((response)=>response.json())
    .then((data)=>
    {
      for (let col in panier[id]) 
      {
        positionHtml.innerHTML += showProduct(data, col, panier[id][col]);
        
        //Prix de chaque article x quantité du produit choisie 
        totalPrice = totalPrice + data.price * panier[id][col];
        document.querySelector("#totalPrice").innerHTML = totalPrice;
            
        //total du nombre d'artile + la quantité d'article choisie
        totalProduct = totalProduct + parseInt(panier[id][col]);
        document.querySelector("#totalQuantity").innerHTML = totalProduct;
      }
    })
  }
}
  
//Affichage des elements dans le HTML
function showProduct(data, color, quantity)
{
  return `
            <article class="cart__item" data-id="${data._id}" data-color="${color}">
              <div class="cart__item__img">
                <img src=${data.imageUrl} alt="${data.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__titlePrice">
                  <h2>${data.name}</h2>
                  <p>${color}</p>
                  <p id="price">${data.price}.00 €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input id="qty_${data._id}_${color}" onchange="changeQuantity('${data._id}','${color}')" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantity}>
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" onclick="deleteProduct('${data._id}','${color}')">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>`;
}
  
//Possibilité de modif de quantité dans le panier
function changeQuantity(id, col)
{
  const input_id = `qty_${id}_${col}`;
  const input = document.querySelector('input[type="number"]#'+input_id) 
  //Nouvelle quantite
  const new_qty = input.value    
  
  //Envoi de la nouvelle valeur dans localstorage
  let panier = getLocalStorage()
  panier[id][col] = new_qty;
  setLocalStorage(panier); 
  
  //reload pour maj
  location.reload(); 
} 
  
//delete des produits dans le panier
function deleteProduct(id, col)
{
  panier = getLocalStorage();
  delete panier[id][col];
  setLocalStorage(panier)
  
  // reload pour maj
  location.reload()
}
  
//REGEX
// Selection du formaulaire dans le html
let form = document.querySelector('.cart__order__form');
  
//Validation Prénom
form.firstName.addEventListener('change', function()
{
  validfirstName(this);
});
const validfirstName = function(inputfirstName)
{
  //lettre min et maj de a à z, 3 et 20 caractères
  let firstNameRegExp = new RegExp ("^[A-Za-z ,']{3,20}$", 'g');
  let errorMsg = document.querySelector('#firstNameErrorMsg');
  
  // Si les conditions sont remplie, renvoyer "true"
  if(firstNameRegExp.test(inputfirstName.value))
  {
    errorMsg.innerHTML= ""
    return true;
  }
  
  //Sinon message d'erreur 
  else
  {
    errorMsg.innerHTML= "Prénom non valide"
  }
};
  
//Validation Nom de famille
form.lastName.addEventListener('change', function()
{
  validlastName(this);
});
  
const validlastName = function(inputlastName)
{
  let lastNameRegExp = new RegExp ("^[A-Za-z ,']{3,20}$", 'g');
  let errorMsg = document.querySelector('#lastNameErrorMsg');
  
  if(lastNameRegExp.test(inputlastName.value))
  {
    errorMsg.innerHTML= ""
    return true;
  }
  else
  {
    errorMsg.innerHTML= "Nom non valide"
  }
};
  
//Validation Adresse
form.address.addEventListener('change', function()
{
    validAddress(this);
});
  
const validAddress = function(inputAddress)
{
  let addressRegExp = new RegExp ("[A-Za-z0-9'\.\-\s\,]", 'g');
  let errorMsg = document.querySelector('#addressErrorMsg');
  
  if(addressRegExp.test(inputAddress.value))
  {
    errorMsg.innerHTML= ""
    return true;
  }
  else
  {
    errorMsg.innerHTML= "Address non valide"
  }
};
  
// Validation Ville
form.city.addEventListener('change', function()
{
  validCity(this);
});
  
const validCity = function(inputCity)
{
  let cityRegExp = new RegExp ("^[A-Za-z ,.'-]{3,20}$", 'g');
  let errorMsg = document.querySelector('#cityErrorMsg');
  if(cityRegExp.test(inputCity.value))
  {
    errorMsg.innerHTML= ""
    return true;
  }
  else
  {
    errorMsg.innerHTML= "Ville non valide"
  }
};
  
//Validation e-mail
form.email.addEventListener('change', function()
{
  validEmail(this);
});

//creation REGEX pour validation l'email  
const validEmail = function(inputEmail)
{
  let emailRegExp = new RegExp ('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
  let errorMsg = document.querySelector('#emailErrorMsg');
  
  if(emailRegExp.test(inputEmail.value))
  {
    errorMsg.innerHTML= ""
    return true;
  }
  else
  {
    errorMsg.innerHTML= "Email non valide"
  }
};
  
//Soumission formulaire
form.addEventListener('submit', function(e)
{
  e.preventDefault();
  // si tout lest true, commande renvoi vers page confirmation 
  if(validfirstName(form.firstName) && 
  validlastName(form.lastName) && 
  validAddress(form.address) && 
  validCity(form.city) && 
  validEmail(form.email))
    {
      recupInfoForm(this);
    }
});
  
function recupInfoForm(form) 
{
  const panier = getLocalStorage();
  
  //Stockage infos formulaire
  const body = 
  {
    'contact': 
    {
      'firstName': form.firstName.value,
      'lastName' : form.lastName.value,
      'address'  : form.address.value,
      'city'     : form.city.value,
      'email'    : form.email.value,
    },

    //Stockage produits panier
    'products': Object.keys(panier)
  }
  
  //Récupere orderID du back-end
  fetch('http://localhost:3000/api/products/order', 
  {
    method: 'POST',
    headers: 
    {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify(body)
  })

  .then( res => res.json() ).then(js =>       
    {
      location.href =  `./confirmation.html?orderid=${js['orderId']}`
    })    
}