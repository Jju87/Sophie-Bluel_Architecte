import {handleEditionPage} from "./edition.js"

//*** Gestion de la section login au sein du DOM ***/

//Création d'une variable pour stocker le token
let token

// Vérifie si le token existe dans le localstorage
token = localStorage.getItem('token')

//Récupération de la section login  
const loginSection = document.getElementById("login-section")

//Récupération des éléments à effacer au clic de lien 'login'
const introElement = document.getElementById("introduction")
const portfolioElement = document.getElementById("portfolio")
const contactElement = document.getElementById("contact")

// Créattion d'une fonction de regénéraion des élements de la page d'acceuil
// quand la secion login est affichée à l'écran
export function generateHomePage() {
    introElement.style.display = "block"
    introElement.style.display = "flex"
    portfolioElement.style.display = "block"
    contactElement.style.display = "block"
    loginSection.classList.remove('active')
}

//Récupération du bouton login et création d'un addEventlistener
export const loginBtn = document.getElementById("link-login")
loginBtn.addEventListener("click", () => {
    //console.log("clicked on login link")

    //Suppression des éléments au clic
    introElement.style.display = "none"
    portfolioElement.style.display = "none"
    contactElement.style.display = "none"

    //Permet à la login-section d'apparaître avec une animation en utilisant..
    //..les classes et CSS (position absolute to relative, transform scale 0 to 1)
    loginSection.classList.add('active')

    //Fonctionnement optimal du lien Contact 
    //(disparition de la section login et réapparition des sections Intro, Projets, Contacts)
    const linkContact = document.getElementById("link-contact")
    linkContact.addEventListener("click", () => {
        generateHomePage()
    })

    //Fonctionnement optimal du lien Projets 
    //(disparition de la section login et réapparition des sections Intro, Projets, Contacts)
    const linkProjects = document.getElementById("link-projects")
    linkProjects.addEventListener("click", () => {
        generateHomePage()
    })
})

// Génération d'un bouton logout
export const logoutBtn = document.createElement("li")
logoutBtn.innerText = "logout"
loginBtn.insertAdjacentElement("afterend", logoutBtn)
logoutBtn.style.display = "none"
logoutBtn.addEventListener("click", () => {
    window.localStorage.removeItem("token")
    window.location.href = "/index.html"
    //console.log("clicked")
})

// Récupération de l'élément modal et ajout d'un style pour le cacher
const modal = document.getElementById("modal")
modal.style.visibility = "hidden"

// récupération des inputs du formulaire 
let emailInput = document.getElementById("emailInput")
let passwordInput = document.getElementById("passwordInput")
//console.log("Email:", emailInput.value);
//console.log("Password:", passwordInput.value)


//********* Fonction userLogin *************/


// Fonction qui permet de récupérer le token de l'utilisateur et de le stocker dans le localstorage
export async function userLogin() {
    const responseLogin = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
        })
    })

    if (responseLogin.ok) {
        const dataLogin = await responseLogin.json()
        //console.log(dataLogin)
        token = dataLogin.token
        if (token) {
            //Stocke le token dans le localstorage
            window.localStorage.setItem("token", token)
            location.reload();
            console.log("Token stocké dans le localstorage")

            // Foncion importée de edition.js qui se charge d'incorporer 
            // sur la page les éléments d'édition suite au login
            handleEditionPage()
            console.log("user is logged in");

        } else {
            console.log("Token not received. Login failed.")
        }
    } else {
        // Création d'une ID qui permettra,  une fois rattachée au errorMessage, 
        // de vérifier si errorMessage existe pour ne pas le dupliquer au clic
        // sur le bouton submit
        const errorMessageId = "login-error-message"
        const existingErrorMessage = document.getElementById(errorMessageId)

        // Si l'erreur n'existe pas, on la crée et on l'insère dans le DOM
        if (!existingErrorMessage) {

            // Création du message d'erreur
            const errorMessage = document.createElement("span")
            errorMessage.innerHTML = "Vos identifiants sont incorrects."
            errorMessage.classList.add("error-msg")
            errorMessage.id = errorMessageId

            // Insertion du message d'erreur dans le DOM
            const loginTitle = document.querySelector(".login-title")
            loginTitle.insertAdjacentElement("afterend", errorMessage)
        }
    }
}



//*** Addeventlistener du fromulaire (SUBMIT) ***//

// AddEventlistener sur l'input submit (bouton 'envoyer') du formulaire 'login-form'
export let loginForm = document.getElementById('login-form')
loginForm.addEventListener('submit', function(event) {
    //Empêche le recharchement de la page par défaut lors du clic sur le submit
    event.preventDefault()
    userLogin()
})