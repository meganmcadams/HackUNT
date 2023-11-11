import requests
import re

def find(prof_name):
    prof_name = prof_name.replace(' ','-').lower()
    url = "https://computerscience.engineering.unt.edu/people/faculty/{}".format(prof_name)
    print(url)
    r = requests.get(url)
    #print(r.text)
    text = r.text
    start = text.find("view-content")
    end = text.find("node-faculty")
    print(text[start:end])
    to_search = text[start:end]
    x = re.search("[A-Z]?[0-9]{2,3}[A-Z]?", to_search) 
    print(x.group())


find("Mark Albert")