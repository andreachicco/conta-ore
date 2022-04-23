class Request {
    static async fetchData(url, options) {
        const response = await fetch(url, options);
        return response;
    }
}

export default Request;