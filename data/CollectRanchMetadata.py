from requests_html import HTMLSession
from tqdm import tqdm
import json
import time
session = HTMLSession()

f = open("RanchMetadata.json", "r")
links = f.read().split("\n")
#links = ["/record/264170", "/record/265831", "/record/268933", "/record/266102", "/record/265481"]

all_doc_metadata = []
for link in tqdm(links):
    r = session.get("https://digicoll.lib.berkeley.edu" + link)
    metadata = r.html.find(".metadata-row")
    o = {}
    for row in metadata:
        try:
            title = row.find(".title",first=True).text
            value = row.find(".value",first=True).text
            if title == "Linked Resources":
                o[title] = []
                sub_link = row.find("a")
                e = {}
                for l in sub_link:
                    e[l.text] = l.attrs["href"]
                o[title].append(e)

            else:
                o[title] = value
        except(e):
            print(e)
            print("Failed to parse row")
    all_doc_metadata.append(o)
    #time.sleep(1)

fo = open("out.json","w")
fo.write(json.dumps(all_doc_metadata))
