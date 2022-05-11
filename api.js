import chalk from "chalk";
import axios from "axios";

const SHORT_ID = "";
const PLAYER_ID = "";
const ACCESS_TOKEN = "";

export function tryWord (word) {

    console.log('Test word : ' + chalk.red(word.toUpperCase()));

    return axios({
        url: 'https://www.tusmo.xyz/graphql?opname=TryWord',
        method: 'POST',
        headers: {
            'User-Agent': 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
        },
        data: {
            query:
                `
              mutation TryWord {
                tryWord(
                    shortId: "` + SHORT_ID + `",
                    word:"` + word.toUpperCase() + `",
                    playerId: "` + PLAYER_ID + `",
                    lang: "fr",
                    accessToken: "` + ACCESS_TOKEN + `",
                ) {
                    word
                    validation
                    wordExists 
                    hasFoundWord 
                    mask    
                    score    
                    __typename  
                }
              }
              `
        }
    });
}

const response_type = {
    "data": {
        "tryWord": {
            "word": "OISEAU",
            "validation": [
                "r",
                "y",
                "-",
                "r",
                "-",
                "-"
            ],
            "wordExists": true,
            "hasFoundWord": false,
            "mask": [
                "O",
                ".",
                ".",
                "E",
                ".",
                "."
            ],
            "score": 0,
            "__typename": "Try"
        }
    }
}