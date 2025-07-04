class ApiResponse {
    constructor(metadata = null, result = null, type = '', text = '', status = null) {
        this.metadata = metadata;
        this.result = result;
        this.type = type;
        this.text = text;
        this.status = status;
    }

    getResponseBody(){
        return {
            result: this.result,
            type: this.type,
            text: this.text,
            metadata: this.metadata,
        }
    }

    getStatusCode() {
        return this.status
    }
}

module.exports = ApiResponse
