import {devs} from '../data/devs'; // Import the devs constant
import {enemies} from '../data/enemies'; // Import the devs constant
import {DevCard} from '../objects/DevCard';
import {EnemyCard} from "../objects/EnemyCard"; // Import the Card class

export class TestGround extends Phaser.Scene {
    constructor() {
        super({key: 'TestGround'});
    }

    preload() {
        // Preload images for the developers
        // devs.forEach(dev => {
        //     this.load.image(`dev-image-${dev.id}`, dev.imgUrl);
        // });

        devs.forEach(dev => {
            this.load.image('dev_' + dev.id, 'assets/devs/' + dev.id + '.png')
        });
        enemies.forEach(enemy => {
            this.load.image('enemy_' + enemy.id, 'assets/enemies/' + enemy.id + '.png')
        });
        this.load.image('bild', 'assets/dev_img.png')
        this.load.image('card_bk', 'assets/card_bk.png')
    }

    create() {
        this.enemyHand = [];
        this.enemyPool = [];
        this.hand = [];
        this.pool = [];
        this.board = [];
        this.handLimit = 5;  // Set hand limit

        // Populate pool with developers' data
        devs.forEach(dev => {
            this.pool.push(dev);
        });
        enemies.forEach(dev => {
            this.enemyPool.push(dev);
        });

        // Draw initial hand of 5 cards
        this.drawCards(5);

        for (let i = 0; i < this.enemyPool.length; i++) {
            const card = new EnemyCard(this, 300 + i * 160, 200, enemies[i]);
            }
        // Add Drag Events
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            // Handle card drop logic here
        });
    }

    drawCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.hand.length < this.handLimit && this.pool.length > 0) {
                this.pool = shuffleArray(this.pool)
                const cardData = this.pool.pop(); // Get a developer from the pool
                this.addCardToHand(cardData); // Add the card to the hand
            }
        }
    }

    addCardToHand(cardData) {
        // Create a new card object using the Card class
        const card = new DevCard(this, 300 + this.hand.length * 160, 600, cardData);

        // Store card data in hand array for future reference
        this.hand.push(card);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}