import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import {program} from 'commander';


async function resizeAndOptimize (file : string ) {
    
}
async function main(){

    program.version('0.1.0')
    program.option('-s, --src <path>','images to resize and optimize source folder')
    program.option('-d, --dest <path>','optimized images destination folder')
    program.option('-w, --width <width>','width of resized images')
    program.option('-h, --height <height>','height of resized images')
    program.option('-q, --quality <quality>','Number between 1-100 for quality of image, best 90')
    program.option('-l, --lossless','If it should use lossless compression')
    program.parse(process.argv);
    
    
    const pathToSrc = path.resolve(program.src)
    const pathToDest = path.resolve(program.dest)
    console.log({pathToSrc,pathToDest})
    const files = await fs.readdir(pathToSrc)
    ///TODO*: THIS CODE ONLY WORKS WHEN OUTPUT FOLDER EXISTS
    //TODO: MAKE IT SO THAT IT CREATES THE FOLDER IF IT DOES NOT EXIST
    const promises =files.map(file => {
        const [name,extension] = file.split('.')
        const saveFile = `${name}.webp`
        const width = Number(program.width)
        const height = Number(program.height)
        const quality = Number(program.quality)
        return fs.readFile(path.join(pathToSrc,file))
                .then(buffer => {
                    return sharp(buffer)
                            .resize({
                                width : (Number.isFinite(width)) ? width : 200,
                                height :(Number.isFinite(height)) ? height : 200
                            })
                            .webp({
                                quality : (Number.isFinite(quality)) ? quality : 90,
                                lossless : Boolean(program.lossless) ?? false
                            })
                            .toFile(path.join(pathToDest,saveFile))
                            .catch(err => console.log(err))
                })
    })

    console.log("Optimizing and resizing your images, please be patient ...")
    const results = await Promise.all(promises)
    console.log('Optimized ',results.length,' images to webp format')
    console.log('you can find them in this folder :',pathToDest)
}


main()