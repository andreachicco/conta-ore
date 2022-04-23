import Request from "./requests.js";
import apiEndpoint from "./config.js";

class Authentication {
    constructor() {

        //Singleton
        if(!Authentication.instance) {
            Authentication.instance = this;
        }
    }

    getJwtToken() {
        return localStorage.getItem('jwtToken');
    }

    setJwtToken(token) {
        if(token) localStorage.setItem('jwtToken', token);
        else throw new Error('Errore di autenticazione')
    }

    async login(user) {
        const loginResponse = await Request.fetchData(`${apiEndpoint}/auth/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if(!loginResponse.ok) {
            switch(loginResponse.status) {
                case 400:
                    throw new Error('Errore in fase di login...');
                case 401:
                    throw new Error('Password non corretta!');
                case 404: 
                    throw new Error('Username non corretto!');
            }
        }

        const loginData = await loginResponse.json();
        
        const jwtToken = loginData.token;

        if(jwtToken) this.setJwtToken(jwtToken);
        else throw new Error('Errore Generazione Token');
    }
}

const auth = new Authentication();
Object.freeze(auth);

export default auth;