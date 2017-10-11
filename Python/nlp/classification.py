from nlpModel import NlpClassifier

classifier = NlpClassifier(3)
#classifier.createKMeans()
#classifier.createnlpClassifier()

#classifier.assignDocsToCluster()


#classifier.serializeKMeans()
#classifier.serializeClassifier()


testArticle = ""
with open('data\\test_article.txt', 'r') as myfile:
    testArticle = myfile.read().replace('\n', '')


classifier.predict(testArticle)
