export class gameMath {

    // static keyword allows functions to be used without instantiating class
    // it asserts that the functions act the same across all instantions

    static calculateDistance(object1, object2) {
        return Math.sqrt(Math.pow(object1.x - object2.x, 2) + Math.pow(object1.y - object2.y, 2));
    }

    static collision(object1, object2) {
        // return (object1.x + object1.width > object2.x) && (object1.x < object2.x + object2.width)
        //     && (object1.y + object1.height > object2.y) && (object1.y < object2.y + object2.height);

        // rob's collision for centered x/y since anchor pts are at 0.5, 0.5
        const object1Left = object1.x - (object1.width / 2);
        const object1Right = object1.x + (object1.width / 2);
        const object1Top = object1.y - (object1.height / 2);
        const object1Bottom = object1.y + (object1.height / 2);

        const object2Left = object2.x - (object2.width / 2);
        const object2Right = object2.x + (object2.width / 2);
        const object2Top = object2.y - (object2.height / 2);
        const object2Bottom = object2.y + (object2.height / 2);

        return (object1Right > object2Left) && (object1Left < object2Right)
            && (object1Bottom > object2Top) && (object1Top < object2Bottom);
    }

}
