import {generateHomePage,loginBtn,logoutBtn} from "./login.js"
import {generateData} from "./script.js"

// Variable pour récupérer le token dans le localstorage (ne peut pas être importée de fichier en fichier)
let token = localStorage.getItem('token')

// Fonction pour cacher le modal
function hideModal() {
    modal.style.visibility = "hidden"
    modal.style.transform = "scale(0)"
    modal.style.opacity = "0"
}

/****** Génération des éléments dans le mode édition ******/

export function handleEditionPage() {
    //console.log(" Fonction handleEditionPage appelée")
    //Regénération de la page d'acceuil avec la fonction generateHomePage
    generateHomePage()
    // On demande de vérifier si le edit-section existe
    let editSection = document.querySelector(".edit-section")

    // Si il n'existe pas...
    if (!editSection) {
        // ...on le crée
        editSection = document.createElement("div")
        editSection.classList.add("edit-section")

        const header = document.querySelector("header")
        header.insertAdjacentElement("beforebegin", editSection)

        // On crée l'affichacge de Mode édition à l'intérieur de editSection
        editSection.innerHTML = `<div class="edit-msg">
                                    <i class="fa-solid fa-pen-to-square"></i> 
                                    <span>Mode édition</span>
                                </div>`
    }

    // Affichage du bouton logout et disparition du bouton login
    loginBtn.style.display = "none"
    logoutBtn.style.display = "block"

    // Génération du bouton modifier
    const modifyButton = document.createElement("div")

    // Récupération du titre Projets
    const titleProjects = document.querySelector(".projects-title")
    titleProjects.appendChild(modifyButton)

    // Le bouton modifier est généré avec un addEventListener qui affiche le modal
    modifyButton.innerHTML = `<div class="modify-btn">
                             <i class="fa-solid fa-pen-to-square"></i> 
                             <span>Modifier</span>
                             </div>`

    // Au click sur le bouton modifier, le modal apparait
    modifyButton.addEventListener("click", () => {
        modal.style.visibility = "visible"
        modal.style.transform = "scale(1)"
        modal.style.opacity = "1"
    })
}


// Le click sur la croix ferme le modal
const closeXmark = document.querySelector(".fa-xmark")
closeXmark.addEventListener("click", (event) => {
    hideModal()
})

// Le click au dehors du modal ferme le modal
modal.addEventListener("click", (event) => {
    //Vérifie si un élément cliqué ou un de ses parents ou ancêtres a la...
    // ...classe .modal-wrapper grace à closest
    const isModalWrapper = event.target.closest(".modal-wrapper")
    if (!isModalWrapper) {
        // Si l'élément n'a pas la classe .modal-wrapper, active la fonction hidemodal
        hideModal()
    }
})


//*********** Suppression DELETE ********/


async function eraseElementByID(id) {
    // Création des variables pour le modal de confirmation
    const confirmationModal = document.getElementById('confirmationModal')
    const yesButton = document.getElementById('yesButton')
    const noButton = document.getElementById('noButton')

    // Attente de la réponse de l'utilisateur
    // Promesse pour attendre la réponse de l'utilisateur
    const confirmation = await new Promise((resolve) => {
        // Resolve est une fonction qui permet de résoudre la promesse et 
        // de renvoyer une valeur (true ou false) à l'endroit où la promesse a été créée

        //Apparition du modal de confirmation
        confirmationModal.style.display = 'flex'

        // Si l'utilisateur clique sur le bouton "Oui", supprimer l'élément
        // et fermer le modal de confirmation (resolve(true)
        yesButton.onclick = function() {
            confirmationModal.style.display = 'none'
            resolve(true)
        };
        // Si l'utilisateur clique sur le bouton "Non", ne pas supprimer l'élément
        // et fermer le modal de confirmation (resolve(false)
        noButton.onclick = function() {
            confirmationModal.style.display = 'none'
            resolve(false)
        };
    });

    // Si la confirmation est true, supprimer l'élément en faisant une requête DELETE
    if (confirmation) {
        try {
            // Ici try/catch car on fait une requête DELETE qui peut échouer si 
            // le token n'est pas valide
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            // Si la requête est ok, afficher un message dans la console
            if (response.ok) {
                
                console.log(`Element with data-id ${id} deleted successfully`)
                // Remove the image from the gallery
                // Création des variables pour l'image et la corbeille
                const imageElement = document.querySelector(`.modal-gallery__image[data-id="${id}"]`)
                const trashCanElement = document.querySelector(`.fa-trash-can[data-id="${id}"]`)
                if (imageElement) {
                    imageElement.remove()
                    // remove a été rajouté également pour la trashcan parce que le trashcan ne se supprimait pas de la modal  
                    trashCanElement.remove()
                }

                // nouvelle requête GET pour récupérer les données à jour après la suppression
                const response = await fetch("http://localhost:5678/api/works")
                const newDataAfterDelete = await response.json()
                console.log('Updated data:', newDataAfterDelete)
                
                // Génération des données sur la page web après la suppression
                generateData(newDataAfterDelete)

                // Messages d'erreur si la requête n'est pas ok qui s'affiche dans la console
            } else {
                console.log("Could not delete element")
            }
            //Message d'erreur si la requête n'est pas ok qui s'affiche dans une fenêtre pop-up
        } catch (error) {
            console.error("Error deleting element:", error)
        }
    }
}

// Fonction qui génère les images dans la modal et qui génère la suppression en temps réel
async function generateImagesInModal(data) {
    // Selection de l'élement qui contiendra les images
    const eraserGalleryImage = document.querySelector(".modal-gallery__eraser")
    eraserGalleryImage.innerHTML = ""
    for (let i = 0; i < data.length; i++) {
        const designProjects = data[i];

        const imageForModal = document.createElement("div")
        imageForModal.classList.add("image-container")

        const img = document.createElement("img")
        img.src = designProjects.imageUrl
        img.classList.add("modal-gallery__image")

        const eraserButton = document.createElement("i")
        eraserButton.classList.add("fa-solid", "fa-trash-can")

        // On lie l'id de l'image à celle de la corbeille
        // ...pour pouvoir supprimer l'image en cliquant sur la corbeille
        const idNumber = designProjects.id
        img.dataset.id = idNumber
        eraserButton.dataset.id = idNumber

        // Appel de la fonction eraseElementByID au click sur la corbeille avec l'ID 
        // ... de l'image en paramètre
        eraserButton.addEventListener("click", (event) => {
            console.log("Clicked on ID number " + idNumber)
            eraseElementByID(idNumber)
        });

        // On ajoute l'image et la corbeille au container imageForModal
        imageForModal.appendChild(img)
        imageForModal.appendChild(eraserButton)

        // Ajout des éléments imageForModal au container eraserGalleryImage
        eraserGalleryImage.appendChild(imageForModal)
    }
}

// Fonction qui récupère les données de l'API et qui les affiche dans la modal
async function fetchDataAndUpdateModal() {
    const response = await fetch("http://localhost:5678/api/works")
    const data = await response.json()
    generateImagesInModal(data)
    //console.log("fonction fetchDataAndUpdateModal appelée")
}
fetchDataAndUpdateModal()



//******* Affichage Ajout/Suppression au sein de la modal ********/

// Gestion du display des modal d'ajout d'images 
// et de suppression d'images

const arrowBack = document.querySelector(".fa-arrow-left")
const accessToAddImagesBtn = document.querySelector(".access-to-add-images")

const modalGallery = document.getElementById("modal-gallery")
const modalSend = document.getElementById("modal-send")

// Au click sur le bouton d'ajout d'images, le modal apparait
// et le modal de suppression disparait
accessToAddImagesBtn.addEventListener("click", () => {
    modalGallery.style.display = "none"
    modalSend.style.visibility = "visible"
    modalSend.style.transform = "scale(1)"
    modalSend.style.opacity = "1"
    arrowBack.style.opacity = "1"
})


/*************** Ajout d'un projet (image + title + category) ******/


// Création des variables input pour le modal d'ajout d'images

// Cette variable est crée pour gérer la fonction "clear" car ce bouton 
//.. disparait lorsque l'image est uploadée
const labelContainerBtn = document.querySelector(".image-upload-label__container--btn")

// contenant de imagePreview
const imageUploadLabel = document.querySelector(".image-upload-label__container")

// Récupération des inputs
const imageUploadInputFile = document.getElementById("image-upload-input-file")
const imageUploadInputTitle = document.getElementById("image-upload-input-title")
const imageUploadInputCategory = document.getElementById("image-upload-input-category")
const imageUploadSubmitBtn = document.getElementById("submit-image-upload-btn")

// ** Afficher un aperçu de l'image uploadée **/

imageUploadInputFile.addEventListener("change", (event) => {
    // Récupération de l'image uploadée et de ses propriétés
    const fileObject = event.target.files[0]

    //Vérification que le fichier est bien une image en utilisant le type MIME comme condition

    // Si le type MIME ,n'est pas image/png ou image/jpeg...
    if (fileObject.type !== "image/png" && fileObject.type !== "image/jpeg") {
        // ...le navigateur affiche un message d'eurreur
        alert("Le fichier n'est pas reconnu, insérez une image au format jpeg ou png")
        // et on efface le contenu de l'input file
        imageUploadInputFile.value = ""
        //sinon, si le fichier est trop lourd...
    } else if (fileObject.size > 4000000) {
        // ...le navigateur affiche un message d'eurreur
        alert('The file is too large. Please select a file less than 4MB.')
        // et on efface le contenu de l'input file
        imageUploadInputFile.value = ''
        //sinon, si le fichier est bien une image de la bonne taille:
    } else {
        // On affiche l'image dans le label en utilisant la méthode createObjectURL
        const imagePreview = document.createElement("img")
        imagePreview.id = "image-preview"
        imagePreview.src = URL.createObjectURL(fileObject)
        imageUploadLabel.appendChild(imagePreview)
        imagePreview.classList.add("style-for-image-preview")

        // On cache le bouton "ajouter une image" pour correspondre à la maquette
        labelContainerBtn.style.display = "none"
    }
})


// Function qui vérifie si tous les inputs sont remplis
function checkInputs() {
    if (imageUploadInputFile.value && imageUploadInputTitle.value && imageUploadInputCategory.value) {
        // Si ils possèdent tous une valeur, on active le bouton submit en rendant la propriété disabled à false
        imageUploadSubmitBtn.disabled = false
        // Le bouton change de couleur (vert) et indique qu'il est actif
        imageUploadSubmitBtn.style.backgroundColor = "#1D6154"
        imageUploadSubmitBtn.style.cursor = "pointer"

    } else {
        // Sinon, on désactive le bouton submit en gardant la propriété disabled à true
        imageUploadSubmitBtn.disabled = true
        // Le bouton change de couleur (gris) et indique qu'il est inactif (cursor: not-allowed;)
        imageUploadSubmitBtn.style.backgroundColor = "#A7A7A7"
        imageUploadSubmitBtn.style.cursor = "not-allowed"
    }
}

checkInputs();

// On ajoute un event listener sur chaque input pour vérifier si ils sont remplis
// avec les arguents input/change et la fonction checkInputs
imageUploadInputFile.addEventListener('change', checkInputs)
imageUploadInputTitle.addEventListener('input', checkInputs)
imageUploadInputCategory.addEventListener('input', checkInputs)


// Function clear qui permet de vider les inputs et de supprimer l'aperçu de l'image 
function clearSendImageInputs() {
    imageUploadInputFile.value = ""
    imageUploadInputTitle.value = ""
    imageUploadInputCategory.value = ""

    imageUploadSubmitBtn.disabled = true
    imageUploadSubmitBtn.style.backgroundColor = "#A7A7A7"
    imageUploadSubmitBtn.style.cursor = "not-allowed"
    labelContainerBtn.style.display = "flex"
    const imagePreview = document.getElementById("image-preview")
    imagePreview.remove()
    console.log("Les inputs de la modale d'ajout d'images ont été vidés")
}

// fonction qui permet de revenir à la modal de suppression d'images
function backToGalleryEraser() {
    modalGallery.style.display = "flex"
    modalSend.style.visibility = "hidden"
    modalSend.style.transform = "scale(0)"
    modalSend.style.opacity = "0"
    arrowBack.style.opacity = "0"
}

// Fonction qui affiche une modale de confirmation d'envoi et confirme l'ajout d'un projet
function showConfirmationModal() {
    const confirmationModal = document.querySelector(".img-added-confirmation")
    confirmationModal.style.display = "flex"
    setTimeout(() => {
        confirmationModal.style.display = "none"
    }, 2000)
}

// Au click sur la flèche, le modal d'ajout d'images disparait
// et le modal de suppression apparait
arrowBack.addEventListener("click", () => {
    backToGalleryEraser()
    // On appelle la fonction clear pour vider les inputs si ils sont 
    // remplis (sans cette condidition un message d'erreur s'affiche dans la console
    // si il n'y a pas de valeur à effacer)
    if (imageUploadInputFile.value || imageUploadInputTitle.value || imageUploadInputCategory.value) {
        clearSendImageInputs()
    }
})


// Récupération de l'input select pour les catégories
const inputSelectCategories = document.getElementById("image-upload-input-category")

// Appel des catégories de l'API pour les afficher dans le select
// Prioriser cette méthode plutôt que de des les hardcoder dans le HTML (vu avec mentor)
async function fetchCategoriesForSelectInput() {
    const responseCategories = await fetch("http://localhost:5678/api/categories")
    const selectCategories = await responseCategories.json()
    //console.log(selectCategories)

     const emptyOption = document.createElement("option")
     emptyOption.value = ""
     emptyOption.innerText = ""
     inputSelectCategories.appendChild(emptyOption)

     // Pour chaque catégorie, on crée une option dans le select
     selectCategories.forEach((cat)=>{
        const option = document.createElement("option")
        option.value = cat.id // Il faut utiliser l'id et non le name (integer attendu par le back-end)
        option.innerText = cat.name
        inputSelectCategories.appendChild(option)
     })
}


fetchCategoriesForSelectInput()

// Au click sur le bouton submit, les données du formulaire sont envoyées
imageUploadSubmitBtn.addEventListener("click", (event) => {
    event.preventDefault()

    const formData = new FormData()

    // Append the integer value to the FormData object
    formData.append('image', imageUploadInputFile.files[0])
    formData.append('title', imageUploadInputTitle.value)
    formData.append('category', inputSelectCategories.value)


    // Création de la fonction d'envoi des données du formulaire en utilisant les paramètres formData et token
    async function submitForm(formData, token) {
        const initialResponse = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                "accept": "application/json",
                'Authorization': `Bearer ${token}`,
                // "Content-Type": "multipart/form-data" NE PAS METTRE! car le navigateur le fait automatiquement avec le FormData
            },
            body: formData
        })
        if (initialResponse.ok) {
            //console.log("Le formulaire a bien été envoyé")
            // Retour à la modal de suppression d'images
            backToGalleryEraser()
            // On appelle la fonction clear pour vider les inputs
            clearSendImageInputs()
            // On appelle la fonction showConfirmationModal pour afficher la modale de confirmation
            showConfirmationModal()
            // nouvelle requête GET pour récupérer les données à jour après la suppression
            const newResponse = await fetch("http://localhost:5678/api/works")
            const newDataAfterAddedImage = await newResponse.json()
            generateData(newDataAfterAddedImage)
        }

        // Appel de la fonction fetchDataAndUpdateModal pour mettre à jour les images dans la modal
        fetchDataAndUpdateModal()
    }

    submitForm(formData, token)
})