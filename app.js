
let output = "";


function motionTypeChange() {
    updateDirection();
    updateVelocity();
}


function updateButtons() {
    const fxType = document.getElementById('fxType').value.trim();

    document.getElementById('circleFx').style.display = 'none';

    if(fxType == "circle") {
        document.getElementById('circleFx').style.display = '';
    }
}


function updateDirection() {
    const axis = document.getElementById('axis').value.trim();
    const mode = document.getElementById('mode').value.trim();
    const motion = document.getElementById('motionType').value.trim();

    if(axis == "vertical" && mode == "world" && motion == "still") {
        document.getElementById('directions').style.display = '';
    } else {
        document.getElementById('directions').style.display = 'none';
    }
}

function updateVelocity() {
    const motion = document.getElementById('motionType').value.trim();

    if(motion != "still") {
        document.getElementById('coordinateMode').style.display = 'none';
        document.getElementById('motionVelocity').style.display = '';
    } else {
        document.getElementById('coordinateMode').style.display = '';
        document.getElementById('motionVelocity').style.display = 'none';
    }
}

function generateFx() {

    const fxType = document.getElementById('fxType').value.trim();
    const particle = document.getElementById('particle').value.trim();
    const radius = document.getElementById('radius').value.trim();
    const particleCount = document.getElementById('particleCount').value.trim();
    const axis = document.getElementById('axis').value.trim();
    const direction = document.getElementById('direction').value.trim();
    const mode = document.getElementById('mode').value.trim();
    const motion = document.getElementById('motionType').value.trim();
    const velocity = document.getElementById('velocity').value.trim();

    document.getElementById('output').style.visibility = 'visible';

    if(fxType == "circle") {
        output = generateCircle(particle, radius, particleCount, axis, direction, mode, motion, velocity);
    }
            
    document.getElementById('output').innerText = 'Copied To Clipboard!\n\n' + output;
    navigator.clipboard.writeText(output);
}


function generateCircle(particle, radius, particleCount, axis, direction, mode, motion, velocity) {
    if(!particle) {particle = "minecraft:end_rod"}
    if(!radius) {radius = 5}
    if(!particleCount) {particleCount = 36}
    if(!velocity) {velocity = 1}

    let particles = "";

    let symbol = "~";
            

    if(mode == "local") {
        symbol = "^";
    }

            

    for(let i = 0; i < particleCount; i++) {
        let angle = 360 / particleCount * i;
        let intervalAngle = 2 * Math.PI * i / particleCount;

                let x = 0;
                let y = 0;
                let z = 0;

        if(axis == "horizontal") {
            x = (Math.cos(intervalAngle) * radius).toFixed(3);
            z = (Math.sin(intervalAngle) * radius).toFixed(3);

        } else {
            if(mode == "world" && direction == "z") {
                z = (Math.cos(intervalAngle) * radius).toFixed(3);
            } else {
                x = (Math.cos(intervalAngle) * radius).toFixed(3);
            }
            y = (Math.sin(intervalAngle) * radius).toFixed(3);
        }



        const invertedMotionTypes = ["inwards", "downwards", "left"];
        const distanceMotionTypes = ["inwards", "upwards", "downwards", "left", "right"];

        if(motion == "still") {
            particles += `particle ${particle} ${symbol}${x} ${symbol}${y} ${symbol}${z} 0 0 0 0 1\n`   
        } else {
            let motionX = "";
            let motionY = "";
            let motionZ = "";
            let motionDirection = "";
            let motionDistance = "";
            if(distanceMotionTypes.includes(motion)) {
                motionDistance = radius;
            }

            let yaw = "~";
            let pitch = "~";
            if(axis == "horizontal") {
                yaw = angle;
                pitch = "0";
            } else if(axis == "vertical") {
                pitch = angle;
            }

            if(motion == "outwards" || motion == "inwards") {
                motionZ = 1000000;
                if(invertedMotionTypes.includes(motion)) {
                    motionZ = "-" + motionZ;
                }
            } else if(motion == "upwards" || motion == "downwards") {
                motionY = 1000000
                if(invertedMotionTypes.includes(motion)) {
                    motionY = "-" + motionY;
                }
            } else if(motion == "left" || motion == "right") {
                motionX = 1000000
                if(invertedMotionTypes.includes(motion)) {
                    motionX = "-" + motionX;
                }
            }
            particles += `execute rotated ${yaw} ${pitch} positioned ^ ^ ^${motionDistance} run particle ${particle} ~ ~ ~ ^${motionX} ^${motionY} ^${motionZ} ${(0.0000001 * velocity).toFixed(8)} 0\n`

                       
        }
 
            

    }
    return particles;
}

