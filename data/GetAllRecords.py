from requests_html import HTMLSession
session = HTMLSession()
all_urls =[]
def get_record_suburls(url):
    ans = []
    r = session.get(url)
    links = r.html.links
    for link in links:
        if "record" in link and link not in all_urls and link not in ans and "ln=en" not in link:
            print(link)
            ans.append(link)
    return ans

i = 0
while i < 9:
    all_urls += get_record_suburls(f"https://digicoll.lib.berkeley.edu/search?c=Digital+Collections&jrec={i * 100 + 1}&ln=en&p=collection%3A%27Adjudication+Private+Land+Claims%27&rg=100&fct__1=Text&so=a&sf=title")
    i += 1

f = open("AllRecords.txt", "w")
for line in all_urls:
    f.write(line + "\n")
f.close()
