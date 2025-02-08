# BaseballGameInsight
Baseball is a deeply strategic sport, but for casual viewers, understanding the why behind key decisions—pitch selection, defensive shifts, and base-running tactics—can be a challenge. We wanted to create a real-time AI-driven tool that simplifies the complexities of the game, making it more engaging and accessible for everyone. Our inspiration came from sports analytics advancements and the desire to enhance the fan experience by providing instant, easy-to-understand insights.

Our AI-powered tool provides real-time baseball insights, decoding strategies behind every play. It enhances fan engagement by making complex tactics simple and accessible.

# What it does
Our application analyzes live baseball games and provides real-time strategic insights for viewers. It explains the reasoning behind key plays, including:

Pitch selection: Why a pitcher chose a fastball instead of a curveball. 
Defensive shifts: Why infielders are positioned a certain way. 
Base-running decisions: Why a player steals a base at a specific moment. These insights appear live on-screen or in an interactive web app, helping fans understand the game’s deeper strategic elements as they unfold.

## How we built it
We started by collecting the necessary datasets from the MLB StatsAPI and the MLB GitHub repository. The key datasets included:

**Live Game Data (GUMBO Data Feeds):** Provided real-time updates on the state of a baseball game.
**Historical Game Data:** Included detailed information about past games, such as play-by-play data, pitch-by-pitch data, and player statistics.
**Player and Team Statistics:** Detailed statistics for players and teams, including batting averages, pitching stats, and fielding metrics.
**Advanced Metrics (Statcast Data):** Included advanced metrics such as pitch speed, exit velocity, and home run distance.
**Data Processing:** We cleaned and preprocessed the data to make it suitable for analysis. This involved handling missing values, normalizing data, and creating features that capture the current game context and player performance. We also merged live game data with historical statistics to create a comprehensive dataset.
**Feature Engineering:** We engineered features that represent the game situation, such as the inning, score, number of outs, and base runners. These features were crucial for understanding the context of each play and generating relevant insights.
**Model Development:** We trained a machine learning model using historical game data to recognize patterns and predict the likely strategy based on the current game context. We used a Random Forest Classifier to classify the type of play or strategy (e.g., bunt, steal, pitch type) based on the situational features.
**Real-Time Analysis:** We integrated the GUMBO live data feed into our application to provide real-time updates. The live game data was continuously fed into our model to generate real-time predictions and insights. We used these predictions to provide tool tips that explain the tactics behind each play.
**Interactive Application:** We developed an interactive application using Flask and Streamlit to display real-time insights and tool tips. The user interface was designed to be intuitive and user-friendly, allowing casual viewers to easily understand the strategies and tactics behind each play.
**Testing and Iteration:** We thoroughly tested our application to ensure it worked as expected. We gathered feedback from potential users and made necessary improvements to enhance the user experience and the accuracy of our insights.
**Deployment:** We deployed our application on Google Cloud using Cloud Run for scalable and managed execution. We also used Vertex AI for model training and deployment, ensuring seamless integration with our application.

By leveraging the available data and using machine learning models, we built a robust application that provides meaningful and real-time insights into baseball strategy, enhancing the fan experience during live games.
## Challenges we ran into
Real-time data processing: Handling live sports data efficiently without delays.
Training ML models: Creating an accurate predictive model required extensive historical data and fine-tuning.
Simplifying complex strategies: Translating in-depth analytics into digestible, fan-friendly insights was a unique challenge.
Integration with live streams: Ensuring a seamless overlay experience for users viewing games in real-time.
## Accomplishments that we're proud of
Successfully built a working AI model that can analyze and explain key baseball strategies.
Integrated Snowflake Cortex AI for real-time decision-making.
Developed an interactive UI that delivers insights in a non-intrusive, engaging manner.
Bridged the knowledge gap between casual fans and expert-level understanding of baseball.

## What we learned
The importance of real-time processing in sports analytics.
How to use Mistral LLMs to convert complex strategies into simple explanations.
The challenges and benefits of integrating AI with live data streams.
The role of user experience (UX) design in making AI-generated insights engaging and accessible.
## What's next for Baseball Game Insights
Enhance AI accuracy by training models with more historical game data.
✅ Expand to other sports, such as football and basketball, to provide real-time insights.
✅ Develop mobile app support, allowing users to access insights anywhere.
✅ Integrate with AR/VR, providing an immersive second-screen experience for fans.


