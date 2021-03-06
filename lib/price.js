import { OptionType } from './enum.js'
import { normalDistribution as N, roundFour } from './math.js'
import { validateBlackScholes } from './validation.js'

const exercisedProbability = (blackScholesInput) => {
  const { stock, strike, interestRate, dividend = 0, volatility, timeToExpire } = blackScholesInput

  return (Math.log(stock / strike) + (interestRate - dividend + (volatility ** 2) / 2) * timeToExpire) / (volatility * Math.sqrt(timeToExpire))
}

const notExercisedProbability = ({ volatility, timeToExpire }, d1) => d1 - volatility * Math.sqrt(timeToExpire)

const countCall = (blackScholesInput, d1, d2) => {
  const { stock, strike, interestRate, timeToExpire, dividend = 0 } = blackScholesInput

  return roundFour(stock * Math.E ** (-dividend * timeToExpire) * N(d1) - strike * Math.E ** (-interestRate * timeToExpire) * N(d2))
}

const countPut = (blackScholesInput, d1, d2) => {
  const { stock, strike, interestRate, timeToExpire, dividend = 0 } = blackScholesInput

  return roundFour(strike * Math.E ** (-interestRate * timeToExpire) * N(-d2) - stock * Math.E ** (-dividend * timeToExpire) * N(-d1))
}

const price = (type) => (blackScholesInput = {}) => {
  validateBlackScholes(blackScholesInput)

  const d1 = exercisedProbability(blackScholesInput)
  const d2 = notExercisedProbability(blackScholesInput, d1)

  return type === OptionType.Call ? countCall(blackScholesInput, d1, d2) : countPut(blackScholesInput, d1, d2)
}

export const callPrice = price(OptionType.Call)
export const putPrice = price(OptionType.Put)
