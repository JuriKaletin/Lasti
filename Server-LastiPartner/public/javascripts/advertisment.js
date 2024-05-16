function reloadPage(){
    const mainContainer = document.querySelector('.main-container')

    mainContainer.innerHTML = '<div class="main-spinner"></div>'
    mainContainer.style.justifyContent = 'center'
    mainContainer.style.alignItems = 'center'
}

function search() {
    const city = document.getElementById('city-search').value.toLowerCase();

    const advertisements = document.querySelectorAll('.advertisment');

    advertisements.forEach(advertisement => {
        const advertisementCity = advertisement.querySelector('.advertisment-city').textContent.toLowerCase();
        if (advertisementCity.includes(city)) {
            advertisement.style.display = 'block';
        } else {
            advertisement.style.display = 'none';
        }
    });
}

function likeAdvertisment(id){

    const likeContainer = document.getElementById(id).querySelector('.like-container')

    likeContainer.innerHTML = '<div class="spinner"></div>'

    var formData = {
        id: id,
    };

    postFetch("/advertisment/like", formData)
            .then(data => {
                console.log('Data from server:', data.message);
                likeContainer.innerHTML = `<img src="/images/heart-active.svg" alt="" onclick="unlikeAdvertisment('${id}')">`
            })
            .catch(error => {
                console.error('Error from server:', error);
                likeContainer.innerHTML = `<img src="/images/heart.svg" alt="" onclick="likeAdvertisment('${id}')">`
            });
}

function unlikeAdvertisment(id){

    const likeContainer = document.getElementById(id).querySelector('.like-container')

    likeContainer.innerHTML = '<div class="spinner"></div>'

    var formData = {
        id: id,
    };

    postFetch("/advertisment/unlike", formData)
            .then(data => {
                console.log('Data from server:', data.message);
                likeContainer.innerHTML = `<img src="/images/heart.svg" alt="" onclick="likeAdvertisment('${id}')">`
            })
            .catch(error => {
                console.error('Error from server:', error);
                likeContainer.innerHTML = `<img src="/images/heart-active.svg" alt="" onclick="unlikeAdvertisment('${id}')">`
            });
}

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