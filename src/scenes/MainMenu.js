import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.scene.start('CardGameScene');
        //
        // this.add.text(512, 460, 'Spela', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);
        //
        // this.input.once('pointerdown', () => {
        //
        //
        // });
    }
}
