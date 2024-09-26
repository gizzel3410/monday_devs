import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { CardGameScene } from "./scenes/CardGameScene";
import { DevCard } from "./objects/DevCard";
import {TestGround} from "./scenes/TestGround";
import {GameOver} from "./scenes/GameOver";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#d3d3d3',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        CardGameScene,
        TestGround,
        GameOver
    ],
    object: [
        DevCard,
    ]
};

export default new Phaser.Game(config);
