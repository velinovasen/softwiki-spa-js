function init_loader() {
    navigate('home')
}

init_loader()

window.addEventListener('popstate', (e) => {
    router(location.pathname.slice(1))  
})


const DOMSelectors = {
    titleInput: () => document.getElementById('title'),                               // most likely this will be the input fields from the form
    categoryInput: () => document.getElementById('category'),
    contentInput: () => document.getElementById('content'),
    createMsg: () => document.getElementById('create-msg'),
    // to finish
}


// NAVBAR BUTTONS 

function createNewItem(event) {
    event.preventDefault()

    navigate(event.target.href)
}

function homeButton(event) {
    event.preventDefault()

    navigate(event.target.href)

}

function logoutButton(event) {
    event.preventDefault()

    localStorage.removeItem('auth')
    setTimeout(function(){navigate('login')}, 700)
}
// LOGIN AND REGISTER BUTTONS

function RegisterNowButton(event) {      // register button click, redirect to register template
    event.preventDefault()

    console.log(event.target.href)

    navigate(event.target.href)
}

function loginNowButton(event) {
    event.preventDefault()

    console.log(event.target.href)

    navigate(event.target.href)
}

function loginSubmitButton(event) {
    event.preventDefault()

    let email = document.getElementById('email').value;
    let password = document.getElementById('login-pass').value;

    authServices.loginUser(email, password)
    setTimeout(function() {navigate('home')}, 700)
    
    
}

function registerSubmitButton(event) {
    event.preventDefault()

    let email = document.getElementById('email').value;
    let password = document.getElementById('register-pass').value;
    let password2 = document.getElementById('rep-pass').value;
    
    if (!email || !password || !password2) {
        return;
    }
    if (password.length < 6 || password !== password2) {
        return;
    }

    const data = authServices.registerUser(email, password);
    
    setTimeout(function() {navigate('home')}, 1200);
  
}

// ITEMS BUTTONS

function deleteItem(event) {
    event.preventDefault()
    const id = event.target.id;

    itemServices.deleteItemFetch(id)
    console.log('DELETED');
    setTimeout(function() { navigate('/home') }, 700)
}

async function editItemButtonSubmit(event) {
    event.preventDefault()
    const id = event.target.id                                                       // will need to adjust this 
    const title = DOMSelectors.titleInput().value;
    const category = DOMSelectors.categoryInput().value;
    const content = DOMSelectors.contentInput().value;

    const isOk = correctInputChecker(title, category, content);

    if (isOk) {
        console.log(id, title, category, content);
        document.getElementById('edit-msg').style.display = 'none';
        itemServices.editItemFetch(id, {title, category, content})
    
        setTimeout(function() { navigate('/home') }, 700)
    } else {
    document.getElementById('edit-msg').style.display = 'block';
    }
}

function editItem(event) {                      //edit item button 
    event.preventDefault()

    console.log(event.target);

    navigate('/edit/' + event.target.id);
}

function detailsButton(event) {                          // details button
    event.preventDefault()

    navigate('/details/' + event.target.id)
}

function createButton(event) {                      // create item button
    event.preventDefault()

    const title = DOMSelectors.titleInput().value;                            /// need to adjust
    const category = DOMSelectors.categoryInput().value;
    const content = DOMSelectors.contentInput().value;


    const validator = correctInputChecker(title, category, content);
    
    if (!validator) {
        DOMSelectors.createMsg().style.display = 'block';
        return;
    }
    DOMSelectors.createMsg().style.display = 'none';
    itemServices.createOffer(title, category, content)

    DOMSelectors.titleInput().value = '';
    DOMSelectors.categoryInput().value = '';
    DOMSelectors.contentInput().value = '';


    console.log(title, category, content)

    setTimeout(function() {navigate('home')}, 700)

}

// correct input form checker

function correctInputChecker(title, category, content){
    const languages = ['JavaScript', 'C#', 'Java', 'Python']
    let isOk = true;

    if (!/[A-z]+$/.test(title)) {
        isOk = false;
        return isOk;
    }
    if (!languages.includes(category)) {
        isOk = false;
        return isOk;
    }
    if (!/.+/.test(content)) {
        isOk = false;
        return isOk;
    }
    return isOk;

}