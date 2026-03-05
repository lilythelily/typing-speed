# Frontend Mentor - Typing Speed Test WebApp

<img width="800" height="437" alt="scrn" src="https://github.com/user-attachments/assets/7ac30160-b807-4b86-baff-7aa3feb6ae2a" />


This is my solution to the [Typing Speed Test challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/typing-speed-test), with HTML, CSS and vanilla JavaScript.
The user can choose the difficulty level from Easy, Medium and Hard. Also, the test timeframe can be selected from Timed (60 seconds) or Passage (no limit). The realtime results show Word-Per-Minute, Accuracy and Time. When the first typing test is finished, the current result is stored as a Personal Best in the local storage. If the subsequent test result exceeds the current Personal Best, the stored Personal Best is updated. The relevant modal screen will be displayed to encourage users to keep trying.
<img width="800" height="511" alt="scrn2" src="https://github.com/user-attachments/assets/b786958f-443f-4c9b-9fed-a74a2989d7f2" />



### The requirements

- Start a test by clicking the start button or by clicking the passage and typing
- Select a difficulty level (Easy, Medium, Hard) for passages of varying complexity
- Switch between "Timed (60s)" mode and "Passage" mode (timer counts up, no limit)
- Restart at any time to get a new random passage from the selected difficulty
- See real-time WPM, accuracy, and time stats while typing
- See visual feedback showing correct characters (green), errors (red/underlined), and cursor position
- Correct mistakes with backspace (original errors still count against accuracy)
- View results showing WPM, accuracy, and characters (correct/incorrect) after completing a test
- See a "Baseline Established!" message on their first test, setting their personal best
- See a "High Score Smashed!" celebration with confetti when beating their personal best
- Have their personal best persist across sessions via localStorage
- View the optimal layout depending on their device's screen size
- See hover and focus states for all interactive elements
- Data will be dynamically populated with JSON file


### Links

- Solution URL: [Add solution URL here](https://github.com/lilythelily/typing-speed.git)
- Live Site URL: [Add live site URL here](https://lilythelily.github.io/typing-speed/)

## My approach

### HTML 
- Semantic HTML
- Clear landmarks
- Descriptive naming for class and id
- Dynamically populate data from JSON file

### CSS
- :root variables for consistency and easier maintenance
- Flex and/or Grid for clear structure and flexible lalyout change
- Hover and Focus states for visual feedback
- Subtle @keyframes animation for the "High Score" screen
- Responsive layout with MediaQueries

### JavaScript
- async function to fetch the data from the local JSON file
- Error handling with displaying an error message
- Added "View Results" button to cearly indicate what to do after finishing the test
- Conditional rendering in accordance with the difficulty level selected, by checking the classList
- Conditional time-count in accordance with the time-mode selected, by checking the classList
- Randomly display the text using Maty.random() function
- Store, retrieve, display the Personal Best score using localStorage.getItem



### Takeaway

- Never forget initialization.
- The scope matters! Whether one line of code is inside or outside of the function can affect the entire code.
- Name the class and id as descriptively as possible to avoid confusion. 
- When to declare Date.now() changes everything.


### Going Forward

Timer function is not yet stable, especially when restarting the typing test. I suspect the issue lied in the Date.now() method. I was somewhat overwhelmed with how frequently I need to call Date.now() in the entire userflow. It might have complicated the timing logic. For the future project, I would like to plan the code architecture thoroughly before getting started to streamline the flow.



