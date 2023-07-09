const getUrlSearchParams = (
  queryString:
    | string
    | Record<string, string>
    | string[][]
    | undefined,
): URLSearchParams => {
  // if queryString is an empty string.. then there are no params, the final return value (params.get(param)) will be `null` (this is not an exception)
  if (queryString === undefined) {
    throw new Error(
      [
        'location.search is undefined, please pass in explicit queryString:',
        "getQueryParam('foobar', { queryString: someQueryParams })",
      ].join('\n'),
    )
  }

  return new URLSearchParams(
    queryString,
  )
}

/**
 * Trades performance for predictability.
 * (i.e. throw/report error if anything smells wrong)
 *
 * You should use this for query params which people are entering manually.
 *
 * If you have perfect control of your queryParams, you shouldn't need this.
 *
 * Always just returns the first query param with the casing requested.
 *
 * NOTE: Supporting multiple query params gets really complicated:
 * We end up returning or throwing multiple errors,
 * are tempted to write very complicated optimal iteration over query params,
 * it could happen, but might be a 2-3 day endeavor.
 */
export const getQueryParam = <
  TThrowIfMissing extends boolean = false
>(
  /** The param our caller is requesting */
  requestedParam: string,
  {
    // TODO: fix ts/eslint config
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    queryString = window.location
      .search ?? undefined,
    urlSearchParams,
    strictMode = typeof window !==
    'undefined'
      ? // TODO: fix ts/eslint config
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        window.location.hostname ===
        'localhost'
      : false, // window is undefined, this could be node.js server side rendering: Assume prod (strictMode: false).
    throwIfMissing = false as TThrowIfMissing,
  }: {
    /** Defaults to location.search */
    queryString?:
      | string
      | Array<[string, string]>
      | Record<string, string>
    /** Ignore location.search, just directly use your instance of URLSearchParams */
    urlSearchParams?: URLSearchParams
    /**
     * Crash if any duplicate params are detected.
     *
     * Defaults to true on localhost.
     */
    strictMode?: boolean
    /**
     * Crash if query param is missing or empty.
     *
     * Defaults to `false` (don't crash)
     */
    throwIfMissing?: TThrowIfMissing
  } = {},
): TThrowIfMissing extends true
  ? string
  : ReturnType<
      URLSearchParams['get']
    > => {
  const params =
    urlSearchParams ||
    getUrlSearchParams(queryString)

  const lowerCaseParam = requestedParam.toLowerCase()
  let haveFoundParam = false

  params.forEach((value, key) => {
    if (
      key.toLowerCase() !==
      lowerCaseParam
    )
      return

    // We found one!

    // Is this the second time?
    if (haveFoundParam) {
      const error = new Error(
        `Found duplicate "${requestedParam}" param: ${key}=${value}`,
      )
      if (strictMode) {
        throw error
      } else {
        // TODO: fix ts/eslint config
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        reportError(error)
      }
    } else {
      haveFoundParam = true
    }
  })

  // Always give the caller the first one with the casing they requested.
  const paramValue = params.get(
    requestedParam,
  )

  if (paramValue) {
    return paramValue
  }
  if (throwIfMissing) {
    throw new Error(
      `${requestedParam} is missing, and throwIfMissing is true.`,
    )
  }
  // TODO: fix conditional return type?
  // @ts-expect-error - snapshot:
  //  Type 'string | null' is not assignable to type 'TThrowIfMissing extends true ? string : string | null'.
  //    Type 'null' is not assignable to type 'TThrowIfMissing extends true ? string : string | null'.ts(2322)
  return paramValue
}
