const XOR = require(__dirname + "/../classes/XOR");

let orbs = [0, 0, 50, 75, 125, 175, 225, 275, 350, 425, 500]
let length = ['Tiny', 'Short', 'Medium', 'Long', 'XL']
let difficulty = { 0: 'Unrated', 10: 'Easy', 20: 'Normal', 30: 'Hard', 40: 'Harder', 50: 'Insane' }
let demonTypes = { 3: "Easy", 4: "Medium", 5: "Insane", 6: "Extreme" }

class Level {
    constructor(levelInfo, server, download, author = []) {
        if (!levelInfo[2]) return;
        this.name = levelInfo[2];
        this.id = levelInfo[1];
        this.description = Buffer.from(levelInfo[3], "base64").toString() || "(No description provided)";
        this.author = author[1] || "-"
        this.playerID = levelInfo[6]
        this.accountID = author[2] || 0
        this.difficulty = difficulty[levelInfo[9]]
        this.downloads = +levelInfo[10]
        this.likes = +levelInfo[14]
        this.disliked = levelInfo[14] < 0
        this.length = length[levelInfo[15]] || "XL"
        this.stars = +levelInfo[18]
        this.orbs = orbs[levelInfo[18]] || 0
        this.diamonds = levelInfo[18] < 2 ? 0 : parseInt(levelInfo[18]) + 2
        this.featured = levelInfo[19] > 0
        this.epic = levelInfo[42] > 0
        this.gameVersion = levelInfo[13] > 17 ? (levelInfo[13] / 10).toFixed(1) : levelInfo[13] == 11 ? "1.8" : levelInfo[13] == 10 ? "1.7" : "Pre-1.7"
        if (levelInfo[28]) this.uploaded = levelInfo[28] + (server.timestampSuffix || "")
        if (levelInfo[29]) this.updated = levelInfo[29] + (server.timestampSuffix || "")
        if (download) { this.editorTime = +levelInfo[46] || 0; this.totalEditorTime = +levelInfo[47] || 0 }
        if (levelInfo[27]) this.password = levelInfo[27];
        this.version = +levelInfo[5];
        this.copiedID = levelInfo[30]
        this.twoPlayer = levelInfo[31] > 0
        this.officialSong = levelInfo[12] != 0 ? parseInt(levelInfo[12]) + 1 : 0
        this.customSong = +levelInfo[35]
        this.coins = +levelInfo[37]
        this.verifiedCoins = levelInfo[38] > 0
        this.starsRequested = +levelInfo[39]
        this.ldm = levelInfo[40] > 0
        if (+levelInfo[41] > 100000) this.weekly = true
        if (+levelInfo[41]) { this.dailyNumber = (+levelInfo[41] > 100000 ? +levelInfo[41] - 100000 : +levelInfo[41]); this.nextDaily = null; this.nextDailyTimestamp = null }
        this.objects = +levelInfo[45]
        this.large = levelInfo[45] > 40000;
        this.cp = Number((this.stars > 0) + this.featured + this.epic)

        if (levelInfo[17] > 0) this.difficulty = (demonTypes[levelInfo[43]] || "Hard") + " Demon"
        if (levelInfo[25] > 0) this.difficulty = 'Auto'
        this.difficultyFace = `${levelInfo[17] != 1 ? this.difficulty.toLowerCase() : `demon-${this.difficulty.toLowerCase().split(' ')[0]}`}${this.epic ? '-epic' : `${this.featured ? '-featured' : ''}`}`

        if (this.password && this.password != 0) {
            let xor = new XOR();
            let pass = xor.decrypt(this.password, 26364);
            if (pass.length > 1) this.password = pass.slice(1);
            else this.password = pass;
        }

        if (server.onePointNine) {
            this.orbs = 0
            this.diamonds = 0
            if (this.difficultyFace.startsWith('demon')) {
                this.difficulty = "Demon"
                this.difficultyFace = this.difficultyFace.replace(/demon-.+?($|-)(.+)?/, "demon$1$2")
            }
        }

        if (this.editorTime == 1 && this.totalEditorTime == 2) { this.editorTime = 0; this.totalEditorTime = 0 } // remove GDPS default values
    }
}

module.exports = Level;