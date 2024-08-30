export class Player {
    playerId: string;
    nickname: string;
    role: string;
    isAdmin: boolean;

    constructor(playerId = "", nickname = "", role = "player", isAdmin = false){
        this.playerId = playerId;
        this.nickname = nickname;
        this.role = role;
        this.isAdmin = isAdmin;
    }
}
