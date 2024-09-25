export class CardGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CardGameScene' });
    }

    create() {
        this.hand = [];
        this.pool = [];
        this.board = [];

        // Fill pool with some cards
        for (let i = 0; i < 10; i++) {
            this.pool.push({ id: i, color: Phaser.Display.Color.RandomRGB() });
        }

        // Draw initial hand of 5 cards
        this.drawCards(5);

        // Add Drag Events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setFillStyle(0x00ff00); // Change color instead of using setTint
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setFillStyle(0xffffff); // Reset to original color
        });
    }

    drawCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.hand.length < 5 && this.pool.length > 0) {
                const card = this.pool.pop();
                this.addCardToHand(card);
            }
        }
    }

    addCardToHand(card) {
        const cardSprite = this.add.rectangle(100 + this.hand.length * 160, 600, 150, 250, card.color.color);
        cardSprite.setInteractive();  // Make the card interactive
        this.input.setDraggable(cardSprite);  // Enable dragging for this card

        this.hand.push(card);
    }
}
