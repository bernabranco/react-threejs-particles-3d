
export function getImageData(ctx, image){
    //get image data for specified pixel range
    var imageData = ctx.getImageData(0,0,image.width,image.height);
    //data is pixel range r,g,b,a
    var data = imageData.data;
    console.log(data.length)
    return data;
}

export function getRed(data){
    var imageRed = []
    //store red color
    for(let i = 0; i<data.length; i+=4){
        imageRed.push(data[i]);
    }
    return imageRed
}

export function getGreen(data){
    var imageGreen = []
    //store green color
    for(let i = 1; i<data.length; i+=4){
        imageGreen.push(data[i]);
    }
    return imageGreen
}

export function getBlue(data){
    var imageBlue = []
    //store blue color
    for(let i = 2; i<data.length; i+=4){
        imageBlue.push(data[i]);
    }
    return imageBlue 
}
    
    //getImageData(ctx);
    //getRed(getImageData(ctx))
    //getGreen(getImageData(ctx))
    //getBlue(getImageData(ctx))









