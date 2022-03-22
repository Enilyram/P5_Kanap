//Recup des produits dans l'API

fetch("http://localhost:3000/api/products")
    .then(function (res) 
    {
        if (res.ok) 
        {
            return res.json();
        }
    })
        //Reponse
    .then(function (items) 
    {
        console.log(items);
            //Pour boucler dans le tableau pour chaque produit
        for (let article of items) 
        {
            produitAfficher(article);
            console.log(article);
        }
    })

    //fonction qui permet d'afficher les produits et leurs infos

function produitAfficher(article) 
{
    //création de "a" et paramètres de href, placement dans le html

    let lienProduit = document.createElement("a");
    document.querySelector(".items").appendChild(lienProduit);
    lienProduit.href = `product.html?id=${article._id}`;

    //creation de article

    let itemArticle = document.createElement("article");
    lienProduit.appendChild(itemArticle);

    //affichage images et son txt alt

    let produitImg = document.createElement("img");
    itemArticle.appendChild(produitImg);
    produitImg.src = article.imageUrl;
    produitImg.alt = article.altTxt;

    //creation h3 et le nom du produit

    let produitName = document.createElement("h3");
    itemArticle.appendChild(produitName);
    produitName.classList.add("produitName");
    produitName.innerHTML = article.name;

    //creation p et la description du produit

    let produitDescription = document.createElement("p");
    itemArticle.appendChild(produitDescription);
    produitDescription.classList.add("produitDescription");
    produitDescription.innerHTML = article.description;
}
