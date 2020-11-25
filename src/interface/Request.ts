export interface UserRequest {
    email: String;
    password:String;
}

export interface UserRecovery {
    email: String;
    code:String;
    password:String
}