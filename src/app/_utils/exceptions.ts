

export class TokenNotFound extends Error{
    constructor(message?:string){
        super(message)
        this.name = "TokenNotFound"
    }
}

export class SessionExpired extends Error{
    constructor(message?:string){
        super(message)
        this.name = "SessionExpired"
    }
}

