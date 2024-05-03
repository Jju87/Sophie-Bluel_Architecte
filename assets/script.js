import "./login.js"
import "./edition.js"
import {handleEditionPage} from './edition.js';
import {generateHomePage} from "./login.js";


console.log("Script loaded and executing.");

let token = localStorage.getItem('token');
if (token) {
    handleEditionPage();
    console.log("user is logged in");
} else {
    generateHomePage();
    console.log("user is currently not logged in");
}


// Récupération des données GET /works
export const response = await fetch("http://localhost:5678/api/works")
export const data = await response.json()
//console.log(data);

//Génération des données sur la page web avec la fonction generateData
export function generateData(data) {
    //Selection du container gallery
    const gallery = document.querySelector(".gallery")
    //Empêche les doublons lorsque l'on clique sur un filtre
    gallery.innerHTML = ""
    // Création d'une boucle pour récupérer les données de l'API
    for (let i = 0; i < data.length; i++) {
         const designProjects = data[i]

        // Création d’un élément <article> qui comprendra l'image(imageUrl) et le nom(title)
        const galleryCard = document.createElement("article")
        gallery.appendChild(galleryCard)

        // Ajout des images dans <article>
        const imageFromDesignProjects = document.createElement("img")
        imageFromDesignProjects.src = designProjects.imageUrl
        galleryCard.appendChild(imageFromDesignProjects)

        // Ajout des titres dans <article>
        const titleFromDesignProjects = document.createElement("h3")
        titleFromDesignProjects.innerText = designProjects.title
        galleryCard.appendChild(titleFromDesignProjects)
    }
}

generateData(data)

//Fonction qui filtre les données par catégorie
function filterDataByCateory(categoryName) {
    return data.filter(function(designProjects) {
        return designProjects.category && designProjects.category.name === categoryName
    })
}

// Récupération de tous les boutons de filtres avec selectorALL
const filterButtons = document.querySelectorAll(".filters__btn")

//Pour chaque bouton de filterButtons au click...
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // la variable categoryName récupère le data.category qui a été rajouté au html (exemple:data-category="Objets")
        let categoryName = btn.dataset.category
        //console.log(`Bouton de la catégorie ${categoryName} clické.`)
        let filteredData = filterDataByCateory(categoryName)
        // Affiche les données filtrées par catégorie
        generateData(filteredData)
    })
})

//*** Mise en commentaire du code refactorisé au dessus ***/

// //Sélection du bouton Objets et ajout d'un addEventListener
// const btnObjets = document.querySelector(".objects")
// btnObjets.addEventListener("click", function () {
//     //console.log("clicked")
//     // Si designProjects.category existe dans l'API, vérifier si la propiété name === "Objets". 
//     const filteredObjects = data.filter(function (designProjects) {
//         return designProjects.category && designProjects.category.name === "Objets"
//     })

//     generateData(filteredObjects)
// });

//  //Sélection du bouton Appartements et ajout d'un addEventListener
//  const btnAppartements = document.querySelector(".flats")
//  btnAppartements.addEventListener("click", function () {
//      //console.log("clicked")
//      // Si designProjects.category existe dans l'API, vérifier si la propiété name === "Appartements". 
//      const filteredObjects = data.filter(function (designProjects) {
//          return designProjects.category && designProjects.category.name === "Appartements"
//      })

//      generateData(filteredObjects)
//  })   

//   //Sélection du bouton Hotels & Restaurants et ajout d'un addEventListener
//   const btnHotels = document.querySelector(".hotels")
//   btnHotels.addEventListener("click", function () {
//       //console.log("clicked")
//       // Si designProjects.category existe dans l'API, vérifier si la propiété name === "Hotels & restaurants". 
//       const filteredObjects = data.filter(function (designProjects) {
//           return designProjects.category && designProjects.category.name === "Hotels & restaurants"
//       })

//       generateData(filteredObjects)
//   }) 

//Sélection du bouton Tous et ajout d'un addEventListener
const btnAll = document.querySelector(".all")
btnAll.addEventListener("click", function() {
    //console.log("clicked");
    generateData(data)
});

//