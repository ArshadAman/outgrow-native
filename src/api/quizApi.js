// API key for Gemini
export const GEMINI_API_KEY = "AIzaSyB1dfw9FMlxVUe44ekb_KbQ5ImKpqO70BI"; 

/**
 * Fetches quiz data from Gemini API
 * @param {string} subject - The quiz subject
 * @returns {Promise<Object>} - Quiz data or null if error
 */
export async function fetchQuizFromGemini(subject) {
  try {
    const prompt = `Create a quiz with 5 multiple-choice questions on the topic of ${subject}.
    Format the response as a valid JSON object with this structure:
    {
      "subject": "${subject}",
      "questions": [
        {
          "question": "Question text here",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctOptionIndex": correct_index_number_here,
          "explanation": "A thorough explanation of why the correct answer is right and why the other options are incorrect. Be educational and clear."
        }
      ]
    }
    Make sure the questions are challenging but appropriate for computer science students.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      // Extract JSON from response text
      const text = data.candidates[0].content.parts[0].text;
      console.log("Gemini response:", text.substring(0, 200) + "..."); // Log partial response
      const jsonMatch = text.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[0]) {
        try {
          const quizData = JSON.parse(jsonMatch[0]);
          
          // Validate quiz data structure
          if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
            console.error("Invalid quiz data: missing or empty questions array");
            return createFallbackQuiz(subject);
          }
          
          // Validate each question has the required fields
          for (const q of quizData.questions) {
            if (!q.question || !q.options || !Array.isArray(q.options) || q.correctOptionIndex === undefined) {
              console.error("Invalid question data", q);
              return createFallbackQuiz(subject);
            }
            
            // Add explanation field if missing
            if (!q.explanation) {
              q.explanation = `The correct answer is "${q.options[q.correctOptionIndex]}", which is the most accurate option based on standard definitions and practices in ${subject}.`;
            }
          }
          
          console.log("Quiz data successfully parsed and validated");
          return quizData;
        } catch (error) {
          console.error("Error parsing quiz JSON:", error);
          return createFallbackQuiz(subject);
        }
      }
    }
    
    console.error("Couldn't extract valid quiz JSON from Gemini response");
    return createFallbackQuiz(subject);
  } catch (error) {
    console.error('Error fetching quiz from Gemini:', error);
    return createFallbackQuiz(subject);
  }
}

/**
 * Creates a fallback quiz when the API call fails
 * @param {string} subject - The subject for the quiz
 * @returns {Object} - Fallback quiz data
 */
export function createFallbackQuiz(subject) {
  console.log("Creating fallback quiz for", subject);
  return {
    subject: subject,
    questions: [
      {
        question: `What is a key concept in ${subject}?`,
        options: ["Abstraction", "Inheritance", "Polymorphism", "Encapsulation"],
        correctOptionIndex: 0,
        explanation: "Abstraction is a fundamental concept that involves simplifying complex systems by modeling classes based on their essential properties. It focuses on what an object does rather than how it does it, reducing complexity by hiding implementation details."
      },
      {
        question: `Which tool is most commonly used in ${subject}?`,
        options: ["Debugger", "Compiler", "IDE", "Version Control"],
        correctOptionIndex: 2,
        explanation: "Integrated Development Environments (IDEs) combine multiple tools including editors, compilers, debuggers, and code completion in one application. They are essential for efficient development, providing a complete toolset for coding, testing, and debugging."
      },
      {
        question: `A common challenge in ${subject} is:`,
        options: ["Memory management", "Performance optimization", "Security", "All of the above"],
        correctOptionIndex: 3,
        explanation: "All three options represent significant challenges in software development. Memory management prevents leaks, performance optimization ensures efficiency, and security protects against vulnerabilities. Together, they form the pillars of robust software engineering."
      },
      {
        question: `Which is NOT typically associated with ${subject}?`,
        options: ["Documentation", "Testing", "Marketing", "Design patterns"],
        correctOptionIndex: 2,
        explanation: "Marketing is not typically part of the technical development process. While documentation, testing, and design patterns are integral to software development, marketing is a business function that focuses on promoting the product rather than building it."
      },
      {
        question: `Best practice for ${subject} includes:`,
        options: ["Code reviews", "Continuous integration", "Test-driven development", "All of the above"],
        correctOptionIndex: 3,
        explanation: "All three practices are essential for high-quality software development. Code reviews catch bugs and share knowledge, continuous integration ensures code integrates smoothly, and test-driven development produces more reliable code. Together they form a comprehensive quality assurance approach."
      }
    ]
  };
}
