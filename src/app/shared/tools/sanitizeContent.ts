interface SanitizeContent {
    (content: string): string
  }
  
  export const sanitizeContent: SanitizeContent = (theContent) => {
    return theContent.replace(/[<>&"']/g, (match: string): string => {
      switch (match) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '&': return '&amp;'
        case '"': return '&quot;'
        case "'": return ' '
      
        default: return match
      }
    })
  }