/**
 *
 * @param variables An array includes environment variable names.
 * @description It is a function which is used to check environment variables.
 * It throws an error if an empty array is passed, or there is a missing environment
 * variable.
 */
export const checkEnvironmentVariables = (variables: string[]) => {
  if (variables.length === 0) {
    throw new Error(
      'The array is empty. Please add some environment variables into the array.'
    );
  }

  for (const variable of variables) {
    if (!(variable in process.env) || !process.env[variable] || process.env[variable]?.trim() === '') {
      throw new Error(
        `${variable} is missing or empty in .env file. Check ${variable} and its value.`
      );
    }
  }
};
