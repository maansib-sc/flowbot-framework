export const intentTemplate = (message) => {
  return `
          **Here is the user message you can use to answer:**
          userQuery: ${message}
  
          **If the userQuery is about to ask the assistance or asking 'contact us' then respond assistance:**
          
          **If user given their contact details to contact with them, then only respond with contact:**
          **Example for contact:**
          - If user ask like 'I am safeer and safee@gmail.com','My name is safeer and my email is safee@gmail.com', 'my email is safee@gmail.com' then respond with contact
          
          **If the userQuery is asking a follow-up question, respond with follow-up:**
          **Criteria for identifying follow-up questions:**
          - Follow-up questions often seek additional details, clarification, or elaboration on a last statement or topic.
          **If the customer mentions any of the following phrases:**
              1. "explain more" OR 
              2. "explain this" OR
              2. "elaborate more" OR 
              3. "brief this" OR 
              4. "give it in simpler term" OR 
              5. "show more" OR
              6. "change some value in last message"
          Then respond with follow-up:
          
          
          **If the customer asking personal questions or about general information or greeting then respond with casual:**
          **If the user query is not related to any of the above, then response with product:**
          **Important Instructions:**
          - Only respond with assistance or contact or follow-up or casual or product.
          - No additional data needed.
          
    `
}

export const handOverTemplate = (message, emailProvided) => {
    return `
          **Here is the user message you can use to answer:
          userQuery: ${message}
          
          **Here is the boolean representation of user is already provided their email or not**
          email: ${emailProvided}
          
          **Responses Based on Conditions:**
          **If there is no email, respond with exact below text:**
          Thank you for your interest! 
          
          Please help us by providing your contact information below. Our representative will be in touch with you shortly, please stay on the line.
          
          • Name: (Required)
          
          • Phone Number: (Optional)
          
          • Email: (Required)
          
          **If the email is provided, respond with exact below text:**
          Thank you for your interest!
          
          Our representative will be in touch with you shortly, please stay on the line.
    
          **Important Instructions:**
          
          - Your answers must be clear, informative
          - Always use "we" when addressing concerns to maintain a personalized interaction.
          - Don't include any reference numbers or markers like '1^'
          - Give response like human remove all AI tones, remove starting like 'Based on the provided information'
          - No additional data needed.
            
        `
}

export const casualQuestionTemplate = (message, topic) => {
    return `
          **Here is the user message you can use to answer:**
          userQuery: ${message}
           
          **Respond with exact below text and the response should end with the sentence 'Please consider to ask quetions related to ${topic}' in newline:**
    
          Hi!(add some casual message for the user query) 
    
    
          **Important Instructions:**
          
          - Your answers must be clear, informative
          - Always use "we" when addressing concerns to maintain a personalized interaction.
          - Don't include any reference numbers or markers like '1^'
          
      `
}
  