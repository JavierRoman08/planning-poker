export class Player {
    id: string;
    nickname: string;
    role: string;
    isAdmin: boolean;

    constructor(id = "", nickname = "", role = "player", isAdmin = false){
        this.id = id;
        this.nickname = nickname;
        this.role = role;
        this.isAdmin = isAdmin;
    }
}
