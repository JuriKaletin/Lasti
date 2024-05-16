
var backButton = document.getElementById('back-button')
var addAdButton = document.getElementById('add-advertisment')
var adContainer = document.getElementById('ad-container')
var adFormContainer = document.getElementById('ad-form-container')
var cityInput = document.getElementById('city')
var descriptionInput = document.getElementById('description')
var addressInput = document.getElementById('address')
var confirmButton = document.getElementById('confirm-button')
var advertisementsContainer = document.querySelector('.advertisments')

function reloadPage(){
    const mainContainer = document.querySelector('.main-container')

    mainContainer.innerHTML = '<div class="main-spinner"></div>'
    mainContainer.style.justifyContent = 'center'
    mainContainer.style.alignItems = 'center'
}

backButton.addEventListener('click', () => {
    showContainer('back')
})

addAdButton.addEventListener('click', () => {
    showContainer('add')
})

function showContainer(index){
    switch (index) {
        case 'back':
            adContainer.style.display = 'flex'
            adFormContainer.style.display = 'none'
            backButton.style.display = 'none'
        break;
            
        case 'add':
            adContainer.style.display = 'none'
            adFormContainer.style.display = 'block'
            backButton.style.display = 'block'
            descriptionInput.value = ''
            cityInput.value = ''
            addressInput.value = ''
            giveSuccessToConfirmBtn()
            addAdvertisment()

        break;
    }

}

function addAdvertisment(){
    confirmButton.onclick = () =>{    
        if(confirmButton.disabled == false){
            confirmButton.style.backgroundColor = 'grey'
            confirmButton.disabled = true
            confirmButton.innerHTML = '<div class="spinner"></div>'

            var formData = {
                city: cityInput.value,
                address: addressInput.value,
                description: descriptionInput.value,
            };

            postFetch("/advertisment/add-advertisment", formData)
                .then(data => {
                    console.log('Data from server:', data.message);
                    advertisementsContainer.innerHTML += `
                        <div class="advertisment">
                        <div class="advertisment-text-container">
                            <p>${cityInput.value}</p>
                            <p>${addressInput.value}</p>
                            <p class="advertisment-description">${descriptionInput.value}</p>
                        </div>
                        <div class="advertisment-buttons-container">
                            <img src="/images/trash.svg" alt="">
                        </div>
                        </div>
                    `
                    location.href = location.href;
                })
                .catch(error => {
                    console.error('Error from server:', error);
                    confirmButton.disabled = false
                    confirmButton.style.backgroundColor = '#E2574C'
                    confirmButton.innerText = 'Proovige uuesti'
                });
        }
    }
}

function deleteAdvertisment(id){

    var targetElement = document.getElementById(id)

    const advertismentButtonsContainer = targetElement.querySelector('.advertisment-buttons-container')

    advertismentButtonsContainer.innerHTML = '<div class="spinner"></div>'

    var formData = {
        id: id
    };

    postFetch("/advertisment/delete-advertisment", formData)
        .then(data => {
            console.log('Data from server:', data.message);
            targetElement.remove()
        })
        .catch(error => {
            console.error('Error from server:', error);
            advertismentButtonsContainer.innerHTML = `<img src="/images/trash.svg" alt="" onclick="deleteAdvertisment('${id}')">`
        });

}

function giveSuccessToConfirmBtn(){
    if(cityInput.value == '' || descriptionInput.value == '' || addressInput.value == ''){
        confirmButton.style.backgroundColor = 'grey'
        confirmButton.disabled = true
    }else{
        confirmButton.style.backgroundColor = '#E2574C'
        confirmButton.disabled = false
    }
}

// function likesAdvertisment(id){

//     getFetch(`/advertisment/likes-advertisment?id=${id}`, )
//         .then(data => {
//             console.log('Data from server:', data.message);
//         })
//         .catch(error => {
//             console.error('Error from server:', error);
//         });                             
// }

function postFetch(url, formData) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error();
        }
        return response.json();
    });
}

function getFetch(url, formData) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error();
        }
        return response.json();
    });
}