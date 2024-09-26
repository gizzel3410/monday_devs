import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init(data) {
        this.winner = data.winner;
    }

    create ()
    {
        console.log('GameOver')

        // Create a text object to display the player's life
        this.gameOverText = this.add.text(100, 100, `Winner is: ${this.winner}`, {
            fontSize: '32px',
            fill: '#090808'
        });

        // Set the depth of the text to a high value to ensure it's always on top
        this.gameOverText.setDepth(100);

        // Set the stroke (thickness) and its color (here, black with thickness 4)
        this.gameOverText.setStroke('#000', 2);
    }
}
