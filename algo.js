import fs from "fs";

const CLUES = {
    FIND : 'r',
    NOT_FOUND : '-',
    EXIST : 'y'
}

export function initDictionary () {

    const data = fs.readFileSync('./words.txt', 'utf8');

    let words = {};
    data.split(/\r?\n/).forEach((word, index) =>  {
        const normalize_word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        if (!normalize_word.includes('-')){
            let first_letter = normalize_word.charAt(0)
            if (first_letter in words) {
                words[first_letter].add(normalize_word);
            }
            else {
                words[first_letter] = new Set([normalize_word]);
            }
        }
    });

    return words;

}

export function initWords (words, first_letter, word_length) {
    return Array.from(words[first_letter.toLowerCase()]).filter(word => word.length === word_length);
}

export function findBestWords(words, clues) {

    let find_letters = clues.filter(({letter, clue}, index) => {
        if ([CLUES.FIND, CLUES.EXIST].includes(clue)) return true;
    }).map(clue => clue.letter)

    return words.filter(word => {

        let all_clues_find = true;

        for (let j = 0; j < clues.length; j++) {

            let letter = clues[j]['letter'];
            let clue = clues[j]['clue'];

            switch (clue) {
                case CLUES.FIND:
                    if (word[j] !== letter) {
                        all_clues_find = false;
                        break
                    }
                    break
                case CLUES.NOT_FOUND:
                    if (find_letters.includes(letter)){
                        if (word[j] === letter) {
                            all_clues_find = false;
                            break
                        }
                    }
                    else {
                        if (word.includes(letter)) {
                            all_clues_find = false;
                            break
                        }
                    }
                    break
                case CLUES.EXIST:
                    if (!word.includes(letter)) {
                        all_clues_find = false;
                        break
                    }
                    break
                default:

            }
        }

        if (all_clues_find) return word;

    });
}