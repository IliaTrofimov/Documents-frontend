export class User {
    constructor(public id: number, public name: string) { }
}

export class Signatory {
    constructor(public userId: number, public documentId: number) { }
}

