import {test} from '@playwright/test'
import {initDictionary, initWords, findBestWords} from './algo.js'
import chalk from "chalk";
import inquirer from "inquirer";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const MAX_TRY = 6;

const mode = null;

test('tusmo.xyz', async ({page}) => {


    await page.goto('https://www.tusmo.xyz/')

    await page.locator('.flex.grow button').first().click();
    await page.click('.menu-button.w-full.flex');

    const init_dictionary = initDictionary();

    let score = [];

    while (true) {

        const grid = page.locator('.game-column .motus-grid .grid-cell');
        const first = await grid.first()

        let first_letter = await first.textContent();
        let count = await grid.count() / MAX_TRY;

        let words = initWords(init_dictionary, first_letter, count);

        let win = false;

        for(let i=0; !win && words.length && i<=MAX_TRY-1; i++) {

            let test_word = words[0];

            console.log(chalk.blue('Test word : ' + chalk.bold(test_word.toUpperCase())));

            await [...test_word].forEach(letter => {
                page.keyboard.type(letter);

            })

            await page.keyboard.press('Enter')

            await delay(1800)

            let clues = [];

            if (!await page.locator('text=C\'est perdu').count()) {

                for(let j=0; j<count; j++) {

                    let nth_child = j+1+(count*i);
                    let cell = page.locator('.game-column .motus-grid div:nth-child(' + nth_child + ') .cell-content');
                    let clue = await cell.first().getAttribute('class');

                    clues.push({
                        'letter': test_word[j],
                        'clue': clue.split(' ')[1]
                    })
                }

                win = !clues.some(clue => clue.clue !== undefined);

                if (win) {
                    score.push(i+1)
                    console.log(chalk.green('Word find : ' + chalk.bold(test_word.toUpperCase()) + ' in ' + chalk.bold(i+1) + ' attempts !!'))
                }

                words = findBestWords(words, clues);

                await delay(1800)

            }
        }

        if (!words.length){
            console.log(chalk.red('LOOSE !! Word not found in dictionary'));
            break;
        }
        else if(!win) {
            let good_word = page.locator('.mt-10.w-full.flex.justify-between div:nth-child(2)');
            console.log(chalk.red('LOOSE !! Too many attempts. ') + chalk.yellow('Good word :' + chalk.bold(await good_word.first().textContent())));
            break;
        }
    }

    console.log(chalk.green('WIN : ' + chalk.bold(score.length) + ' parties - ' + 'AVG attempts : ' + score.reduce((partialSum, a) => partialSum + a, 0) / score.length));
    await page.pause();

})