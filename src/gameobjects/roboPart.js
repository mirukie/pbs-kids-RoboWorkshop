import * as PIXI from 'pixi.js';

export class roboPart extends PIXI.Sprite
{
    // why is it formtted this way? instead of just x, y, shape
    constructor({ x = 0, y = 0, image = 'null', shape = 'null', type = 'null' } = {})
    {
        const texture = PIXI.Assets.get(image);
        super(texture);

        this.initialX = x;
        this.initialY = y;

        this.shape = shape; // to help with debugging

        this.type = type;
        this.onFrame = false; // not yet attached to the frame

        this.anchor.set(0.5, 0.5);
        this.position.set(x, y);

        this.eventMode = 'static'; // allows the shapes to be interactive
        this.cursor = 'pointer'; // on mouse over (i.e. when the cursor is over the object)... change its appearance to one that shows that there's a click/drag interaction
    
        this.visible = false; // shapes will not be shown because toolboxes have not been opened yet
    }
    
    update()
    {
        // nothing to keep track of
    }
    
    // have a draggable class that robopart inherits from?
    // this would be done on the scene level :3
    // move this to the gamescene
    // since the scene is what has all the draggable objects
    
}