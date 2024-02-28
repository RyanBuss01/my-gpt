import pandas as pd
import json

builders = []
# List of names
names = ["enthusiastic", "professional", "caring", "witty", "friend"]

# Load BotBuilder data
for name in names:
    builder = {}  # Create an empty dictionary for each builder
    builder["name"] = name
    builder["file"] = pd.read_csv('data/tsv/' + name + '.tsv', delimiter='\t')
    builders.append(builder)  # Append the dictionary to the builders list

# Initialize the structure similar to your intents.json
converted_data = {"intents": []}

# Initialize a dictionary to keep track of tags for answers
answer_to_tag = {}
int = 0

for i in range(len(builders)):
    # Iterate over BotBuilder data and populate the converted_data
    botbuilder_df = builders[i]["file"]
    name = builders[i]["name"]
    for index, row in botbuilder_df.iterrows():
        # Assuming 'Question' and 'Answer' columns exist
        question, answer = row['Question'], row['Answer']
        
        # Check if the answer already has a tag assigned
        if answer in answer_to_tag:
            tag = answer_to_tag[answer]
        else:
            tag = str(int)
            int += 1

            # Store the tag for the answer
            answer_to_tag[answer] = tag

        # Check if the tag already exists
        existing_intent = next((item for item in converted_data["intents"] if item["tag"] == tag), None)
        if existing_intent:
            existing_intent["patterns"].append(question)
            existing_intent["responses"].append(answer)
        else:
            converted_data["intents"].append({
                "tag": tag,
                "patterns": [question],
                "responses": [answer]
            })

    # Save converted data to a new JSON file
    with open(f'data/json/intents_{name}.json', 'w') as json_file:
        json.dump(converted_data, json_file, indent=4)
