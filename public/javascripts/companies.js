var backButton = document.getElementById('back-button')
var companiesContainer = document.getElementById('companies-container')
var companyContainer = document.getElementById('company-container')
var title = document.getElementById('company-title')
var description = document.getElementById('company-description')
var phone = document.getElementById('company-phone')
var mail = document.getElementById('company-mail')
var equipment = document.getElementById('company-equipment')
var city = document.getElementById('company-city')

function reloadPage(){
    const mainContainer = document.querySelector('.main-container')

    mainContainer.innerHTML = '<div class="main-spinner"></div>'
    mainContainer.style.justifyContent = 'center'
    mainContainer.style.alignItems = 'center'
}

backButton.addEventListener('click', () => {
    showContainer('back')
})

function showCompany(titleText, mailText, phoneText, equipmentText, cityText, descriptionText){
    title.innerText = titleText
    description.innerText = descriptionText
    phone.innerText = phoneText
    mail.innerText = mailText
    equipment.innerText = equipmentText
    city.innerText = cityText

    showContainer('com')
}

function showContainer(index){
    switch (index) {
        case 'back':
            companiesContainer.style.display = 'flex'
            backButton.style.display = 'none'
            companyContainer.style.display = 'none'
        break;
            
        case 'com':
            companyContainer.style.display = 'block'
            backButton.style.display = 'block'
            companiesContainer.style.display = 'none'
        break;
    }

}

function search() {
    const input = document.getElementById('city-search').value.toLowerCase();
    const companies = document.querySelectorAll('.company');

    companies.forEach(company => {
        const city = company.querySelector('.company-city').textContent.toLowerCase();
        if (city.includes(input)) {
            company.style.display = 'flex';
        } else {
            company.style.display = 'none';
        }
    });
}