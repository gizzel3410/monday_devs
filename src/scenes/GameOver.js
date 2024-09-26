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
        // Create a text object to display the player's life
        this.playerLifeText = this.add.text(100, 100, `Winner is: ${this.winner}`, {
            fontSize: '322px',
            fill: '#090808'
        });

        // Set the depth of the text to a high value to ensure it's always on top
        this.playerLifeText.setDepth(100);
    }
}
