//ID dans l'URL
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id");



// Recup articles API grace a l'ID. On ajoute l'ID à la fin de l'URl avec la variable productId
function getProduct() 
{
    fetch("http://localhost:3000/api/products/" + productId)
    .then(function (response) {
        return response.json();
    })
    .catch((error) => {
        console.log("Erreur");
    })

    // Ajout des données API dans le DOM (HTML) avec la fonction viewProduct.
    .then(function (viewProduct) 
    {
        const product = viewProduct;
        console.log(product);

        // Image
        let productImg = document.createElement("img");
        document.querySelector(".item__img").appendChild(productImg);
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;

        // Titre 
        let productName = document.querySelector('#title');
        productName.innerHTML = product.name;

        // Prix
        let productPrice = document.querySelector('#price');
        productPrice.innerHTML = product.price;

        // Description
        let productDescription = document.querySelector('#description');
        productDescription.innerHTML = product.description;

        // Options de couleur. for parcours les éléments du key = 'colors'
        // productColors ajoute les options de couleurs dans le DOM (HTML)
         for (let colors of product.colors)
         {
           console.log(colors);
           let productColors = document.createElement("option");
             document.querySelector("#colors").appendChild(productColors);
             productColors.value = colors;
            productColors.innerHTML = colors;
        }


    });
        //Panier
     const addToCartBtn = document.getElementById("addToCart");
     addToCartBtn.addEventListener("click", () => 
    {
         // Envoi au localStorage
         let productColor = document.getElementById("colors").value;
         let productQuantity = document.getElementById("quantity").value;
         
         // si la couleur n'est pas renseignée, afficher une alerte
         if (productColor == "") 
        {
            alert("Choississez une couleur");
            
        } 
        // si quantité = 0 ou < 100, afficher une alerte
        else if (productQuantity == 0 || productQuantity >= 101) 
        {
            alert("Choississez une quantitée valable");
        } 
        else 
        {      
            let productInCart = localStorage.getItem('productInCart');
            
            // si localstorage null, crée un tableau avec 3 éléments
            if (productInCart === null)
            {
                let cartArray = [[productId, productColor, parseInt(productQuantity)]];
                let cartArrayStr = JSON.stringify(cartArray) 
                localStorage.setItem('productInCart', cartArrayStr)
            }
            
             // si déjà des éléments dans localstorage, ajoute les éléments dans le tableau
            else 
            {
                let cartArray = JSON.parse(productInCart);
                cartArray.push ([productId, productColor, productQuantity])
                let cartArrayStr = JSON.stringify(cartArray) 
                localStorage.setItem('productInCart', cartArrayStr)
            }

            // ouvre le panier une fois le produit ajouté
            //window.location.href = "./cart.html"; 

            //ouvre un popup
            if(window.confirm(`Votre commande est ajoutée au panier
            Pour consulter votre panier, cliquez sur OK, pour continuer vos achats cliquez sur Annuler`))
            {
                window.location.href ="cart.html";
            }
        }
    });
}

getProduct();

