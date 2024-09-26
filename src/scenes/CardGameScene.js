import {devs} from '../data/devs'; // Import the devs constant
import {DevCard} from "../objects/DevCard";
import {enemies} from "../data/enemies";
import {EnemyCard} from "../objects/EnemyCard"; // Import the Card class

export class CardGameScene extends Phaser.Scene {


    constructor() {
        super({key: 'CardGameScene'});
    }

    nextDepth = 100

    preload() {
        devs.forEach(dev => {
            this.load.image('dev_' + dev.id, 'assets/devs/' + dev.id + '.png')
        });
        enemies.forEach(enemy => {
            this.load.image('enemy_' + enemy.id, 'assets/enemies/' + enemy.id + '.png')
        })
        this.load.image('card_bk', 'assets/card_bk.png')
        this.load.image('bg', 'assets/bg.png')
    }

    cardSize = {w: 150, h: 175}
    maxLife = 2;

    // Update the text when the player's life changes (optional example)
    update() {
        this.playerLifeText.setText(`${this.player.life}/${this.maxLife}`);
        this.enemyLifeText.setText(`${this.enemy.life}/${this.maxLife}`);
    }

    create() {
        const background = this.add.image(0, 0, 'bg').setOrigin(0, 0);  // Position at the top-left corner
        console.log(this.width)
        console.log(this.sys.game.config.width)
        console.log(window.innerWidth)
        background.setDisplaySize(window.innerWidth, window.innerHeight);




        this.xOffset = (this.scale.width / 3);

        this.player = {
            interactable: true,
            life: this.maxLife,
            hand: [],
            pool: [],
            board: [],
            discard: [],
            handArea: {x: 0, y: this.scale.height - 150, height: 150, cardYOffset: 25},
            cardArea: {x: 0, y: this.scale.height - 450, height: 150}
        }

        this.enemy = {
            interactable: false,
            life: this.maxLife,
            hand: [],
            pool: [],
            board: [],
            discard: [],
            handArea: {x: 0, y: 0, height: 150, cardYOffset: 125},
            cardArea: {x: 0, y: 300, height: 150}
        }

        // Create a text object to display the player's life
        this.playerLifeText = this.add.text(this.scale.width - 75, this.player.handArea.y + 100, `${this.player.life}/${this.maxLife}`, {
            fontSize: '32px',
            fill: '#090808'
        });

        // Set the depth of the text to a high value to ensure it's always on top
        this.playerLifeText.setDepth(100);

        // Create a text object to display the player's life
        this.enemyLifeText = this.add.text(this.scale.width - 75, this.enemy.handArea.y + 5, `${this.player.life}/${this.maxLife}`, {
            fontSize: '32px',
            fill: '#090808'
        });

        // Set the depth of the text to a high value to ensure it's always on top
        this.enemyLifeText.setDepth(100);

        this.drawBoard()

        for (let i = 0; i < devs.length; i++) {
            const dev = devs[i];
            const enemy = enemies[Math.floor(Math.random() * enemies.length)]
            console.log(enemy)
            // console.log(dev)
            this.player.pool.push({
                id: i,
                color: Phaser.Display.Color.RandomRGB(),
                cardData: dev,
                damage: Math.floor(Math.random() * 10) + 1
            });
            this.enemy.pool.push({
                id: i,
                color: Phaser.Display.Color.RandomRGB(),
                cardData: enemy,
                damage: Math.floor(Math.random() * 10) + 1
            });
        }

        this.player.pool = shuffleArray(this.player.pool);
        this.enemy.pool = shuffleArray(this.enemy.pool);


        // Draw initial hand of 5 cards
        this.drawCards(5);

        // Add Drag Events
        this.input.on('dragstart', (pointer, gameObject) => {
            // gameObject.list[0].setFillStyle(0x00ff00); // Change color instead of using setTint
            gameObject.oldX = gameObject.x;
            gameObject.oldY = gameObject.y;
            gameObject.setDepth(this.nextDepth);
            this.nextDepth++ // Optionally reset depth when dragging ends
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            // gameObject.list[0].setFillStyle(0xffffff); // Reset to original color

            console.log(`${pointer.x}, ${pointer.y}`);

            if (pointer.y > this.player.cardArea.y && pointer.y < this.player.cardArea.y + this.player.cardArea.height) {

                const index = this.player.hand.findIndex(card => card.card.id === gameObject.card.id);
                const cardObject = this.player.hand.splice(index, 1)[0];

                cardObject.x = this.xOffset + this.player.board.length * 160;
                cardObject.y = this.player.cardArea.y + 100;

                this.player.board.push(cardObject);

                this.reDrawHand(this.player)
                this.nextTurn()
            } else {
                gameObject.x = gameObject.oldX;
                gameObject.y = gameObject.oldY;
            }

        });

    }

    drawCards(count) {
        for (let i = 0; i < count; i++) {
            console.log('draw cards')
            this.addCardToHand(this.player);
            this.addCardToHand(this.enemy);
        }
    }

    reDrawHand(owner) {
        for (let i = 0; i < owner.hand.length; i++) {
            const card = owner.hand[i];
            card.x = this.xOffset + i * 160;
        }
    }

    discardHand(owner) {
        console.log('discardHand')
        while (owner.board.length > 0) {
            const container = owner.board[0];        // Get the first item
            container.x = 0;
            container.y = 0;

            // Make the container visually invisible but still functional
            container.setAlpha(0); // Makes the container and its children invisible
            container.disableInteractive(); // Disables interaction for the container

            owner.discard.push(container);
            owner.board.shift();               // Remove the first item
        }
    }

    addCardToHand(owner) {
        console.log('addCardToHand')
        const card = owner.pool.pop();

        let container = {}

        if (owner.interactable === true) {
            container = new DevCard(this, this.xOffset + owner.hand.length * 160, owner.handArea.y + owner.handArea.cardYOffset, card.cardData, 0.75);
        } else {
            container = new EnemyCard(this, this.xOffset + owner.hand.length * 160, owner.handArea.y + owner.handArea.cardYOffset, card.cardData, 0.75);
        }

        const numberText = this.add.text(25, 100, `${card.damage}`, {
            fontSize: '32px',
            fill: '#090808',
            align: 'center'
        });

        // Set the stroke (thickness) and its color (here, black with thickness 4)
        numberText.setStroke('#000', 4);

        container.add(numberText);
        container.setSize(this.cardSize.w, this.cardSize.h);

        if (owner.interactable) {
            container.setInteractive();
            this.input.setDraggable(container);
        }

        container.card = card;

        owner.hand.push(container);
        owner.handArea.nbCards += 1;
    }

    drawBoard() {
        let playerHandRect = this.add.graphics();
        playerHandRect.fillStyle(0x0000ff, 0.2); // 0x0000ff is the color code for blue, 1 is full opacity
        playerHandRect.fillRect(this.player.handArea.x, this.player.handArea.y, this.scale.width, this.player.handArea.height);

        let playerCardRect = this.add.graphics();
        playerCardRect.fillStyle(0x3cb371, 0.4); // 0x0000ff is the color code for blue, 1 is full opacity
        playerCardRect.fillRect(this.player.cardArea.x, this.player.cardArea.y, this.scale.width, this.player.cardArea.height);

        let enemyHandRect = this.add.graphics();
        enemyHandRect.fillStyle(0xff0000, 0.2);
        enemyHandRect.fillRect(this.enemy.handArea.x, this.enemy.handArea.y, this.scale.width, this.enemy.handArea.height);

        let enemyCardRect = this.add.graphics();
        enemyCardRect.fillStyle(0xffa500, 0.4);
        enemyCardRect.fillRect(this.enemy.cardArea.x, this.enemy.cardArea.y, this.scale.width, this.enemy.cardArea.height);
    }

    totalTurnNumber = 0;
    turnNumber = 0;

    nextTurn() {
        this.totalTurnNumber++;
        this.turnNumber++;

        console.log('turn: ' + this.totalTurnNumber);

        this.enemyMove()

        if (this.turnNumber >= 5) {
            console.log('calc')
            const playerDamage = this.player.board.reduce((sum, card) => sum + card.card.damage, 0);
            const enemyDamage = this.enemy.board.reduce((sum, card) => sum + card.card.damage, 0);

            console.log(`player: ${playerDamage} vs enemy: ${enemyDamage}`);
            if (playerDamage > enemyDamage) {
                this.enemy.life--;
                console.log(`enemy takes damage: ${this.enemy.life} / 3`)
            }
            if (enemyDamage > playerDamage) {
                this.player.life--;
                console.log(`player takes damage: ${this.player.life} / 3`)
            }

            if (this.player.life <= 0) {
                console.log('player dies...')
                this.scene.start('GameOver', {winner: "Enemy"});
            }
            if (this.enemy.life <= 0) {
                console.log('enemy dies...')
                this.scene.start('GameOver', {winner: "Player"});
            }

            this.discardHand(this.player)
            this.discardHand(this.enemy)
            this.drawCards(5)

            this.turnNumber = 0;
        }
    }

    enemyMove() {
        console.log('enemy move!')
        const cardObject = this.enemy.hand.pop()
        cardObject.x = this.xOffset + this.enemy.board.length * 160;
        cardObject.y = this.enemy.cardArea.y + 75;
        this.enemy.board.push(cardObject)
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}
