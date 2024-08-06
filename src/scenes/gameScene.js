import { button } from '../gameobjects/button';
import { roboPart } from '../gameobjects/roboPart';
import * as PIXI from 'pixi.js';
import { TitleScene } from './title';
import { DecorateScene } from './decorate';
import { roboFrame } from '../gameobjects/roboFrame';
import { toolbox } from '../gameobjects/toolbox';
import { BODYPARTS } from '../constants';
import { gameMath } from '../gameMath';
import roboPartAttrs from '../config/roboParts.json';

export class GameScene extends PIXI.Container
{
    constructor(game)
    {
        super();
        this.game = game;
        this.robot = []; // holds all the shapes the player picks out
    }

    async preload()
    {
        // add this lvl's bkgd
        PIXI.Assets.add({alias: 'workshopBG', src: './assets/backgrounds/Botbuilderbackground.png'});
        
        // load the textures
        await PIXI.Assets.load(['workshopBG', 'spritesheet']);
    }

    start()
    {
        const texture = PIXI.Assets.get('workshopBG');
        const scalerBackground = new PIXI.Sprite(texture);
        this.addChild(scalerBackground);

        // setting interactiveChildren here could be useful
        this.interactiveChildren = true;        

        /*
        add the robot's frame
        */
        let head = new roboFrame({ x: this.game.width / 2, y: 150, image: "roboFrameParts/bothead.png"});
        this.addChild(head);

        let body = new roboFrame({ x: this.game.width / 2, y: 150 + head.height, image: "roboFrameParts/Botbody.png"});
        this.addChild(body);

        let leftArm = new roboFrame({ x: this.game.width / 2 - body.width , y: 150 + head.height, image: "roboFrameParts/leftbotarm.png"});
        this.addChild(leftArm);

        let rightArm = new roboFrame({ x: this.game.width / 2 + body.width , y: 150 + head.height, image: "roboFrameParts/rightbotarm.png"});
        this.addChild(rightArm);

        let leftLeg = new roboFrame({ x: this.game.width / 2 - body.height / 2, 
                                        y: 200 + head.height + body.height, image: "roboFrameParts/leftbotleg.png"});
        this.addChild(leftLeg);

        let rightLeg = new roboFrame({ x: this.game.width / 2  + body.height / 2, 
                                        y: 200 + head.height + body.height, image: "roboFrameParts/rightbotleg.png"});
        this.addChild(rightLeg);

        /*
        add toolboxes
        */
        let headBox = new toolbox({x: 450, y: this.game.height - 100,  
                                    closedBox: "toolboxes/headtoolbox.png", openBox: "toolboxes/headtoolboxOpen.png", 
                                    type: BODYPARTS.HEAD});
        this.addChild(headBox);

        let bodyBox = new toolbox({x: 600, y: this.game.height - 100,  
                                    closedBox: "toolboxes/bodyBoxClosed.png", openBox: "toolboxes/bodyBoxOpen.png", 
                                    type: BODYPARTS.BODY});
        this.addChild(bodyBox);

        let armBox = new toolbox({x: 750, y: this.game.height - 100,  
                                    closedBox: "toolboxes/armBoxClosed.png", openBox: "toolboxes/armBoxOpen.png", 
                                    type: BODYPARTS.ARM});
        this.addChild(armBox);

        let legBox = new toolbox({x: 900, y: this.game.height - 100,  
                                    closedBox: "toolboxes/legBoxClosed.png", openBox: "toolboxes/legBoxOpen.png", 
                                    type: BODYPARTS.LEG});
        this.addChild(legBox);

        /*
        add roboParts
        */
        let hexagon = new roboPart({ x: 900, y: 100, image: "shapes/hexagon.png", shape: 'hexagon', type: BODYPARTS.HEAD });
        this.addChild(hexagon);

        let star = new roboPart({ x: 250, y: 400, image: "shapes/star.png", type: BODYPARTS.HEAD });
        this.addChild(star);

        let square = new roboPart({ x: 300, y: 180, image: "shapes/whitesquare120x120.png", type: BODYPARTS.HEAD});
        square.tint = 0xa608c9;
        this.addChild(square);

        let square2 = new roboPart({ x: 1000, y: 380, image:"shapes/whitesquare120x120.png", type: BODYPARTS.HEAD});
        square2.tint = 0x31ad3f;
        this.addChild(square2);

        let star2 = new roboPart({ x: 250, y: 400, image: "shapes/star.png", type: BODYPARTS.BODY });
        star2.tint = 0xa763ff;
        this.addChild(star2);

        let hex2 = new roboPart({ x: 900, y: 100, image: "shapes/hexagon.png", type: BODYPARTS.ARM });
        hex2.tint = 0xa763ff;
        this.addChild(hex2);

        let square3 = new roboPart({ x: 1000, y: 380, image: "shapes/whitesquare120x120.png", type: BODYPARTS.LEG});
        square3.tint = 0xf542cb;
        this.addChild(square3);

        // this.addChild(JSON.parse(arms));
        for (const arm of roboPartAttrs.arms) {
            let armPart = new roboPart({ x: arm.x, y: arm.y, image: arm.image, type: arm.type });
            this.addChild(armPart);
        }

        /*
        now add buttons to navigate back and forth
        */
        let homeBtn = new button({ image: "navButtons/homeButton.png" });

        homeBtn.x = 270;
        homeBtn.y = this.game.height - homeBtn.height - 30;

        this.addChild(homeBtn);

        this.nextBtn = new button({ image: "navButtons/nextArrow.png" });
        
        this.nextBtn.x = this.game.width - this.nextBtn.width - 130;
        this.nextBtn.y = this.game.height - this.nextBtn.height - 30;
        this.nextBtn.visible = false; // player hasn't completed robot yet

        this.addChild(this.nextBtn);

        homeBtn.on('pointerdown', () =>
        {
            const prevScene = new TitleScene(this.game);
            this.game.application.state.scene.value = prevScene;
        });

        this.nextBtn.on('pointerdown', () =>
        {
            const nextScene = new DecorateScene(this.game, this.robot);
            this.game.application.state.scene.value = nextScene;
        });

        /*
        add interactions
        */
        this.dragTarget = null; // track shapes being dragged
        this.currToolbox = null; // track toolboxes being opened/closed

        // turn on listeners
        this.children.forEach(function (child) { 
            if (child instanceof roboPart) {

                console.log(child);
                // if (child.type === BODYPARTS.ARM) {
                //     console.log(child);
                // }

                child.on('pointerdown', this.onDragStart);

                child.on('pointerup', this.onDragEnd);
                child.on('pointerupoutside', this.onDragEnd);

                // if (child.onFrame) {
                //     child.on('pointertap', this.onDoubleTap);
                // }

            } else if (child instanceof toolbox) {
                child.on('pointerdown', this.onClick);
            }
        }.bind(this));

    }

    
    update(ticker) {

        this.children.forEach(child => {

            if (child instanceof roboPart || child instanceof toolbox) {
                child.update(ticker); // calls update from roboPart or toolbox class
            }

            if (child instanceof toolbox) {
                if (child.open) {
                    switch(child.type) {
                        case BODYPARTS.HEAD:
                            this.displayParts(BODYPARTS.HEAD);
                            break;
                        case BODYPARTS.BODY:
                            this.displayParts(BODYPARTS.BODY);
                            break;
                        case BODYPARTS.ARM:
                            this.displayParts(BODYPARTS.ARM);
                            break;
                        case BODYPARTS.LEG:
                            this.displayParts(BODYPARTS.LEG);
                            break;
                    }
                } else {
                    this.hideShapes(child);
                }
            }
        
        });

        if (this.robot.length === 6) {
            this.nextBtn.visible = true;
        } else {
            this.nextBtn.visible = false;
        }

    }
    
    onDragStart() {
        this.dragTarget = this;
        this.alpha = 0.75;
        this.on('pointermove', this.parent.onDragMove); // since this is called on each child, make sure it grabs the function from the parent file 

        // if the shape we're dragging currently belongs to a roboFrame, make sure it no longer does
        // also, restore the frame's opacity
        this.parent.children.forEach(child => {
            if (child instanceof roboFrame) {
                if (child.currentShape === this) {
                    child.currentShape = null;
                    child.alpha = 1;
                    child.onFrame = false;
                }
            }
        });
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
            this.dragTarget = null;
            this.alpha = 1;
        }

        let closestDistance = null;
        let closestObject = null;

        this.parent.children.forEach(child => {

            if (child instanceof roboFrame) {

                if (gameMath.collision(this, child)) { // if the roboFrame is colliding with a roboPart

                    // calculate the distance between the two objects
                    let distance = gameMath.calculateDistance(this, child);

                    if(closestDistance === null || distance < closestDistance) {
                        closestDistance = distance;
                        closestObject = child;
                    }

                } else {
                    
                    // if the current shape being dragged is no longer colliding with a roboFrame, return it to its og position
                    if (child.currentShape === this) {
                        child.currentShape = null; // additionally, the roboFrame no longer has a shape on it
                        this.x = this.initialX;
                        this.y = this.initialY;
                    }

                } 

            }

        });

        // if the target roboFrame already has a shape on it, return the shape on it back to its og position
        if (closestObject && closestObject.currentShape) {
            closestObject.currentShape.x = closestObject.currentShape.initialX;
            closestObject.currentShape.y = closestObject.currentShape.initialY;
            closestObject.currentShape.onFrame = false;

            if (this.parent.robot && this.parent.robot.includes(closestObject.currentShape)) {
                for (let i = 0; i < this.parent.robot.length; ++i) {
                    if (closestObject.currentShape === this.parent.robot[i]) {
                        this.parent.robot.splice(i, 1); // removes 1 element starting at index i and resizes array
                    }
                }
            }
        }

        // if there was a closest roboFrame calculated, stick the roboPart to it 
        // also, update its currentShape and make the frame transparent
        if (closestObject) {

            this.x = closestObject.x;
            this.y = closestObject.y;
            closestObject.currentShape = this;
            closestObject.alpha = 0;
            this.onFrame = true;

            if (this.parent.robot && !this.parent.robot.includes(this)) {
                this.parent.robot.push(this);
            }
            
        } else { // otherwise, the roboPart was dropped outside with no collision, so bring it back to its og position
            this.x = this.initialX;
            this.y = this.initialY;
            this.onFrame = false;

            if (this.parent.robot && this.parent.robot.includes(this)) {
                for (let i = 0; i < this.parent.robot.length; ++i) {
                    if (this === this.parent.robot[i]) {
                        this.parent.robot.splice(i, 1); // removes element at index i and resizes array
                    }
                }
            }
        }

    }

    onClick() {

        // if the box is closed, open it... otherwise, close it
        if (!this.open) {
            if (this.parent.currToolbox) { // check if there's already an open toolbox before opening this one: if so, close that one
                this.parent.currToolbox.open = false;
                this.parent.currToolbox.texture = this.parent.currToolbox.closedTexture;
            }
            this.open = true;
            this.texture = this.openTexture;
            this.parent.currToolbox = this;
        } else {
            this.open = false;
            this.texture = this.closedTexture;
            this.parent.currToolbox = null;
        }
        
    }

    displayParts(roboPartType) {
        this.children.forEach(child => {
            if (child instanceof roboPart) {
                if (child.type === roboPartType) {
                    child.visible = true;
                }
            }
        });
    }

    hideShapes(toolbox) {

        this.children.forEach (child => {
            if (child instanceof roboPart) {
                if (child.type === toolbox.type && !child.onFrame) {
                    child.visible = false;
                }
            }
        });
        
    } 

    /*
    addArms() {
        let arms = [arm1, arm2, arm3];

        arm1 = new roboPart({ x: 0, y: 0, image: 'xxx.png', type: BODYPARTS.ARM });
        arm2 = new roboPart({ x: 0, y: 0, image: 'yyy.png', type: BODYPARTS.ARM });

    }
    */
    
    // add a dsstore, stores stuff that happens to the directory for mac os
    // look into containers and display objects: graphical objects that can be moved around

    // to be fixed: if you drag off a shape and its toolbox is closed, open its home toolbox before returning it
}