class Request {
    static async fetchData(url, options) {
        try {
            const response = await fetch(url, options);
            return response;
        } catch (error) {
            console.error('Error durante il fetch delle informazioni ', error);
        }
    }
}

export default Request;