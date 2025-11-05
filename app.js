const fxTypeMappings = {
    "circle" : "2d",
    "rectangle" : "2d",
    "sphere" : "3d"
}
let output = "";


function motionTypeChange() {
    updateDirection();
    updateVelocity();
}

const hideElement = (element) => {
    element.style.display = "none"
}

const showElement = (element) => {
    element.style.display = ""
}


function updateButtons() {
    const fxType = document.getElementById('fxType').value.trim();
    const circleFxOptions = document.querySelectorAll('[data-fxType="circle"]')
    const rectangleFxOptions = document.querySelectorAll('[data-fxType="rectangle"]')
    const twoDFxOptions = document.querySelectorAll('[data-fxType="2d"]')
    
    fxType == "circle" ? circleFxOptions.forEach(showElement) : circleFxOptions.forEach(hideElement)
    fxType == "rectangle" ? rectangleFxOptions.forEach(showElement) : rectangleFxOptions.forEach(hideElement)
    fxTypeMappings[fxType] == "2d" ? twoDFxOptions.forEach(showElement) : twoDFxOptions.forEach(hideElement)
    
    motionTypeChange()
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
    } else if(fxType == "rectangle"){
        output = generateRectangle(particle, radius, particleCount, axis, direction, mode, motion, velocity);
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

const generateRectangle = (particle, size, particleCount, axis, direction, mode, motion, velocity) => {
    if(!particle) {particle = "minecraft:end_rod"}
    if(!size) {size = [5,5]}
    if(!particleCount) {particleCount = 20}
    if(!velocity) {velocity = 1}

    let particles = "";

    let symbol = "~";
            

    if(mode == "local") {
        symbol = "^";
    }

    let perimeterSize = 2*size[0] + 2*size[1]
    let widthPercent = size[0] / perimeterSize
    let heightPercent = size[1] / perimeterSize
    let widthParticles = Math.floor(particleCount * widthPercent)
    let heightParticles = Math.floor(particleCount * heightPercent)
    if (widthParticles < 1){
        widthParticles = 1
        heightParticles -= 1
    }
    if (heightParticles < 1){
        heightParticles = 1
        widthParticles -= 1
    }
    let side = 0
    for (let i = 0; i < particleCount; i++){
        let x = 0
        let y = 0
        let z = 0

        if (axis == "horizontal"){
            if (side == 0){
                z = -size[1] / 2
                x = (-size[0] / 2) + (i / widthParticles)
                if (i == widthParticles){
                    side = 1
                }
            }
            if (side == 1){
                z = size[1] / 2
                x = (-size[0] / 2) + ((i - widthParticles) / widthParticles)
                if ((i - widthParticles) == widthParticles){
                    side = 2
                }
            }
            if (side == 2){
                x = -size[0] / 2
                z = (-size[1] / 2) + ((i - (2 * widthParticles)) / heightParticles)
                if (i == widthParticles){
                    side = 3
                }
            }
            if (side == 3){
                x = size[0] / 2
                z = (-size[1] / 2) + ((i - ((2 * widthParticles) + heightParticles)) / heightParticles)
            }
        } else{
            if (mode == "world" && direction == "z"){
                if (side == 0){
                    y = -size[1] / 2
                    x = (-size[0] / 2) + (i / widthParticles)
                    if (i == widthParticles){
                        side = 1
                    }
                }
                if (side == 1){
                    y = size[1] / 2
                    x = (-size[0] / 2) + ((i - widthParticles) / widthParticles)
                    if ((i - widthParticles) == widthParticles){
                        side = 2
                    }
                }
                if (side == 2){
                    x = -size[0] / 2
                    y = (-size[1] / 2) + ((i - (2 * widthParticles)) / heightParticles)
                    if (i == widthParticles){
                        side = 3
                    }
                }
                if (side == 3){
                    x = size[0] / 2
                    y = (-size[1] / 2) + ((i - ((2 * widthParticles) + heightParticles)) / heightParticles)
                }
            } else {
                if (side == 0){
                    y = -size[1] / 2
                    z = (-size[0] / 2) + (i / widthParticles)
                    if (i == widthParticles){
                        side = 1
                    }
                }
                if (side == 1){
                    y = size[1] / 2
                    z = (-size[0] / 2) + ((i - widthParticles) / widthParticles)
                    if ((i - widthParticles) == widthParticles){
                        side = 2
                    }
                }
                if (side == 2){
                    z = -size[0] / 2
                    y = (-size[1] / 2) + ((i - (2 * widthParticles)) / heightParticles)
                    if (i == widthParticles){
                        side = 3
                    }
                }
                if (side == 3){
                    z = size[0] / 2
                    y = (-size[1] / 2) + ((i - ((2 * widthParticles) + heightParticles)) / heightParticles)
                }
            }
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
    return particles

}


// ON LOAD FUNCTIONS - To be called once document and script is loaded
updateButtons()