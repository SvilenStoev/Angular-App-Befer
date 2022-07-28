export const spaceshipUrl = '../../../../assets/images/spaceship.png';
export const alienUrl = '../../../../assets/images/alien.png';
export const bombUrl = '../../../../assets/images/bomb.png';
export const bossBombUrl = '../../../../assets/images/boss-bomb.png';
export const collisionUrl = '../../../../assets/images/collision.png';

//bonuses
export const doubleFireUrl = '../../../../assets/images/bonus-double-fire.png';
export const aimBonusUrl = '../../../../assets/images/bonus-aim.png';
export const invisibleBonusUrl = '../../../../assets/images/bonus-invisible.png';

//boss
export const bossAlienUrl = '../../../../assets/images/boss-alien.png';

export const objects = {
    spaceship: {
        x: -180,
        y: 300,
        speed: 7,
        boostSpeed: 0,
        width: 149,
        height: 86,
        aliensKilled: 0,
        aliensMissed: 0,
        initHealthPoints: 5000,
        healthPoints: 5000,
        bonuses: {
            doubleFire: false,
            aim: false,
            invisible: false,
        } as any
    },
    alien: {
        x: 100,
        width: 77,
        height: 53,
        speed: 2,
        nextCreation: 0,
        creationInterval: 2500,
        healthPoints: 200,
    },
    bossAlien: {
        x: 2000,
        y: 200,
        width: 342,
        height: 288,
        speed: 3,
        initHealthPoints: 100000,
        healthPoints: 100000,
    },
    bomb: {
        width: 85,
        height: 22,
        speed: 12,
        fireInterval: 500,
        nextFire: 0,
    },
    bossBomb: {
        width: 68,
        height: 77,
        speed: 6,
        fireInterval: 650,
        nextFire: 0,
        trippleFireInterval: 6000,
        nextTrippleFire: 0,
    },
    doubleFireBonus: {
        x: 100,
        width: 56,
        height: 82,
        speed: 3,
        nextCreation: 8000,
        creationInterval: 80000,
        timeLast: 10000
    },
    aimBonus: {
        width: 50,
        height: 50,
        nextCreation: 18000,
        creationInterval: 100000,
        timeLast: 15000
    },
    invisibleBonus: {
        width: 60,
        height: 48,
        nextCreation: 30000,
        creationInterval: 120000,
        timeLast: 12000
    }
}
