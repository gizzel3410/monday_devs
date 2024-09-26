export class CardGameScene extends Phaser.Scene {
    constructor() {
        super({key: 'CardGameScene'});
    }

    create() {

        this.player = {
            hand: [],
            pool: [],
            board: [],
            handArea: {x: 0, y: this.scale.height - 150, height: 150},
            cardArea: {x: 0, y: this.scale.height - 350, height: 150}
        }

        this.enemy = {
            hand: [],
            pool: [],
            board: [],
            handArea: {x: 0, y: 0, height: 150},
            cardArea: {x: 0, y: 200, height: 150}
        }

        this.drawBoard()

        // Fill pool with some cards
        for (let i = 0; i < 10; i++) {
            this.player.pool.push({id: i, color: Phaser.Display.Color.RandomRGB()});
            this.enemy.pool.push({id: i, color: Phaser.Display.Color.RandomRGB()});
        }

        // Draw initial hand of 5 cards
        this.drawCards(5);

        // Add Drag Events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setFillStyle(0x00ff00); // Change color instead of using setTint
            this.player.handArea.nbCards -= 1;
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setFillStyle(0xffffff); // Reset to original color

            console.log(`${pointer.x}, ${pointer.y}`);

            if (pointer.y > this.player.cardArea.y && pointer.y < this.player.cardArea.y + this.player.cardArea.height) {

                const index = this.player.hand.findIndex(card => card.card.id === gameObject.card.id);
                const cardObject = this.player.hand.splice(index, 1)[0];
                console.log(cardObject.card.id);

                cardObject.x = 100 + this.player.board.length * 160;
                cardObject.y = this.player.cardArea.y + 50;

                this.player.board.push(cardObject);

                this.reDrawHand(this.player)
                this.nextTurn()
            } else {
                gameObject.x = 100 + this.player.handArea.nbCards * 160;
                gameObject.y = this.player.handArea.y + 100;
                this.player.handArea.nbCards += 1;
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

    reDrawHand(owner){
        console.log(owner.hand.length)
        for (let i = 0; i < owner.hand.length; i++) {
            const card = owner.hand[i];
            card.x = 100 + i * 160;
        }
    }

    addCardToHand(owner) {
        const card = owner.pool.pop();
        const cardObject = this.add.rectangle(100 + owner.hand.length * 160, owner.handArea.y + 100, 150, 175, card.color.color);
        cardObject.setInteractive();  // Make the card interactive
        this.input.setDraggable(cardObject);  // Enable dragging for this card
        cardObject.card = card;

        owner.hand.push(cardObject);
        owner.handArea.nbCards += 1;
    }

    drawBoard() {
        let playerHandRect = this.add.graphics();
        playerHandRect.fillStyle(0x0000ff, 1); // 0x0000ff is the color code for blue, 1 is full opacity
        playerHandRect.fillRect(this.player.handArea.x, this.player.handArea.y, this.scale.width, this.player.handArea.height);

        let playerCardRect = this.add.graphics();
        playerCardRect.fillStyle(0x3cb371, 1); // 0x0000ff is the color code for blue, 1 is full opacity
        playerCardRect.fillRect(this.player.cardArea.x, this.player.cardArea.y, this.scale.width, this.player.cardArea.height);

        let enemyHandRect = this.add.graphics();
        enemyHandRect.fillStyle(0xff0000, 1);
        enemyHandRect.fillRect(this.enemy.handArea.x, this.enemy.handArea.y, this.scale.width, this.enemy.handArea.height);

        let enemyCardRect = this.add.graphics();
        enemyCardRect.fillStyle(0xffa500, 1);
        enemyCardRect.fillRect(this.enemy.cardArea.x, this.enemy.cardArea.y, this.scale.width, this.enemy.cardArea.height);
    }

    nextTurn() {
        console.log('next turn!')
        this.enemyMove()
    }

    enemyMove() {
        console.log('enemy move!')
        const cardObject = this.enemy.hand.pop()
        cardObject.x = 100 + this.enemy.board.length * 160;
        cardObject.y = this.enemy.cardArea.y + 75;
        this.enemy.board.push(cardObject)
    }
}
