const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const startMenu = document.getElementById("start-menu");
const gameOverMenu = document.getElementById("game-over-menu");
const startHelpButton = document.getElementById("start-help-button");
const endHelpButton = document.getElementById("end-help-button");
const helpMenu = document.getElementById("help-menu");
const gameContainer = document.getElementById("gameContainer");
const restartButton = document.getElementById("restart-button");
/*const startMenu = document.getElementById('startMenu');
const winMenu = document.getElementById('winMenu');
const gameCanvas = document.getElementById('gameCanvas');
const context = gameCanvas.getContext('2d');

startMenu.addEventListener('click', startGame);
winMenu.addEventListener('click', restartGame);

function startGame() {
  // Startmenü ausblenden
  startMenu.style.display = 'none';
  
  // Spiellogik hier einfügen
}

function restartGame() {
  // Gewinnmenü ausblenden
  winMenu.style.display = 'none';
  
  // Spiel zurücksetzen und erneut starten
}

function startGame() {
  // Startmenü ausblenden
  startMenu.style.display = 'none';*/

const scoreEl = document.querySelector('#scoreEl')
console.log(scoreEl)

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor({ position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 
            Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Ghost {
    static speed = 2
    constructor({ position, velocity, color = 'red' }) {
        this.position = position
        this.velocity = velocity
        this.radius = 0
        this.color = color
        this.prevCollisions = []
        this.speed = 2
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 
            Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 
            Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
}

const pellets = []
const boundaries = []
const ghosts = [
    new Ghost({
        position: {
            x:Boundary.width * 6 + Boundary.width / 2,
            y:Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
        
    })
]
const player = new Player({
    position: {
        x:Boundary.width + Boundary.width / 2,
        y:Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y:0
    }
})
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ''
let score = 0

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'], 
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'], 
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src) {
const image = new Image()
image.src = src
return image
}


map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
              boundaries.push(
                new Boundary({
                  position: {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                  },
                  image: createImage('./images/pipeHorizontal.png')
                })
              )
              break
                    case '|':
                      boundaries.push(
                        new Boundary({
                          position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                          },
                          image: createImage('./images/pipeVertical.png')
                        })
                      )
                      break
                      case '1':
                        boundaries.push(
                          new Boundary({
                            position: {
                              x: Boundary.width * j,
                              y: Boundary.height * i
                            },
                            image: createImage('./images/pipeCorner1.png')
                          })
                        )
                        break
                        case '2':
                            boundaries.push(
                              new Boundary({
                                position: {
                                  x: Boundary.width * j,
                                  y: Boundary.height * i
                                },
                                image: createImage('./images/pipeCorner2.png')
                              })
                            )
                            break
                            case '3':
                                boundaries.push(
                                  new Boundary({
                                    position: {
                                      x: Boundary.width * j,
                                      y: Boundary.height * i
                                    },
                                    image: createImage('./images/pipeCorner3.png')
                                  })
                                )
                                break
                                case '4':
                                    boundaries.push(
                                      new Boundary({
                                        position: {
                                          x: Boundary.width * j,
                                          y: Boundary.height * i
                                        },
                                        image: createImage('./images/pipeCorner4.png')
                                      })
                                    )
                                    break
                                    case 'b':
                                        boundaries.push(
                                          new Boundary({
                                            position: {
                                              x: Boundary.width * j,
                                              y: Boundary.height * i
                                            },
                                            image: createImage('./images/block.png')
                                          })
                                        )
                                        break
                                        case '[':
                                            boundaries.push(
                                              new Boundary({
                                                position: {
                                                  x: Boundary.width * j,
                                                  y: Boundary.height * i
                                                },
                                                image: createImage('./images/capLeft.png')
                                              })
                                            )
                                            break
                                            case ']':
                                                boundaries.push(
                                                  new Boundary({
                                                    position: {
                                                      x: Boundary.width * j,
                                                      y: Boundary.height * i
                                                    },
                                                    image: createImage('./images/capRight.png')
                                                  })
                                                )
                                                break
                                                case '_':
                                                    boundaries.push(
                                                      new Boundary({
                                                        position: {
                                                          x: Boundary.width * j,
                                                          y: Boundary.height * i
                                                        },
                                                        image: createImage('./images/capBottom.png')
                                                      })
                                                    )
                                                    break
                                                    case '^':
                                                        boundaries.push(
                                                          new Boundary({
                                                            position: {
                                                              x: Boundary.width * j,
                                                              y: Boundary.height * i
                                                            },
                                                            image: createImage('./images/CapTop.png')
                                                          })
                                                        )
                                                        break
                                                        case '+':
                                                            boundaries.push(
                                                              new Boundary({
                                                                position: {
                                                                  x: Boundary.width * j,
                                                                  y: Boundary.height * i
                                                                },
                                                                image: createImage('./images/pipeCross.png')
                                                              })
                                                            )
                                                            break
                                                            case '5':
                                                                boundaries.push(
                                                                  new Boundary({
                                                                    position: {
                                                                      x: Boundary.width * j,
                                                                      y: Boundary.height * i
                                                                    },
                                                                    image: createImage('./images/pipeConnectorTop.png')
                                                                  })
                                                                )
                                                                break
                                                                case '6':
                                                                    boundaries.push(
                                                                      new Boundary({
                                                                        position: {
                                                                          x: Boundary.width * j,
                                                                          y: Boundary.height * i
                                                                        },
                                                                        image: createImage('./images/pipeConnectorRight.png')
                                                                      })
                                                                    )
                                                                    break
                                                                    case '7':
                                                                        boundaries.push(
                                                                          new Boundary({
                                                                            position: {
                                                                              x: Boundary.width * j,
                                                                              y: Boundary.height * i
                                                                            },
                                                                            image: createImage('./images/pipeConnectorBottom.png')
                                                                          })
                                                                        )
                                                                        break
                                                                        case '8':
                                                                            boundaries.push(
                                                                              new Boundary({
                                                                                position: {
                                                                                  x: Boundary.width * j,
                                                                                  y: Boundary.height * i
                                                                                },
                                                                                image: createImage('./images/pipeConnectorLeft.png')
                                                                              })
                                                                            )
                                                                            break
                                                                            case '.':
                                                                                pellets.push(
                                                                                  new Pellet({
                                                                                    position: {
                                                                                      x: Boundary.width * j + Boundary.width / 2,
                                                                                      y: Boundary.height * i + Boundary.height / 2
                                                                                    }
                                                                                  })
                                                                                )
                                                                                break
        }
    })
})

function circleCollidesWithRectangle({circle, rectangle}) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y <= 
        rectangle.position.y + rectangle.height + padding && 
        circle.position.x + circle.radius + circle.velocity.x >= 
        rectangle.position.x - padding && 
        circle.position.y + circle.radius + circle.velocity.y >= 
        rectangle.position.y - padding && 
        circle.position.x - circle.radius + circle.velocity.x <=
         rectangle.position.x + rectangle.width + padding
        )
}

let animationId

function animate() {
    animation = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if(
            circleCollidesWithRectangle({
            circle : {
                ...player, 
                velocity: {
                x: 0,
                y: -5
            }},
            rectangle : boundary
            })
            ) {
                player.velocity.y = 0
                break
            }   else {
                player.velocity.y = -5
            }
        }   
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if(
            circleCollidesWithRectangle({
            circle : {
                ...player, 
                velocity: {
                x: -5,
                y: 0
            }},
            rectangle : boundary
            })
            ) {
                player.velocity.x = 0
                break
            }   else {
                player.velocity.x = -5
            }
        } 
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if(
            circleCollidesWithRectangle({
            circle : {
                ...player, 
                velocity: {
                x: 0,
                y: 5
                }
            },
            rectangle : boundary
        })
            ) {
                player.velocity.y = 0
                break
            }   else {
                player.velocity.y = 5
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if(
            circleCollidesWithRectangle({
            circle : {
                ...player, 
                velocity: {
                x: 5,
                y: 0
            }},
            rectangle : boundary
            })
            ) {
                player.velocity.x = 0
                break
            }   else {
                player.velocity.x = 5
            }
        } 
    }

    // win condition goes here 
    if (pellets.length === 1) {
      endGame();
    }
    //touch pellets here
    for (let i = pellets.length -1; 0 < i; i--) {
    const pellet = pellets[i]
    pellet.draw()

    if (
        Math.hypot(
        pellet.position.x - player.position.x, 
        pellet.position.y - player.position.y
        ) <
        pellet.radius + player.radius
        ) {
      //  console.log('touching')
        pellets.splice(i, 1)
        score += 1
        scoreEl.innerHTML = score
    }

        }
       
    boundaries.forEach((boundary) => {
        boundary.draw()

        if (
            circleCollidesWithRectangle({
            circle : player,
            rectangle : boundary
            })
        ) {
        player.velocity.x = 0
        player.velocity.y = 0
         }          
})
    player.update()

 ghosts.forEach(ghost => {
    ghost.update()

    let collisions = []
    boundaries.forEach(boundary => {
      if(
        !collisions.includes('right') &&
        circleCollidesWithRectangle({
        circle : {
            ...ghost, 
            velocity: {
            x: ghost.speed,
            y: 0
        }},
        rectangle : boundary
        })
        ) {
          collisions.push('right')
        }
        if(
          !collisions.includes('left') &&
          circleCollidesWithRectangle({
          circle : {
              ...ghost, 
              velocity: {
              x: -ghost.speed,
              y: 0
          }},
          rectangle : boundary
          })
          ) {
            collisions.push('left')
          }
          if(
            !collisions.includes('up') &&
            circleCollidesWithRectangle({
            circle : {
                ...ghost, 
                velocity: {
                x: 0,
                y: -ghost.speed
            }},
            rectangle : boundary
            })
            ) {
              collisions.push('up')
            }
          if(
            !collisions.includes('down') &&
            circleCollidesWithRectangle({
            circle : {
                ...ghost, 
                velocity: {
                x: 0,
                y: ghost.speed 
            }
          },
            rectangle : boundary
            })
            ) {
              collisions.push('down')
            }    
    })
    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions
    }
    

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.
      prevCollisions)) {
    //  console.loge('gogo')

      
      if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')

      else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

    //  console.log(collisions)
     // console.log(ghost.prevCollisions)

      const pathways = ghost.prevCollisions.filter((collisions
        ) => {
          return collisions.includes(collisions)
        })
     //   console.log({pathways})
        
        const direction = pathways[Math.floor(Math.random() * 
          pathways.length)]

      // console.log({direction})

        switch (direction) {
          case 'down':
            ghost.velocity.y = ghost.speed
            ghost.velocity.x = 0
            break

          case 'up':
            ghost.velocity.y = -ghost.speed
            ghost.velocity.x = 0
            break

          case 'right':
            ghost.velocity.y = 0
            ghost.velocity.x = ghost.speed
            break

          case 'left':
            ghost.velocity.y = 0
            ghost.velocity.x = -ghost.speed
            break
            }

            
          }    
           //   console.log(collision)
 })

}


// animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true   
            lastKey = 'a'         
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }

    
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }

   // console.log(keys.d.pressed)
   // console.log(keys.s.pressed)
})

function startGame() {
  // Hide the start menu
  startMenu.classList.add("hidden");

  // Show the game container
  document.getElementById("gameContainer").classList.remove("hidden");

  // Start the game logic
  animate();
}

function endGame() {

  // Show the game over menu
  gameOverMenu.classList.remove("hidden");

  // Display final score
  


  // Hide the game container
  document.getElementById("gameContainer").classList.add("hidden");
}

function resetGame() {
  location.reload()
}

function showHelpMenu() {
  // Show the help menu
  const helpMenu = document.getElementById("help-menu");
  helpMenu.classList.remove("hidden");

function showPreviousMenu() {
  // Hide the help menu
  helpMenu.classList.add("hidden");
}

  // Add event listener to the back button
  const backButton = helpMenu.querySelector("#back-button");
  backButton.addEventListener("click", showPreviousMenu);
}
document.getElementById("start-button").addEventListener("click", startGame);
restartButton.addEventListener("click", () => {
  resetGame();
});
startHelpButton.addEventListener("click", showHelpMenu);
endHelpButton.addEventListener("click", showHelpMenu);

/*resetGame();
}

function winGame() {
  // Überprüfe, ob das Spiel gewonnen wurde
  // Zeige das Gewinnmenü an
  winMenu.style.display = 'block';
}*/


    



