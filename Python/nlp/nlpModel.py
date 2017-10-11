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

class NlpClassifier:
    

    def __init__(self, cluster_node):
        self.dumped_classifier_path = "data\\my_dumped_classifier.pkl"
        self.kmens_dump_path = "data\\my_dumped_kmeans.pkl"
        self.vectorizer_path = "data\\vectorizer_data.pkl"
        self.cluster_node = cluster_node
        self.vectorizer = TfidfVectorizer(max_df = 0.5,min_df = 2, stop_words = 'english')

    def createKMeans(self):
        self.tmpPosts = []
        with open("data\\articles.txt", "r") as infile:
            self.tmpPosts= json.load(infile)
        self.X = self.vectorizer.fit_transform(self.tmpPosts)

        self.km = KMeans(n_clusters=self.cluster_node, init='k-means++', max_iter=100, n_init=1, verbose=True)
        self.km.fit(self.X)
    
    def serializeKMeans(self):
        with open(self.kmens_dump_path, 'wb') as fid:
            cPickle.dump(self.km, fid)
        with open(self.vectorizer_path, 'wb') as fid:
            cPickle.dump(self.vectorizer, fid)  
    
    def deserializeKmeans(self):
        model=None
        with open(self.kmens_dump_path, 'rb') as fid:
            model = cPickle.load(fid)
        self.km = model 
      
    def assignDocsToCluster(self):
        text = {}
        for i,cluster in enumerate(self.km.labels_):
            oneDoc = self.tmpPosts[i]
            if cluster not in text.keys():
                text[cluster] = oneDoc
            else:
                text[cluster] += oneDoc
        
        _stopwords = set(stopwords.words('english') + list(punctuation) + ["uber","india","billion","year","y/y","b\\","","millions","’s","’’","mr."])
        keywords=  {}
        counts = {}
        for cluster in range(self.cluster_node):
            word_sent = word_tokenize(text[cluster].lower())
            word_sent = (word for word in word_sent if word not in _stopwords)
            freq = FreqDist(word_sent)
            keywords[cluster] = nlargest(100, freq, key=freq.get)
            counts[cluster] = freq

        unique_keys = {}
        for cluster in range(self.cluster_node):
            other_clusters = list(set(range(self.cluster_node )) - set([cluster]))
            keys_other_clusters = set(keywords[other_clusters[0]]).union(set(keywords[other_clusters[1]]))
            unique = set(keywords[cluster]) - keys_other_clusters
            unique_keys[cluster] = nlargest(15, unique, key=counts[cluster].get)

        with open("data\\clusters.json", 'w') as outfile:
            json.dump(unique_keys, outfile)
        
    
    def createnlpClassifier(self):
        self.classifier =  KNeighborsClassifier()
        self.classifier.fit(self.X, self.km.labels_)

    def predict(self, article):
        model = self.deserializeClassifier()
        print('Cluster Node Number: ')
        test = self.vectorizer.transform([article.encode('ascii',errors='ignore')])
        print(model.predict(test))

    def serializeClassifier(self):
        with open(self.dumped_classifier_path, 'wb') as fid:
            cPickle.dump(self.classifier, fid)    

    def deserializeClassifier(self):
        model = None
        classifier = None
        with open(self.vectorizer_path, 'rb') as fid:
            classifier = cPickle.load(fid)
        self.vectorizer = classifier

        with open(self.dumped_classifier_path, 'rb') as fid:
            model = cPickle.load(fid)
        return model