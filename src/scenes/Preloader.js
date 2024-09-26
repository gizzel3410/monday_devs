import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        console.log('hello')
        this.load.audio({
            key: 'title',
            url: [ 'pixelated_pursuit.mp3' ]
        })
    }

    create ()
    {
        this.music = this.sound.add('title');

        // Play the audio
        this.music.play({
            loop: true,  // Set to true to loop the music
            volume: 0.5  // Adjust the volume (optional)
        });
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        // this.scene.start('GameOver', {winner: "Player"});
        // this.scene.start('TestGround');
        this.scene.start('CardGameScene');
    }
}
