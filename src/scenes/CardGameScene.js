export class CardGameScene extends Phaser.Scene {
    constructor() {
        super({key: 'CardGameScene'});
    }

    cardSize = {w: 150, h: 175}

    create() {

        this.player = {
            interactable: true,
            life: 3,
            hand: [],
            pool: [],
            board: [],
            discard: [],
            handArea: {x: 0, y: this.scale.height - 150, height: 150},
            cardArea: {x: 0, y: this.scale.height - 350, height: 150}
        }

        this.enemy = {
            interactable: false,
            life: 3,
            hand: [],
            pool: [],
            board: [],
            discard: [],
            handArea: {x: 0, y: 0, height: 150},
            cardArea: {x: 0, y: 200, height: 150}
        }

        this.drawBoard()

        // Fill pool with some cards
        for (let i = 0; i < 40; i++) {
            this.player.pool.push({
                id: i,
                color: Phaser.Display.Color.RandomRGB(),
                damage: Math.floor(Math.random() * 10) + 1
            });
            this.enemy.pool.push({
                id: i,
                color: Phaser.Display.Color.RandomRGB(),
                damage: Math.floor(Math.random() * 10) + 1
            });
        }

        // Draw initial hand of 5 cards
        this.drawCards(5);

        // Add Drag Events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.list[0].setFillStyle(0x00ff00); // Change color instead of using setTint
            gameObject.oldX = gameObject.x;
            gameObject.oldY = gameObject.y;
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.list[0].setFillStyle(0xffffff); // Reset to original color

            console.log(`${pointer.x}, ${pointer.y}`);

            if (pointer.y > this.player.cardArea.y && pointer.y < this.player.cardArea.y + this.player.cardArea.height) {

                const index = this.player.hand.findIndex(card => card.card.id === gameObject.card.id);
                const cardObject = this.player.hand.splice(index, 1)[0];

                cardObject.x = 100 + this.player.board.length * 160;
                cardObject.y = this.player.cardArea.y + 50;

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
            card.x = 100 + i * 160;
        }
    }

    discardHand(owner){
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
        const card = owner.pool.pop();
        const container = this.add.container(100 + owner.hand.length * 160, owner.handArea.y + 100);
        const cardObject = this.add.rectangle(0, 0, this.cardSize.w, this.cardSize.h, card.color.color);

        const numberText = this.add.text(0, 0, `${card.damage}`, {
            fontSize: '32px',
            fill: '#090808',
            align: 'center'
        });

        container.add(cardObject);
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
            }
            if (this.enemy.life <= 0) {
                console.log('enemy dies...')
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
        cardObject.x = 100 + this.enemy.board.length * 160;
        cardObject.y = this.enemy.cardArea.y + 75;
        this.enemy.board.push(cardObject)
    }
}
