//===================== Global Variables =================
var floorSequence = [];

//===================== Main Functions ===================

// Call Lift to Floor
function callLiftTo( direction, gotoFloor ) {
    var startingPoint = 88, target = 0;
    var lift = document.getElementById( 'lift' );
    var top = parseInt( lift.style.top ) || startingPoint;

    if ( !gotoFloor && !floorSequence.length ) {
        var switches = document.getElementsByClassName( 'directionButtons' );
        for(var i = 0; i < switches.length; i++){
            switches[i].removeAttribute( 'style' );
            toggleButtons('directionButtons', i, false);
        }
        return false;
    }

    direction = direction || 'upward';
    if( direction === 'upward' ) {
        if( top === -962 ){
            return false;
        }
        else {
            glowFloorNumber('directionButtons', 0, 'red', 'white');
            toggleButtons('directionButtons', 1, true);
        }
    }
    else {
        if( top === 1110 || top === 88 ){
            return false;
        }
        else {
            glowFloorNumber( 'directionButtons', 1, 'red', 'white' );
            toggleButtons( 'directionButtons', 0, true );
        }
    }

    floorSequence = floorSequence.sort
    (function ( a, b ) {
        return ( direction === 'upward' ) ? a - b : b - a;
    });

    var floor = floorSequence.shift() || gotoFloor;
    ( floor === -1 ) ? floor = 0 : floor;
    glowFloorNumber('number', 5 - floor, 'red', 'white');
    target = calculateTop(startingPoint, 200, floor);

    setTimeout(function () {
        animateLift( lift, top, target, direction );
        glowFloorNumber( 'number', 5 - floor, 'lightpink', 'gray' );
    }, 3000);
}

// Set Floor Number
function setFloorNumber(floor){
    if(!floorSequence.length) {
        floorSequence.push(floor);
    }
    else {
        var found = floorSequence.indexOf(floor);
        if(found === -1){
            floorSequence.push(floor);
        }
    }
    console.log('floorSequence: ', floorSequence);
    var floorNo = ( floor === -1 ) ? 0 : floor;
    glowFloorNumber( 'number', 5 - floorNo, 'red', 'white' );
}

// Animate Lift Up and Down
function animateLift( lift, top, target, direction ){
    requestAnimationFrame(function () {
        lift.style.top = top + 'px';
        if ( top === target ) {
            callLiftTo( direction );
            return false;
        }
        ( direction === 'upward' ) ? animateLift( lift, top - 2, target, direction )
            : animateLift( lift, top + 2, target, direction );
    });
}

// lift call from floor
function liftCallFrom(floor){
    var lift = document.getElementById( 'lift' );
    var currentTop = parseInt( lift.style.top ) || 88;
    var floorNo = ( floor === -1 ) ? 0 : floor;
    var top = calculateTop(88, 200, floorNo);
    (currentTop > top) ? callLiftTo('upward', floor) : callLiftTo('downward', floor);
}

//===================== Helper Functions ======================

// Calculate Top
function calculateTop( startingPoint, floorHeight, floor ){
    return startingPoint - (( floorHeight + 10 ) * floor );
}

// Toggle Floor numbers
function glowFloorNumber( className, childIndex, background, color ){
    var classArray = document.getElementsByClassName( className );
    classArray[childIndex].style.background = background;
    classArray[childIndex].style.color = color;
}

// Enable/Disable buttons
function toggleButtons(className, index, bool){
    var switches = document.getElementsByClassName(className);
    switches[index].disabled = bool;
}