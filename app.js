document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div')
    const resultDisplay = document.querySelector('#result')
    let width = 15
    let currentShooterIndex = 202
    let currentInvaderIndex = 0
    let alienInvadersTakenDown = []
    let result = 0
    let direction = 1
    let invaderId

    //define the alien invaders
    const alienInvaders = [
        0,1,2,3,4,5,6,7,8,9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
    ]
    //draw the alien invaders
    alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'))

    //draw the shooter
    squares[currentShooterIndex].classList.add('shooter')

    //move the shooter along a line
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter') //removes shooter class from div (position)
        switch(e.key) {
            case 'ArrowLeft':
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1 //moves shooter to the left if possible
                break
            case 'ArrowRight':
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1 //moves shooter to the right if possible
                break
        }
        squares[currentShooterIndex].classList.add('shooter') //adds shooter class to new div (position)
    }
    document.addEventListener('keydown', moveShooter)

    //move the alien invaders
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0 //condition, it verifies that the left side of the invaders is touching the left side of the grid
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1 //the same condition but for the right side

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width //it its touching the side of the grid, the direction equals width so that it moves down one block
        } else if (direction === width) {
            if (leftEdge) direction = 1
            else direction = -1
        }
        for (let i = 0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove('invader')
        }
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction
        }
        for (let i = 0; i < alienInvaders.length; i++) {
            if (!alienInvadersTakenDown.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader')
            }
        }

        //decida a game over
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            resultDisplay.textContent = 'Game Over' //if an invader touches the shooter
            squares[currentShooterIndex].classList.add('boom')
            clearInterval(invaderId)
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            if (alienInvaders[i] > (squares.length - (width - 1))) {
                resultDisplay.textContent = 'Game Over' //if it touches the bottom of the grid
                clearInterval(invaderId)
            }
        }

        //decide a win
        if (alienInvadersTakenDown.length === alienInvaders.length) {
            resultDisplay.textContent = "You Have Won!"
            clearInterval(invaderId)
        }
    }
    invaderId = setInterval(moveInvaders, 500)

    //shoot at aliens
    function shoot(e) {
        let laserId
        let currentLaserIndex = currentShooterIndex
        //move the laser from the shooter to the alien invader
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add('laser')
            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.remove('invader')
                squares[currentLaserIndex].classList.add('boom')

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
                clearInterval(laserId)

                const alienTakeDown = alienInvaders.indexOf(currentLaserIndex)
                alienInvadersTakenDown.push(alienTakeDown)
                result++
                resultDisplay.textContent = result
            }
            
            if (currentLaserIndex < width) {
                clearInterval(laserId)
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
            }
        }

        /*document.addEventListener('keyup', e => {
            switch (e.key) {
                case ' ':
                    laserId = setInterval(moveLaser, 100)
            }
        })*/
        switch (e.key) {
            case ' ':
                laserId = setInterval(moveLaser, 100)
        }
    }

    document.addEventListener('keyup', shoot)
})