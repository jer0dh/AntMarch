/*
Programming inspired while reading 'Genetic Algorithms and Machine Learning for Programmers' by Frances Buontempo
*/

const time = 500;
const maxRows = 15;
const maxWidth = 15;

const numberOfAnts = 5;
const numberOfEpochs = 5;
const maxMovesPerEpochPerAnt = 300;
const Q = 2 * maxRows; //Constant to scale the quality of a path. pg 84
const P = 0.25; //Rate of pheromone evaporation. pg 84
const paths = [numberOfAnts];
const pathInfo = [numberOfAnts];
//initialize pathInfo
for(let i=0; i<numberOfAnts;i++) {
  pathInfo[i] = {
    
  }
}
const pheromones = [ maxRows * maxWidth ];
/* Initialize */
for(let i=0; i< maxRows * maxWidth; i++) {
  pheromones[i] = 0.0001
}

for(let epoch=0; epoch<numberOfEpochs; epoch++) {
  
  
  //Create Paths based on numberOfAnts
  for(let ant=0; ant<numberOfAnts; ant++){
    //ant starts at bottom middle
    let x = Math.floor( maxWidth / 2)
    let y = maxRows - 1;

    //create path
    paths[ant]= []
    paths[ant].push( getIndex( x, y ))
    let counter = 0
    while( counter < maxMovesPerEpochPerAnt && ! madeIt( x, y) ) {
      let neighbors = getNeighbors(x, y)
      //get last coordinates from ant path and remove from neighbors
      //so ant does not backtrack
      let pos = neighbors.indexOf(paths[ant][paths[ant].length-2])
      if (pos>-1) { //if found, remove
        neighbors.splice( pos, 1);
      }
      let nextIndex = pickNext(neighbors)
      paths[ant].push( nextIndex );
      let newCoord = getCoordinates( nextIndex );
      x = newCoord.x
      y = newCoord.y
      ++counter; 
    }
  }
  //paths created time to update pheromones
  evaporatePheromones(pheromones)
  updatePheromones(paths, pheromones)
}

for(let i=0; i<paths.length; i++) {
  const grid = document.createElement('div')
  grid.classList.add('path')
  grid.classList.add('path' + i)
  document.querySelector('body').append(grid)
  createDom(grid)
  updateGridStyle(grid)
  drawPath(paths[i],grid)
 // updatePheromones(paths, pheromones)
}

const aGrid = document.querySelector('.path1')
//const aGrid2 = document.querySelector('.path2')
addPheromonesToGrid(aGrid)
//evaporatePheromones(pheromones)
//addPheromonesToGrid(aGrid2)
console.log('done');


function updatePheromones(paths, pheromones) {
 
  for(let i=0; i<paths.length; i++) {
    let pathLength = paths[i].length;
    if(pathLength < maxMovesPerEpochPerAnt) { //update pheromones!

      for(let j=0; j<paths[i].length; j++) {
        
        let c = getCoordinates(paths[i][j])
        pheromones[paths[i][j]] += (Q + j)/ pathLength  //page 84
      }
    }
  }
}
/* 
NOTES: with formula equal to p = p + Q / pathLength the paths didn't get much farther then two squares past the starting point as the pheromones would be the strongest there.

Tried making it p + (Q + j*9)/pathLength to make the end of the path of stronger pheromones.  Minimal help

*/
function evaporatePheromones(pheromones) {
  for(let i=0; i<pheromones.length; i++) {
    pheromones[i] *= (1 - P); //page 84
  }
}

//formulate/pick next neighbor index
function pickNext( neighbors ){
  
  //get sum of surrounding pheromones
  let sum = neighbors.reduce( (total, index) => {
    return total + pheromones[index]
  },0)
  //console.log(sum)
  //if sum is too low then randomly pick
  if(sum < 0.002) {
    return neighbors[Math.floor(Math.random()*neighbors.length)]
  }
  //calulate each neighbor's pheromone percentage
  let percentage = neighbors.map( index => {
    return pheromones[index]/sum
  })

  //assign percentage with neighbor index
  let neighborObjects = [];
  neighbors.forEach( (n, i)=>{
    neighborObjects.push( {
      index: n,
      percentage: pheromones[n]
    })
  } )
  //sort based on percentage
  neighborObjects = neighborObjects.sort( (a,b) => {
    if(b.percentage < a.percentage ) {
      return 1
    } else if( b.percentage > a.percentage ) {
      return -1
    } else {
      return 0
    }
  })
  const randomValue = Math.random();
  
  neighborObjects.forEach( x => {
    if (randomValue < x.percentage ) {
      return x.index;
    }
  })
  //return last index with largest percentage
  return neighborObjects[neighborObjects.length-1].index
}

const parent = document.querySelector('.parent')

//addIndexesToGrid(parent)
//drawPath(testPath, parent)


//Returns an array of neighbor indexes from coordinates.  
function getNeighbors(x, y) {
  // 8 possible vectors
  const vectors = [ {x:-1, y:-1}, {x:0, y:-1}, {x:1, y:-1}, {x:-1, y:0}, {x:1, y:0}, {x:-1, y:1}, {x:0, y:1}, {x:1, y:1}]
  const neighbors = [];
  
  vectors.forEach( v => {
    let newX = x + v.x
    let newY = y + v.y
    if(isValidCoordinate(newX, newY)) {
      neighbors.push( getIndex( newX, newY ))
    }
  })  
  return neighbors
}

//Tests if coordinates exists
function isValidCoordinate( x, y) {
  if(x < 0 || y < 0 || x >= maxWidth || y >= maxRows ) {
    return false
  }
  return true
}

//Return true if ant has reached destination
function madeIt( x, y) {
  if( y === 0 ) {
    return true
  }
}

function drawPath( path, target ) {
  path.forEach( p => {
    target.querySelector('.cell'+p).classList.add('ant')
  })
}
function drawPath2 (path, target) {
  path.forEach( (p,i) => {
    setInterval( function() {
      target.querySelector('.cell'+p).classList.add('ant')
    }, 500 * i)
  })
} 

function clearAnts(target){
  target.querySelectorAll('.cell').forEach( cell => {
    cell.classList.remove('ant')
  })
}

function getIndex( x, y ) {
  return y*maxWidth + x;
}
function getCoordinates( index ) {
  return { x: (index % maxWidth), y: Math.floor( index / maxWidth ) }
}

function createDom(target) {
    const numberOfCells = maxRows * maxWidth;
  
    for(let i=0; i<numberOfCells; i++) {
    //calculate coordinates

    const element = document.createElement("div");
    element.classList.add('cell');
    element.classList.add( 'cell' + i)
    target.appendChild(element);
  }
}

function updateGridStyle(target) {
  target.style.display='grid'
  target.style.gridTemplateColumns = 'repeat('+maxWidth+', 1fr)'
    target.style.gridTemplateRows = 'repeat('+maxRows+', 1em)'
  target.querySelectorAll('.cell').forEach( e => {
    e.style.border = '1px solid #000'
  })
}

function addIndexesToGrid(target) {
  const numberOfCells = maxRows * maxWidth;
  
  for(let i=0; i<numberOfCells; i++) {
    const element = document.createElement("span");
    element.classList.add("cell-index");
    element.textContent = '(' + i +')';
    target.querySelector('.cell'+i).appendChild(element);
  }

}

function addPheromonesToGrid(target) {
  const numberOfCells = maxRows * maxWidth;
  
  for(let i=0; i<numberOfCells; i++) {
    const element = document.createElement("span");
    element.classList.add("pheromones");
    element.textContent = Math.floor(pheromones[i]*100);
    target.querySelector('.cell'+i).appendChild(element);
  }

}
