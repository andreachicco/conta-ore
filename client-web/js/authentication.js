import Request from "./requests.js";
import apiEndpoint from "./config.js";

class Authentication {
    constructor() {

        //Singleton
        if(!Authentication.instance) {

            try {
                const user = this.getUserCredentials();
                //Generazione e setting del token in base all'utente che tenta di accedere
                this.setJwtToken(this.generateTokenByUser(user));
                console.info('Autenticato con successo');
            } catch (error) {
                console.error(error);
                alert(error.message);
            }

            Authentication.instance = this;
        }
    }

    getJwtToken() {
        return this.jwtToken;
    }

    setJwtToken(token) {
        if(token) this.jwtToken = token;
        else throw new Error('Errore di autenticazione')
    }

    //Login
    getUserCredentials() {
        const username = prompt('Enter your username');
        const password = prompt('Enter your password');
        
        const user = {
            username: username,
            password: password
        };
    
        return user;
    }

    async generateTokenByUser(user) {

        const loginResponse = await Request.fetchData(`${apiEndpoint}/auth/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const loginData = await loginResponse.json();
        
        const jwtToken = loginData.token;

        if(jwtToken) return jwtToken;
        else throw new Error('Errore nella generazione del token');

    }
}

const auth = new Authentication();
Object.freeze(auth);

export default auth;