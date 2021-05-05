function calculateBmi(height: number, mass: number): Object {

    let bmi =  mass / (height/100)**2
    let text

    if (bmi < 18.5) {
        text = `${bmi}: underweight`
    } else if (bmi > 25) {
        text = `${bmi}: overweight`
    }
    text = `${bmi}: normal`
    return {
        mass,
        height,
        bmi: text
    }
}


// function main() {
//     let height = Number(process.argv[2])
//     let mass = Number(process.argv[3])
//     console.log(height, mass)
//     console.log(calculateBmi(height, mass))
// }

export default calculateBmi