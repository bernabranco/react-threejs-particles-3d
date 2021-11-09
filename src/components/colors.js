function randomHex(){
    var myColors = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    var myRandone = myColors[Math.floor(Math.random() * myColors.length)];
    var myRandtwo = myColors[Math.floor(Math.random() * myColors.length)];
    var myRandthree = myColors[Math.floor(Math.random() * myColors.length)];
    var myRandfour = myColors[Math.floor(Math.random() * myColors.length)];
    var myRandfive = myColors[Math.floor(Math.random() * myColors.length)];
    var myRandsix = myColors[Math.floor(Math.random() * myColors.length)];
    var sixDigitRandom =  myRandone + myRandtwo + myRandthree + myRandfour + myRandfive + myRandsix;
    var color = "#" + sixDigitRandom;

    return color;
}

const background = randomHex();
const particleColor = randomHex();

export { background, particleColor}
