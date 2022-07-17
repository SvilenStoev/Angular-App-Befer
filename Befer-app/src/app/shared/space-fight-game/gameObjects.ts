export const spaceshipUrl = '../../../../assets/images/spaceship.png';
export const alienUrl = '../../../../assets/images/alien.png';
export const bombUrl = '../../../../assets/images/bomb.png';
export const doubleFireUrl = '../../../../assets/images/bonus-double-fire.png';

export const spaceship = {
    x: -180,
    y: 300,
    speed: 7,
    width: 149,
    height: 86,
    entered: false,
    bonuses: {
        doubleFire: false,
    }
};

export const alien = {
    x: 100,
    width: 77,
    height: 53,
    speed: 2,
    nextCreation: 0,
    creationInterval: 2500,
    pointsToKill: 200,
}

export const bomb = {
    width: 73,
    height: 25,
    speed: 12,
    fireInterval: 500,
    nextFire: 0,
}

export const doubleFireBonus = {
    x: 100,
    width: 56,
    height: 82,
    speed: 3,
    nextCreation: 0,
    creationInterval: 80000,
    timeLast: 10000
}