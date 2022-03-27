class Request {
    static async fetchData(url, options) {
        try {
            const response = await fetch(url, options);

            if(response.status >= 400){
                const ERROR = 'Errore nella richiesta';
                throw new Error(ERROR);
            }

            return response;
        } catch (error) {
            console.error('Error durante il fetch delle informazioni ', error);
        }
    }
}

export default Request;