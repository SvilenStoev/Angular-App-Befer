export const initState = {
    userScores: {
        aliensKilled: 0,
        aliensMissed: 0,
        timeRemaining: 0,
        boostRemaining: 0,
        points: 0,
        totalPoints: 0,
        healthRemaining: 0
    },
    state: {
        level: 1,
        levelsRange: {
            2: 3000,
            3: 7000,
            4: 12000,
            5: 18000,
            6: 25000,
            7: 33000,
        },
        points: 0,
        openMenu: false,
        isPaused: false,
        hasBonuses: false,
        gameOver: false,
        gameWon: false,
        isBossMode: false,
        keys: {
            'KeyW': false,
            'KeyS': false,
            'KeyD': false,
            'KeyA': false,
            'KeyP': false,
            'KeyM': false,
            'ArrowUp': false,
            'ArrowLeft': false,
            'ArrowDown': false,
            'ArrowRight': false,
            'ShiftLeft': false,
            'Space': false,
            'NumpadEnter': false
        },
    } as any,
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
        }
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
        creationInterval: 100000,
        timeLast: 10000
    },
    aimBonus: {
        width: 50,
        height: 50,
        nextCreation: 18000,
        creationInterval: 120000,
        timeLast: 15000
    },
    invisibleBonus: {
        width: 60,
        height: 48,
        nextCreation: 30000,
        creationInterval: 150000,
        timeLast: 12000
    }
}