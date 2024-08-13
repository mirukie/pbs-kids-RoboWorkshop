import { GameScene } from './gameScene';
import * as PIXI from 'pixi.js';
import { button } from '../gameobjects/button';

export class TitleScene extends PIXI.Container
{
    constructor(game)
    {
        super();
        this.game = game;
    }

    async preload()
    {
        PIXI.Assets.add({alias: 'titleBG', src: './assets/backgrounds/botbuilderfrontpage.png'});
        PIXI.Assets.add({alias: 'spritesheet', src: './assets/spritesheets/main-spritesheet.json'});
        PIXI.Assets.add({alias: 'aniSprite', src: './assets/spritesheets/aniSpritesheet.json'});
        PIXI.Assets.add({alias: 'welcome', src: './assets/audio/workshopWelcome.mp3'});
        PIXI.Assets.add({alias: 'buildRobo', src: './assets/audio/buildYourRobotSelect.mp3'});

        this.backgroundTexture = await PIXI.Assets.load('titleBG');
        await PIXI.Assets.load(['spritesheet', 'aniSprite', 'narrator', 'welcome', 'buildRobo']);
    }

    start()
    {
        const scalerBackground = PIXI.Sprite.from(this.backgroundTexture);
        this.addChild(scalerBackground);

        /*
        add animated sprite for conveyer belt!
        */
        const animations = PIXI.Assets.cache.get('./assets/spritesheets/aniSpritesheet.json').data.animations; // grab the automatically recognized/generated animations from the cache

        const conveyer = PIXI.AnimatedSprite.fromFrames(animations["conveyer/conveyerbelt"]);
        conveyer.animationSpeed = 1 / 12;
        conveyer.position.set(0, 535);
        conveyer.play();

        this.addChild(conveyer);


        let puzzleBtn = new button({ x: this.game.width / 2 - 250, y: this.game.height / 2 + 200, image: "gameSelectionBtns/roboPuzzle.png" });
        let buildYourOwnBtn = new button({ x: this.game.width / 2 + 250, y: this.game.height / 2 + 200, image: "gameSelectionBtns/buildYourRobot.png" });

        this.buildRoboSound = PIXI.Assets.get('buildRobo');

        buildYourOwnBtn.on('pointerdown', () =>
        {
            this.buildRoboSound.play();
            const nextScene = new GameScene(this.game);
            this.game.application.state.scene.value = nextScene;
        });

        this.addChild(puzzleBtn);
        this.addChild(buildYourOwnBtn);

        let narrator = PIXI.Sprite.from("narratorbot.png");
        narrator.anchor.set(0.5);
        narrator.position.set(this.game.width / 2, this.game.height / 2 + 50);
        this.addChild(narrator);

        /*
        narration VO
        */
        // this.welcomeMsg = PIXI.Assets.get('welcome');
        // this.welcomeMsg.play();
    }

    update()
    {
        // nothing to do
    }
}