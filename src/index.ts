/**
 * Trades performance for "reliability"
 * (i.e. throw/report error if anything smells wrong)
 *
 * Always just returns the first query param with the casing requested.
 *
 * If you have perfect control of your queryParams, you shouldn't need this.
 *
 * NOTE: Supporting multiple query params gets really complicated:
 * We end up returning or throwing multiple errors,
 * are tempted to write very complicated optimal iteration over query params,
 * it could happen, but might be a 2-3 day endeavor.
 */
export const getQueryParam = <
  TThrowIfMissing extends boolean
>(
  /** The param our caller is requesting */
  fooParam: string,
  {
    unparsedQueryString,
    isProd = typeof window !==
    'undefined'
      ? // TODO: use an actual url check for "prod"?
        window.location.hostname !==
        'localhost' // treat all higher environments as "prod".
      : true /* window is undefined, assume prod, this could be node.js server side rendering. */,
    throwIfMissing,
  }: {
    /** Defaults to location.search */
    unparsedQueryString?:
      | string
      | undefined
      | null
    /**
     * If in prod, avoid crashing.
     *
     * Defaults to checking if hostname is 'localhost'
     */
    isProd?: boolean
    /**
     * Crash if query param is missing or empty.
     *
     * This option is required to be passed in, for now.
     * Once we use this more (5+ callsites) we can then set a default of true/false, and make options object optional too.
     */
    throwIfMissing: TThrowIfMissing
  },
): TThrowIfMissing extends true
  ? string
  : ReturnType<
      URLSearchParams['get']
    > => {
  if (unparsedQueryString == null) {
    // eslint-disable-next-line no-param-reassign
    unparsedQueryString =
      globalThis.location?.search ??
      undefined
  }
  if (
    typeof unparsedQueryString !==
    'string'
  ) {
    throw new Error(
      'location.search is undefined/not a string, please pass in explicit queryString',
    )
  }

  const params = new URLSearchParams(
    unparsedQueryString,
  )

  const lowerCaseFoo = fooParam.toLowerCase()
  let haveFoundAFoo = false

  params.forEach((value, key) => {
    // If we found one:
    if (
      key.toLowerCase() === lowerCaseFoo
    ) {
      // Have we found a SECOND one:
      if (haveFoundAFoo) {
        const error = new Error(
          `Found duplicate "${fooParam}" param: ${key}=${value}`,
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

  // Always give the caller the first one with the casing they requested.
  const paramValue = params.get(
    fooParam,
  )

  if (paramValue) {
    return paramValue
  }
  if (throwIfMissing) {
    throw new Error(
      `${fooParam} is missing, and throwIfMissing is true.`,
    )
  }
  // TODO: fix conditional return type?
  // @ts-expect-error - snapshot:
  //  Type 'string | null' is not assignable to type 'TThrowIfMissing extends true ? string : string | null'.
  //    Type 'null' is not assignable to type 'TThrowIfMissing extends true ? string : string | null'.ts(2322)
  return paramValue
}
