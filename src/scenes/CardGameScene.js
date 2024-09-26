export class CardGameScene extends Phaser.Scene {
    constructor() {
        super({key: 'CardGameScene'});
    }

    // playerHandArea = {x: 0, y: 0};
    // playerCardArea = {x: 0, y: 0};
    //
    // enemyHandArea = {x: 0, y: 0};
    // enemyCardArea = {x: 0, y: 0};

    create() {
        this.playerHandArea = {x: 0, y: this.scale.height - 150, height: 150, nbCards: 0};
        this.playerCardArea = {x: 0, y: this.scale.height - 350, height: 150, nbCards: 0};

        this.enemyHandArea = {x: 0, y: 0, height: 150, nbCards: 0};
        this.enemyCardArea = {x: 0, y: 200, height: 150, nbCards: 0};

        this.playerHand = [];
        this.playerPool = [];

        this.enemyHand = [];
        this.enemyPool = [];

        this.player = {
            hand: [],
            pool: [],
            handArea: {x: 0, y: this.scale.height - 150, height: 150, nbCards: 0},
            cardArea: {x: 0, y: this.scale.height - 350, height: 150, nbCards: 0}
        }

        this.board = [];
        this.drawBoard()

        // Fill pool with some cards
        for (let i = 0; i < 10; i++) {
            this.playerPool.push({id: i, color: Phaser.Display.Color.RandomRGB()});
            this.enemyPool.push({id: i, color: Phaser.Display.Color.RandomRGB()});
        }

        // Draw initial hand of 5 cards
        this.drawCards(5);

        // Add Drag Events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setFillStyle(0x00ff00); // Change color instead of using setTint
            this.playerHandArea.nbCards -= 1;
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setFillStyle(0xffffff); // Reset to original color

            console.log(`${pointer.x}, ${pointer.y}`);

            if (pointer.y > this.playerCardArea.y && pointer.y < this.playerCardArea.y + this.playerCardArea.height) {
                console.log('playerCardArea!');
                gameObject.x = 100 + this.playerCardArea.nbCards * 160;
                gameObject.y = this.playerCardArea.y + 25;
                this.playerCardArea.nbCards += 1;
                this.nextTurn()
            } else {
                gameObject.x = 100 + this.playerHandArea.nbCards * 160;
                gameObject.y = this.playerHandArea.y + 100;
                this.playerHandArea.nbCards += 1;
            }


        });
    }

    drawCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.playerHand.length < 5 && this.playerPool.length > 0) {
                this.addCardToHandOfPlayer();
                this.addCardToHandOfEnemy();
            }
        }
    }

    reDrawHand(owner){

    }

    addCardToHandOfPlayer() {
        // const card = owner.hand.pop();
        const card = this.playerPool.pop();
        const cardSprite = this.add.rectangle(100 + this.playerHand.length * 160, this.playerHandArea.y + 100, 150, 200, card.color.color);
        cardSprite.setInteractive();  // Make the card interactive
        this.input.setDraggable(cardSprite);  // Enable dragging for this card

        this.playerHand.push(card);
        this.playerHandArea.nbCards += 1;
    }

    addCardToHandOfEnemy() {
        const card = this.enemyPool.pop();
        const cardSprite = this.add.rectangle(100 + this.enemyHand.length * 160, this.enemyHandArea.y + 50, 150, 200, card.color.color);
        cardSprite.setInteractive();  // Make the card interactive
        this.input.setDraggable(cardSprite);  // Enable dragging for this card

        card.gameObject = cardSprite;

        this.enemyHand.push(card);
        this.enemyHand.nbCards += 1;
    }

    drawBoard() {
        let playerHandRect = this.add.graphics();
        playerHandRect.fillStyle(0x0000ff, 1); // 0x0000ff is the color code for blue, 1 is full opacity
        playerHandRect.fillRect(this.playerHandArea.x, this.playerHandArea.y, this.scale.width, this.playerHandArea.height);

        let playerCardRect = this.add.graphics();
        playerCardRect.fillStyle(0x3cb371, 1); // 0x0000ff is the color code for blue, 1 is full opacity
        playerCardRect.fillRect(this.playerCardArea.x, this.playerCardArea.y, this.scale.width, this.playerCardArea.height);

        let enemyHandRect = this.add.graphics();
        enemyHandRect.fillStyle(0xff0000, 1);
        enemyHandRect.fillRect(this.enemyHandArea.x, this.enemyHandArea.y, this.scale.width, this.enemyHandArea.height);

        let enemyCardRect = this.add.graphics();
        enemyCardRect.fillStyle(0xffa500, 1);
        enemyCardRect.fillRect(this.enemyCardArea.x, this.enemyCardArea.y, this.scale.width, this.enemyCardArea.height);
    }

    nextTurn() {
        console.log('next turn!')
        this.enemyMove()
    }

    enemyMove() {
        console.log('enemy move!')
        const card = this.enemyHand.pop()

        console.log(`${card.gameObject.x}, ${card.gameObject.y}`);


        card.gameObject.x = 100 + this.enemyCardArea.nbCards * 160;
        card.gameObject.y = this.enemyCardArea.y + 25;
        this.enemyCardArea.nbCards += 1;

        console.log(`${card.gameObject.x}, ${card.gameObject.y}`);

        // gameObject.x = 100 + this.playerCardArea.nbCards * 160;
        // gameObject.y = this.playerCardArea.y + 25;
        // this.playerCardArea.nbCards += 1;

    }
}
