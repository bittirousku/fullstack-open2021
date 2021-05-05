interface Assessment {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

function calculateExercises(hours: Array<number>, target: number): Assessment {
    return  {
        periodLength: hours.length,
        trainingDays: hours.filter(day => day !== 0).length,
        success: hours.every(day => day !==0),
        rating: 0,
        ratingDescription: ":(",
        target: target,
        average: hours.reduce((a,b) => a+b) / hours.length

    }
}

// function main() {

//   let target = Number(process.argv[2])
//   let hours = process.argv.slice(3).map(day => Number(day))

//   console.log("targe", target)
//   console.log("hours", hours)
  
//   console.log(calculateExercises(hours, target))
// }

export default calculateExercises