interface GuessResult {
  bulls: number;
  cows: number;
}

export function evaluateGuess(secret: string, guess: string): GuessResult {
  const secretArr = [...secret];
  const guessArr = [...guess];

  const bullsCount = secretArr.filter((item, index) => item === guessArr[index]).length;

  const remainingSecret = secretArr.filter((item, index) => item !== guessArr[index]);

  const remainingGuess = guessArr.filter((item, index) => item !== secretArr[index]);

  const cowsResult = remainingGuess.reduce(
    (acc, digit) => {
      const index = acc.availableDigits.indexOf(digit);

      if (index === -1) {
        return acc;
      }

      return {
        count: acc.count + 1,
        availableDigits: acc.availableDigits.filter(
          (_, index) => index !== acc.availableDigits.indexOf(digit),
        ),
      };
    },
    {
      count: 0,
      availableDigits: remainingSecret,
    },
  );

  return {
    bulls: bullsCount,
    cows: cowsResult.count,
  };
}
