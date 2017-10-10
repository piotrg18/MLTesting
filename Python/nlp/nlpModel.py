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
        self.cluster_node = cluster_node

    def createKMeans(self):
        tmpPosts = []
        with open("data\\articles.txt", "r") as infile:
            tmpPosts = json.load(infile)
        vectorizer = TfidfVectorizer(max_df = 0.5,min_df = 2, stop_words = 'english')
        self.X = vectorizer.fit_transform(tmpPosts)

        self.km = KMeans(n_clusters=self.cluster_node, init='k-means++', max_iter=100, n_init=1, verbose=False)
        self.km.fit(self.X)
