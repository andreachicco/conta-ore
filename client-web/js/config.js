import Request from "./requests.js"

const apiEndpoint = 'https://conta-ore-straordinari.herokuapp.com/api/v1';
let token = '';

async function getUserToken(user) {

    try {

        const authData = await Request.fetchData(`${apiEndpoint}/auth/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        
        token = authData.token;
    
        return token;

    } catch (error) {
        console.error("Errore");
    }

}

export {
    apiEndpoint,
    getUserToken
}