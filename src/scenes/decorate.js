import * as PIXI from 'pixi.js';
import { button } from '../gameobjects/button'
import { TitleScene } from './title';
import { EndScene } from './endScene';
import { decoration } from '../gameobjects/decoration';
import { gameMath } from '../gameMath';
// import { roboPart } from '../gameobjects/roboPart';
import decoAttrs from '../config/decorations.json';

export class DecorateScene extends PIXI.Container
{
    constructor(game, robot)
    {
        super();
        this.game = game;
        this.robot = robot;
        this.decorations = [];
    }

    async preload()
    {
        PIXI.Assets.add({alias: 'wkshp', src: './assets/backgrounds/Botbuilderbackground.png'});
        PIXI.Assets.add({alias: 'spritesheet', src: './assets/spritesheets/spritesheet.json'});
        PIXI.Assets.add({alias: 'bubble', src: './assets/audio/itemPlaced.mp3'});

        this.backgroundTexture = await PIXI.Assets.load('wkshp');
        await PIXI.Assets.load(['spritesheet', 'bubble']);
    }

    start()
    {
        const scalerBackground = PIXI.Sprite.from(this.backgroundTexture);
        this.addChild(scalerBackground);

        this.itemSFX = PIXI.Assets.get('bubble');

        /*
        add buttons to navigate back and forth
        */
        let homeBtn = new button({ image: "navButtons/homeButton.png" });

        homeBtn.x = 270;
        homeBtn.y = this.game.height - homeBtn.height - 30;

        this.addChild(homeBtn);

        this.finishBtn = new button({ image: "navButtons/checkmark.png" });
        
        this.finishBtn.x = this.game.width - this.finishBtn.width - 130;
        this.finishBtn.y = this.game.height - this.finishBtn.height - 30;
        this.finishBtn.visible = false; // decoration stage not yet completed

        this.addChild(this.finishBtn);

        homeBtn.on('pointerdown', () =>
        {
            const prevScene = new TitleScene(this.game);
            this.game.application.state.scene.value = prevScene;
        });

        this.finishBtn.on('pointerdown', () =>
        {
            const nextScene = new EndScene(this.game, this.robot, this.decorations);
            this.game.application.state.scene.value = nextScene;
        });

        // add all the robot parts that were chosen in the previous scene
        for (let i = 0; i < this.robot.length; ++i) {
            this.robot[i].interactive = false;
            this.addChild(this.robot[i]);
        }

        for (const deco of decoAttrs.decos) {
            let decoPiece = new decoration({ x: deco.x, y: deco.y, image: deco.image });
            this.addChild(decoPiece);
        }

        this.children.forEach(function (child) {
            if (child instanceof decoration) {
                child.on('pointerdown', this.onDragStart);
                child.on('pointerup', this.onDragEnd);
                child.on('pointerupoutside', this.onDragStart);
            }
        }.bind(this));
    }

    onDragStart() {
        this.dragTarget = this;
        this.alpha = 0.75;
        this.on('pointermove', this.parent.onDragMove); // since this is called on each child, make sure it grabs the function from the parent file 
    }

    onDragMove(event) {

        if (this.dragTarget) {
            this.dragTarget.parent.toLocal(event.global, this.dragTarget.parent, this.dragTarget.position);
        }

        if (this.parent) {
            this.parent.addChild(this);
        }

    }

    onDragEnd() {

        if (this.dragTarget) {
            this.off('pointermove', this.parent.onDragMove);
            this.dragTarget = null;
            this.alpha = 1;
        }

        let robotCollision = null;

        for (let i = 0; i < this.parent.robot.length; ++i) {
            if (gameMath.collision(this, this.parent.robot[i])) {

                console.log("collision detected");
                
                robotCollision = this.parent.robot[i];
                this.onRobot = true;

                if (this.parent.decorations && !this.parent.decorations.includes(this)) {
                    this.parent.itemSFX.play();
                    this.parent.decorations.push(this);
                }
            }
        }

        if (!robotCollision) {
            this.x = this.initialX;
            this.y = this.initialY;

            if (this.parent.decorations && this.parent.decorations.includes(this)) {
                for (let i = 0; i < this.parent.decorations.length; ++i) {
                    if (this === this.parent.decorations[i]) {
                        this.parent.decorations.splice(i, 1); // removes element at index i and resizes array
                        // console.log("removing shape from decorations");
                    }
                }
            }
        }

        // console.log(this.parent.decorations);
    }

    update()
    {
        if (this.decorations.length === 0) {
            this.finishBtn.visible = false;
        } else {
            this.finishBtn.visible = true;
        }
    }
}