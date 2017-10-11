import urllib
from bs4 import BeautifulSoup
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans
import numpy as np
import _pickle as cPickle

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from collections import defaultdict
from string import punctuation
from heapq import nlargest
import nltk

def getAllPosts(url,links):
    request = urllib.request.Request(url)
    response = urllib.request.urlopen(request)
    soap = BeautifulSoup(response)
    for a in soap.findAll('a'):
        try:
            url = a['href']
            title = a['title']
            if title == 'Older Posts':
                print(title, url)
                links.append(url)
                getAllPosts(url, links)
        except:
            title = ''
    return
links = []
#getAllPosts('http://doxydonkey.blogspot.in/',links)

with open("data\\links.txt", "r") as infile:
    links = json.load(infile)

def encodeText(item):
   return (str(item.text.encode('ascii', errors='replace'))).replace("?"," ")

def getTextFromURL(url):
    request = urllib.request.Request(url)
    response = urllib.request.urlopen(request)
    soup = BeautifulSoup(response)
    divs = soup.find_all('div',{'class':'post-body'})
    
    posts = []
    for div in divs:
        tmp = div.findAll("li")
        posts += map(encodeText, tmp)
    return posts

tmpPosts = []
#for l in links:
    #tmpPosts += getTextFromURL(l)

with open("data\\articles.txt", "r") as infile:
    tmpPosts = json.load(infile)

#with open("data\\articles.txt", 'w') as outfile:
 #   json.dump(tmpPosts, outfile)


vectorizer = TfidfVectorizer(max_df = 0.5,min_df = 2, stop_words = 'english')
X = vectorizer.fit_transform(tmpPosts)

km = KMeans(n_clusters=3, init='k-means++', max_iter=100, n_init=1, verbose=True)
km.fit(X)

#print(np.unique(km.labels_, return_counts=True))

text = {}

print(km.labels_[4])

for i,cluster in enumerate(km.labels_):
    oneDoc = tmpPosts[i]
    if cluster not in text.keys():
        text[cluster] = oneDoc
    else:
        text[cluster] += oneDoc

'''
_stopwords = set(stopwords.words('english') + list(punctuation) + ["billion","year","y/y","b\\","","millions","’s","’’","mr."])

keywords=  {}
counts = {}
for cluster in range(3):
    word_sent = word_tokenize(text[cluster].lower())
    word_sent = (word for word in word_sent if word not in _stopwords)
    freq = FreqDist(word_sent)
    keywords[cluster] = nlargest(100, freq, key=freq.get)
    counts[cluster] = freq

unique_keys = {}
for cluster in range(3):
    other_clusters = list(set(range(3)) - set([cluster]))
    keys_other_clusters = set(keywords[other_clusters[0]]).union(set(keywords[other_clusters[1]]))
    unique = set(keywords[cluster]) - keys_other_clusters
    unique_keys[cluster] = nlargest(10, unique, key=counts[cluster].get)

print(unique_keys)

testArticle = ""
with open('data\\test_article.txt', 'r') as myfile:
    testArticle = myfile.read().replace('\n', '')

classifier =  KNeighborsClassifier()
classifier.fit(X, km.labels_)
test = vectorizer.transform([testArticle.encode('ascii',errors='ignore')])



with open('my_dumped_classifier.pkl', 'wb') as fid:
    cPickle.dump(classifier, fid)    

model=None
with open('my_dumped_classifier.pkl', 'rb') as fid:
    model = cPickle.load(fid)


print(model.predict(test))
'''
