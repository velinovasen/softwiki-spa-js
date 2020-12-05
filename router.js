const databaseURL = `https://softwiki-90438-default-rtdb.firebaseio.com/`;

const routes = {
    'home': 'home-template',                           // maybe adjust the names of the template if it needs it
    'register': 'register-template',
    'login': 'login-template',
    'create': 'new-article-template',
    'details': 'article-details-template',
    'edit': 'edit-article',
}

const router = async (fullPath) => {
    console.log(fullPath)
    let path = fullPath;
    let id;
    let templateData = {};
    let user;
    let items = {};                         // here we must change to the actual Items name
    if (Boolean(localStorage.getItem('auth'))) {
        user = JSON.parse(localStorage.getItem('auth'))
        try {
            items = await getItems();                        // here we count change this, so we can get all the items we need
            Object.keys(items).forEach(key => items[key].key = key)   // pass the key as an attribute, so we can reach it in the html
            templateData.hasItems = true;                     // check if we already have the item (non-creator) (if we have it at all as an option. might need to remove)
            templateData.hasJavaScript = false;
            templateData.hasPython = false;
            templateData.hasCSharp = false;
            templateData.hasJava = false;
            let python = [];
            let javascript = [];
            let csharp = [];
            let java = [];
            Object.keys(items).forEach(key => {
                if (items[key].category === 'Python') {
                    templateData.hasPython = true;
                    python.push(items[key])
                } else if (items[key].category === 'C#') {
                    templateData.hasCSharp = true;
                    csharp.push(items[key])
                } else if (items[key].category === 'JavaScript') {
                    templateData.hasJavaScript = true;
                    javascript.push(items[key])
                } else if (items[key.category] === 'Java') {
                    templateData.hasJava = true;
                    java.push(items[key])
                }
            })
            templateData.python = python;
            templateData.javascript = javascript;
            templateData.csharp = csharp;
            templateData.java = java;
        }   catch(e) {
            console.log(e);                                   // just catch block
        }
        templateData.isAuth = true;
        templateData.items = items;                       // again must fix the name.
        templateData.email = user['email'];                 // setting the correct navbar on every click
    } else {
        templateData.isAuth = false;
    }


    if (fullPath.split('/')) {                       //here we check if the url should get an item from the database
        [path, id] = fullPath.split('/')
        console.log(path, id);
        if (path === 'details') {                          // here we handle the details page

            const itemDetails = await getItemDetails(id);

            templateData = itemDetails;          // the item's details
            templateData.id = id;               
            templateData.owner = false;           // the owner of the item
            console.log(user.localId, id);
            if (user.localId == templateData.creatorId) {           // here we check if the user logged in is the creator of the item
                templateData.owner = true;
            }
            
        } else if (path === 'edit') {                   // here we handle if we have to edit the item

            const itemDetails = await getItemDetails(id);
        
            templateData = itemDetails;                
            templateData.id = id;
            
        } else if (path === 'home') {

            if (!user) {
                path = 'login';
            }
        }
    }
    console.log(templateData)   //check how to template data looks for us before we pass it to the HTML
    //navbar
    let head = document.getElementById('header-element');                   // here we handle the navbar element in the HTML
    let navTemplate = Handlebars.compile(document.getElementById('navbar').innerHTML);

    head.innerHTML = navTemplate(templateData)

    //root
    let root = document.getElementById('root-body');            // here we handle the root element of the HTML

    let template = Handlebars.compile(document.getElementById(routes[path]).innerHTML);

    root.innerHTML = template(templateData);                // we may leave to footer to be in the HTML Permanently
}

function navigate(path) {                                               // this is our navigator that calls the router to load the templateData and then the HTML

    history.pushState({}, '', path)

    router(location.pathname.slice(1))
}


// THIS HERE ARE THE FUNCTIONS TO GET THE ITEMS FROM THE DATABASE
async function getItems() {
        
    const response = await fetch(databaseURL + '.json') 

    const data = await response.json()
   
    console.log(data)

    return data;
}

async function getItemDetails(id) {
    
    const response = await fetch(databaseURL + id + '.json')

    const data = await response.json()

    return data;
}
