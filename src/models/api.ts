export class BaseResponse {
    static OK = '200';

    status: string;
    message?: string;

    constructor(status?: string, message?: string) {
        this.status = status;
        this.message = message;
    }

    ok(): boolean {
        return this.status === BaseResponse.OK;
    }

}
