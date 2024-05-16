var backButton = document.getElementById('back-button')
var regButton = document.getElementById('registration-button')
var formContainerLog = document.getElementById('form-container-log')
var formContainerReg = document.getElementById('form-container-reg')
var formContainerCheck = document.getElementById('form-container-check')
var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");
var emailRegInput = document.getElementById("email-reg");
var phoneRegInput = document.getElementById("phone-reg");
var nameRegInput = document.getElementById("name-reg");
var passwordRegInput = document.getElementById("password-reg");
var passwordCheckInput = document.getElementById("password-check-reg");
var codeCheckInput = document.getElementById("code-check");
var formConfirmButtonLog = document.getElementById("form-confirm-button-log")
var formConfirmButton = document.getElementById("form-confirm-button")
var formConfirmButtonCheck = document.getElementById("form-confirm-button-check")

document.addEventListener('DOMContentLoaded', function() {
    showContainer('log')
});

regButton.addEventListener('click', () => {
    showContainer('reg')
})

backButton.addEventListener('click', () => {
    showContainer('log')
})

function showContainer(index){
    switch (index) {
        case 'reg':
            formContainerLog.style.display = 'none'
            formContainerCheck.style.display = 'none'
            formContainerReg.style.display = 'block'
            backButton.style.display = 'block'
            emailRegInput.value = ''
            phoneRegInput.value = ''
            nameRegInput.value = ''
            passwordRegInput.value =''
            passwordCheckInput.value = ''
            registation()
            giveSuccessToRegBtn()
        break;
            
        case 'log':
            formContainerReg.style.display = 'none'
            backButton.style.display = 'none'
            formContainerCheck.style.display = 'none'
            formContainerLog.style.display = 'block'
            emailInput.value = ''
            passwordInput.value =''
            authorization()
            giveSuccessToLogBtn()
        break;

        case 'check':
            formContainerLog.style.display = 'none'
            formContainerReg.style.display = 'none'
            formContainerCheck.style.display = 'block'
            backButton.style.display = 'none'
        break;
    }

}

function authorization(){

    formConfirmButtonLog.onclick = () => {

        if(formConfirmButtonLog.disabled == false){

            formConfirmButtonLog.disabled = true
            formConfirmButtonLog.style.backgroundColor = 'grey'
            formConfirmButtonLog.innerHTML = '<div class="spinner"></div>'

            var formData = {
                email: emailInput.value,
                password: passwordInput.value
            };

            postFetch("/login", formData)
            .then(data => {
                console.log('Data from server:', data.message);
                window.location.href = data.redirectUrl;
            })
            .catch(error => {
                console.error('Error from server:', error);
                formConfirmButtonLog.disabled = false
                formConfirmButtonLog.style.backgroundColor = '#E2574C'
                formConfirmButtonLog.innerText = 'Proovige uuesti'
            });
        }
    }
}

function registation(){
    formConfirmButton.onclick = () => {

        if(formConfirmButton.disabled == false){

            
            if (passwordRegInput.value !== passwordCheckInput.value) {
                passwordCheckInput.style.backgroundColor = '#e2564c3a'
                passwordRegInput.style.backgroundColor = '#e2564c3a'
                passwordCheckInput.value = ''
                passwordCheckInput.placeholder = 'Pass ei klapi'
            }else{

                formConfirmButton.disabled = true
                formConfirmButton.style.backgroundColor = 'grey'
                formConfirmButton.innerHTML = '<div class="spinner"></div>'

                const randomCode = generateRandomCode();

                var formData = {
                    email: emailRegInput.value,
                    code: randomCode
                };

                postFetch("/check-email", formData)
                .then(data => {
                    if(data.message == 'User already registered'){
                        formConfirmButton.disabled = false
                        formConfirmButton.style.backgroundColor = '#E2574C'
                        formConfirmButton.innerText = 'E-post on juba registreerinud'
                    }else{
                        showContainer('check')

                        formConfirmButtonCheck.onclick = () => { 

                            formConfirmButtonCheck.style.backgroundColor = 'grey'
                            formConfirmButtonCheck.innerHTML = '<div class="spinner"></div>'

                            if(randomCode == codeCheckInput.value){

                                formData = {
                                    email: emailRegInput.value,
                                    phone: phoneRegInput.value,
                                    username: nameRegInput.value,
                                    password: passwordRegInput.value
                                };

                                postFetch("/registration", formData)
                                .then(data => {
                                    console.log('Data from server:', data.message);
                                    window.location.href = data.redirectUrl;
                                })
                                .catch(error => {
                                    console.error('Error from server:', error);
                                    formConfirmButtonCheck.style.backgroundColor = '#E2574C'
                                    formConfirmButtonCheck.innerText = 'Proovige uuesti'
                                });

                            }else{
                                formConfirmButtonCheck.style.backgroundColor = '#E2574C'
                                formConfirmButtonCheck.innerText = 'Kood ei ühti'
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error from server:', error);
                    formConfirmButton.disabled = false
                    formConfirmButton.style.backgroundColor = '#E2574C'
                    formConfirmButton.innerText = 'Proovige uuesti'
                });
            }
        }
    }
}

function giveSuccessToRegBtn(){
    if (emailRegInput.value === '' || 
    nameRegInput.value === '' || 
    passwordRegInput.value === '' || 
    passwordCheckInput.value === '' || 
    phoneRegInput.value === '' || 
    !validateEmail(emailRegInput.value)) {
        formConfirmButton.style.backgroundColor = 'grey';
        formConfirmButton.disabled = true;
    } else {
        formConfirmButton.style.backgroundColor = '#E2574C';
        formConfirmButton.disabled = false;
    }
}

function giveSuccessToLogBtn(){
    if (passwordInput.value === '' || emailInput.value === '' || !validateEmail(emailInput.value)) {
        formConfirmButtonLog.style.backgroundColor = 'grey';
        formConfirmButtonLog.disabled = true;
    } else {
        formConfirmButtonLog.style.backgroundColor = '#E2574C';
        formConfirmButtonLog.disabled = false;
    }
}

function generateRandomCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
