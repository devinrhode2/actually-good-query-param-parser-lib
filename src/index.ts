/**
 * Send error to global error handler, in a natural, unobtrusive way.
 */
export const reportError = (
  exception: Error,
) => {
  setTimeout(() => {
    throw exception
  }, 0)
}

/**
 * Trades performance for "reliability"
 * (i.e. throw error if anything even smells wrong)
 *
 * Always just returns the first query param with the casing requested.
 */
export const getParam = (
  foo: string,
  {
    queryString,
    isProd = false,
  }: {
    queryString?:
      | string
      | undefined
      | null
    /** If in prod, avoid crashing */
    isProd?: boolean
  },
) => {
  if (queryString == null) {
    // IMO - code is more readable when re-assigning this parameter
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-param-reassign
    queryString =
      // This eslint error does nto make sense to me. Optional chaining should make all the member access safe here.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      globalThis?.location?.search ??
      undefined
  }
  if (typeof queryString !== 'string') {
    throw new Error(
      'location.search is undefined/not a string, please pass in explicit queryString',
    )
  }

  const params = new URLSearchParams(
    queryString,
  )

  const lowerCaseFoo = foo.toLowerCase()
  let haveFoundAFoo = false

  params.forEach((value, key) => {
    if (
      key.toLowerCase() === lowerCaseFoo
    ) {
      // Ok, we found one.
      // Have we found a SECOND one?
      if (haveFoundAFoo) {
        const error = new Error(
          `Found duplicate "${foo}" param: ${key}=${value}`,
        )
        if (isProd) {
          reportError(error)
        } else {
          throw error
        }
      } else {
        haveFoundAFoo = true
      }
    }
  })

  // Just always give the caller the first one with the casing they requested.
  return params.get(foo)
}
