### The Background: Don Toliver

Don Toliver is my favorite artist. Has been for a couple years now. So, as you can guess, I was pretty estatic when he dropped a new album. I was even more estatic when Don chose to canonize my favorite Travis Scott unreleased (technically?) song *Drugs You Should Try It* as a sample in his song *5 to 10*. This really got me thinking about what specifically about this song I enjoyed though. Was there something in the tone? Something in the lyrics? More generally, was there a way for artists to predict which of their songs would perform better with their fan bases?

### The Problem: Noisy Data

It is every data scientist's dream to be handed a neat and orderly csv file. The world hardly ever obliges. In this case I had several potential data considerations.
- Where would I get a catalog of songs?
    - Spotify provided some music but not unreleaseds like *Drugs You Should Try It*
    - Soundcloud could provide all music but would be skewed for rappers as opposed to pop
- Where do I get streaming data?
    - Again, Soundcloud is an option but it will likely be skewed towards unreleased music
    - Spotify's API won't have access to every song
    - Billboard streams aren't as easy to track
- Where do I actually get the music?
    - Is there an effective way to get MP3 files?
    - Is there an effective way to *read and manage* MP3 files?
    - Can I easily find the lyrics anywhere?
- How do I judge the song?
    - What quantitative factors can be applied?
    - How many of these require listening to the song?
    - How do I listen to the songs?


In the end, I came to the conclusion that 
1. I'd use Soundcloud to get the list of songs because it had the most exhaustive list of music
2. I'd also use the Soundcloud streaming data (this one might have been more of a result of laziness than anything)
3. I would use Genius for getting the lyrics. It seemed to me that downloading and handling 30 MP3 files per artist would be quite a difficult task
4. I used Perplexity AI to generate a list of quantitative factors I could solve for with just the lyrics.

### The Solution: Part 1, Soundcloud and Genius
![Not Like Us](https://i.ibb.co/FVfv1G2/kendrick.jpg, "Not Like Us")

Soundcloud's platform was pretty great for this project, including the name of the song as well as the number of streams in the same box! Made my life a lot easier. I used some quick selenium code to extract the necessary information.
```
def extract_songs():
    songs = driver.find_elements(By.CSS_SELECTOR, 'div.sound__content')
    for song in songs:
        try:
            song_name = song.find_element(By.CSS_SELECTOR, 'a.soundTitle__title span').text
            play_count = song.find_element(By.CSS_SELECTOR, 'li.sc-ministats-item span.sc-visuallyhidden').text
            song_data.append({"Song Name": song_name, "Play Count": play_count})
        except Exception as e:
            print(f"Error processing song: {e}")
```

Next, we have to clean the songs slightly to make them easier to use when trying to find their lyrics on Genius
```
def clean_song_data(song_data):
    cleaned_data = []
    for song in song_data:
        # Clean the song name
        song_name = re.sub(r'^\d+\.\s*', '', song['Song Name'])  # Remove leading numbers and dots
        song_name = re.sub(r'\d+', '', song_name)  # Remove all numbers
        song_name = song_name.split(' - ')[-1]  # Remove anything before the hyphen
        song_name = f"{song_name.strip()} Kendrick Lamar"  # Add "Travis Scott" at the end

        # Clean the play count
        try:
            play_count = int(song['Play Count'].replace(',', '').replace(' plays', ''))
        except ValueError:
            play_count = 0

        cleaned_data.append({"Song Name": song_name, "Play Count": play_count})
    return cleaned_data
```

and from there, we write all the songs and their info to a csv file, which we will then use in another script to scrape from genius. This code is pretty straightforward.
```
def fetch_lyrics(genius_link):
    try:
        driver.get(genius_link)
        time.sleep(5)  # Wait for the page to load
        lyrics_divs = driver.find_elements(By.CSS_SELECTOR, 'div[data-lyrics-container="true"]')
        lyrics = "\n".join([div.text for div in lyrics_divs])
        return lyrics if lyrics else "Lyrics not found"
    except Exception as e:
        print(f"Error fetching lyrics from {genius_link}: {e}")
        return "Lyrics not found"
```

### The Solution: Part 2, Data Cleaning

Now that we had the song name, lyrics, and streams, we had to create some more features which could be used to help identify what exactly made a Travis Scott song good. The first thing I wanted to do was make sure the lyrics were just the raw lyrics and remove all additional tags (i.e. "Chorus", "Ft. Don Toliver"). To do this, we simply remove anything wrapped in square brackets, and also take this as a chance to identify how many features we have on the track.

```
def process_lyrics(lyrics):
    # Extract the raw text by removing everything within square brackets
    raw_text = re.sub(r'\[.*?\]', '', lyrics).strip()

    # Extract features
    features_set = set()
    features_pattern = re.compile(r'\[.*?: (.*?)\]')
    matches = features_pattern.findall(lyrics)

    for match in matches:
        # Split the artists by either "&" or ","
        if '&' in match:
            artists = [artist.strip() for artist in match.split('&')]
        elif ',' in match:
            artists = [artist.strip() for artist in match.split(',')]
        else:
            artists = [match.strip()]

        # Add non "Travis Scott" artists to the set
        for artist in artists:
            if artist.lower() != "travis scott":
                features_set.add(artist)

    # Count unique features
    features_count = len(features_set)

    return raw_text, features_count

# Iterate over each row in the DataFrame and apply the process_lyrics function
travis_df['Raw_Text'] = travis_df['Lyrics'].apply(lambda x: process_lyrics(x)[0])
travis_df['Features'] = travis_df['Lyrics'].apply(lambda x: process_lyrics(x)[1])
```

Following this, we use the TextBlob and VaderSentiment libraries to do an analysis of several tonal-related factors and figure out just what type of feeling the lyrics seem to be conveying.
```
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from collections import Counter
import nltk
nltk.download('punkt')

analyzer = SentimentIntensityAnalyzer()

def analyze_lyrics(raw_text):
    # Word count
    words = nltk.word_tokenize(raw_text)
    word_count = len(words)

    # Unique word count
    unique_words = set(words)
    unique_word_count = len(unique_words)

    # Average word length
    average_word_length = sum(len(word) for word in words) / word_count if word_count != 0 else 0

    # Lexical diversity
    lexical_diversity = unique_word_count / word_count if word_count != 0 else 0

    # Sentiment analysis using TextBlob
    blob = TextBlob(raw_text)
    polarity_score = blob.sentiment.polarity
    subjectivity_score = blob.sentiment.subjectivity

    # Emotion scores using VADER
    vader_scores = analyzer.polarity_scores(raw_text)
    happiness_score = vader_scores['pos']
    sadness_score = vader_scores['neg']
    neutral_score = vader_scores['neu']
    compound_score = vader_scores['compound']

    # Most common word
    most_common_word = Counter(words).most_common(1)[0][0] if words else ""

    # Number of sentences
    sentences = nltk.sent_tokenize(raw_text)
    number_of_sentences = len(sentences)

    # Number of repetitions
    most_common_word_count = sum(1 for word in words if word == most_common_word)

    return {
        "Word_Count": word_count,
        "Unique_Word_Count": unique_word_count,
        "Average_Word_Length": average_word_length,
        "Lexical_Diversity": lexical_diversity,
        "Polarity_Score": polarity_score,
        "Subjectivity_Score": subjectivity_score,
        "Happiness_Score": happiness_score,
        "Sadness_Score": sadness_score,
        "Neutral_Score": neutral_score,
        "Compound_Score": compound_score,
        "Most_Common_Word_Count": most_common_word_count
    }

# Apply the analysis function to each row
analysis_results = travis_df['Raw_Text'].apply(analyze_lyrics)

# Convert the analysis results to a DataFrame and concatenate with the original DataFrame
analysis_df = pd.DataFrame(analysis_results.tolist())
processed_travis_df = pd.concat([travis_df, analysis_df], axis=1)
```

### The Solution: Part 3, Data Visualization

With cleaned data in hand an array of potential features we could analyze, it's time to actually start modelling. The first thing to try and do is use a Correlation Matrix to identify the relationships between several variables and streams, and see if anything sticks out
```
correlation_df = processed_travis_df.drop(columns=['Song_Name', 'Genius_Link', 'Lyrics', 'Raw_Text'])

# Calculate the correlation matrix
correlation_matrix = correlation_df.corr()

# Print the correlation values for 'Number_of_Streams' only
print(correlation_matrix[['Number_of_Streams']])

# Plot the correlation values for 'Number_of_Streams' only
plt.figure(figsize=(10, 6))
sns.heatmap(correlation_matrix[['Number_of_Streams']], annot=True, cmap='coolwarm', linewidths=0.5)
plt.title('Correlation Matrix with Number of Streams')
plt.show()
```
![Correlation Matrix](https://i.ibb.co/rvTfbHk/corr.png, "Correlation Matric")

Looking at the Correlation Matrix for Travis Scott above, a few things seem abundantly clear. Firstly, happy sentiments in the lyrics make the song perform better in streams. Secondly, lexical dievrsity (the amount of words used) is to be discouraged. Interesting takeaways. Makes it seem like the less thinking that has to be done the better for Travis Scott songs.

I also went in and scraped data for a few other artists (namely Taylor Swift and Kendrick Lamar) which allowed me to produce some fun spider/radar charts!

![Taylor vs Travis](https://i.ibb.co/CKP0p0W/taylor-vs-travis.png, "Taylor vs Travis")

### The Aftermath: Tons of Limitations

Currently, I'm not super happy with how this project turned out. I would love to have been able to actually somehow have the song audio be analyzed, but I think I need more experience before I'm able to implement a workflow like that. My only current thought for how I could do that would be having to manually find and grab every mp3 file, then feeding them to ChatGPT and having it analyze them, which does not scream efficiencey to me.

However, I think this whole world as it is pretty cool, and I'm excited to do more projects related to music and data. My next project in this space will likely revolve around the question of music duos (i.e. musicians who make a lot of songs together) and trying to figure out the impact of geography on features, as well as who the greatest duo in history is (Lil Baby and Gunna btw).