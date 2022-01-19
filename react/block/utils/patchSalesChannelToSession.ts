export const patchSalesChannelToSession = async (
  salesChannel: string,
  cultureInfo: string,
  rootPath?: string
) => {
  const myHeaders = new Headers()

  myHeaders.append('Content-Type', 'application/json')

  const sessionBody = JSON.stringify({
    public: {
      sc: {
        value: salesChannel,
      },
      locale: {
        value: cultureInfo,
      },
      cultureInfo: {
        value: cultureInfo,
      },
      culture: {
        value: cultureInfo,
      },
    },
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: sessionBody,
  }

  return fetch(`${rootPath ?? ''}/api/sessions`, requestOptions)
}
