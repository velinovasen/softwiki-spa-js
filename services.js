const apiKey = `AIzaSyDUCwEY75xlG6stxDyV0qAdryoVyb8_bVU`;
// const databaseURL = 'https://softwiki-90438-default-rtdb.firebaseio.com/';

const authServices = {
    async registerUser(email, password) {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        const data = await response.json()
        await this.loginUser(email, password)
        return data;
        
    },

    async loginUser(email, password) {

        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({email, password})}
        )
        
        const user = await response.json()
        if (!user.error) {
            localStorage.setItem('auth', JSON.stringify(user))
            return user;
        }

    }
}


const itemServices = {

    async createOffer(title, category, content){           // adjust here 

        const creatorId = JSON.parse(localStorage.getItem('auth')).localId;        //get the creator of the item if we need it

        const response = await fetch(databaseURL + '.json', {
            method: "POST",
            body: JSON.stringify({
                title,
                category,                                                  // most likely we need to adjust this
                content,
                creatorId,
            })
        })
        const data = await response.json()
    },

    async getOffers() {                                    // we may not need this at all since we have it in the router file
        
        const response = await fetch(databaseURL + '.json') 

        const data = await response.json()

        return data;
    },

    async editItemFetch(id, shoe) {                                        // edit the item (validations are done in the init.js file)
        const response = await fetch('https://softwiki-90438-default-rtdb.firebaseio.com/' + id + '.json', {
            method: "PATCH",
            body: JSON.stringify(shoe)
        })
        
       
    },

    async deleteItemFetch(id) {                                            // delete the item
        const response = await fetch(databaseURL + id + '.json', {
            method: "DELETE"
        })
    }



}