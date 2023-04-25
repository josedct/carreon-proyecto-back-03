const generateUrl = (currentUrl , pageMod) => {
    const url = new URL( currentUrl ,'http://localhost')
    url.searchParams.set("page",pageMod)
    return decodeURI(`${url.pathname}${url.search}`)    
}

module.exports = generateUrl