var deleteAccountBtn = document.getElementById('delete-account')
var confirmBtn = document.getElementById('confirm-button')
var nameInput = document.getElementById('username')
var phoneInput = document.getElementById('phone')
var cityInput = document.getElementById('city')
var equipmentInput = document.getElementById('equipment')
var descriptionInput = document.getElementById('description')
var nameText = document.getElementById('username-text')
var phoneText = document.getElementById('phone-text')
var cityText = document.getElementById('city-text')


function reloadPage(){
    const mainContainer = document.querySelector('.main-container')

    mainContainer.innerHTML = '<div class="main-spinner"></div>'
    mainContainer.style.justifyContent = 'center'
    mainContainer.style.alignItems = 'center'
}

deleteAccountBtn.addEventListener('click', () =>{
    deleteAccountBtn.innerHTML = '<div class="spinner"></div>'
    postFetch("/profile/delete-user")
    .then(data => {
        console.log('Data from server:', data.message);
        window.location.href = data.redirectUrl;
    })
    .catch(error => {
        console.error('Error from server:', error);
        deleteAccountBtn.innerText = 'Proovige uuesti'
    });
})

function editUser(){
    confirmBtn.innerHTML = '<div class="spinner"></div>'
    confirmBtn.style.backgroundColor = 'grey'

    const formData = {
        companyName: nameInput.value,
        phone: phoneInput.value,
        city: cityInput.value,
        equipment: equipmentInput.value,
        description: descriptionInput.value
    }

    postFetch("/profile/update-user", formData)
    .then(data => {
        console.log('Data from server:', data.message);
        confirmBtn.innerText = 'Kinnita'
        confirmBtn.style.backgroundColor = '#E2574C'
        nameText.innerText = nameInput.value
        phoneText.innerText = phoneInput.value
        cityText.innerText = cityInput.value
    })
    .catch(error => {
        console.error('Error from server:', error);
        confirmBtn.innerText = 'Proovige uuesti'
        confirmBtn.style.backgroundColor = '#E2574C'
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

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (!file) {
    console.error('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('photo', file);

  fetch('/profile/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      console.log('File uploaded successfully');
      window.location.href = window.location.href;
    } else {
      throw new Error('Failed to upload file');
    }
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });
});