import json

f = open("out.json", "r")
data = json.load(f)

count = 0
for d in data:
    if "Coordinates" in d:
        count = count
    if "Linked Resources" in d and len(d["Linked Resources"][0].keys()) > 1:
        count += 1
print(count)
