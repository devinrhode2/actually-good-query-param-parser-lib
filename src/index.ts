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
 * Trades performance for "reliability" (i.e. throw error if anything even smells wrong)
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
    queryString =
      globalThis?.location?.search
  }
  if (queryString == null) {
    throw new Error(
      'globalThis.location.search is not defined, please pass in explicit queryString',
    )
  }

  const params = new URLSearchParams(
    queryString,
  )

  const lowerCaseFoo = foo.toLowerCase()
  let haveFoundAFoo = false

  params.forEach((_value, key) => {
    if (
      key.toLowerCase() === lowerCaseFoo
    ) {
      // Ok, we found one.
      // Have we found a SECOND one?
      if (haveFoundAFoo) {
        const errorMessage =
          'Multiple foo params found with different casing/capitalization'
        if (isProd) {
          reportError(
            new Error(errorMessage),
          )
        } else {
          console.error(errorMessage)
        }
      } else {
        haveFoundAFoo = true
      }
    }
  })

  // Just always give the caller the first one with the casing they requested.
  return params.get(foo)
}
