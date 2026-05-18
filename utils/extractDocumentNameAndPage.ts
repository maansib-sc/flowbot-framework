export const getDocumentNameAndPageNumber = ( message: string) => {
    const extracted = message.split("of the document")
    const splitpageNumber = extracted[0].split("refer to Page")
    const pageNumbers = splitpageNumber[1].split(",") || []
    const splitdocumentName = extracted[1].split("###")
    let documentName = '';
    let match = splitdocumentName[0].match(/\/([^\/]+)\.pdf/);
    if (splitdocumentName[0].includes("http") && match) {
      documentName = match[1]; 
    } else {
      documentName = splitdocumentName[0].trim()
    }
    return {
        documentName,
        pageNumbers
    }
}