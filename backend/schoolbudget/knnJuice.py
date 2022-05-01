import pandas as pd
from pandas import read_csv, read_excel
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
from pmdarima import auto_arima
# from statsmodels.tsa.arima_model import ARIMA
from statsmodels.tsa.arima.model import ARIMA
#from pmdarima.arima.utils import ndiff
import os 
import numpy as np
import matplotlib 
from matplotlib import pyplot as plt


#series = read_excel(r'C:\Users\fil_e\Downloads\Regnskap2018-21.xls', header=0, index_col=0) 

dirname = os.path.dirname(__file__)
results = os.path.join(dirname, r'allKnn.xlsx')

skoler = read_excel(results, header=0, index_col=0) 
skoler = skoler.drop("AnsvarsNavn", axis=1)
skoler = skoler.drop("BudsjettEndringer", axis=1)
skoler = skoler.drop("RevidertBudsjett", axis=1)


#  k: amount of Neighbors close to "new_data_point" that is returned 
#  dataframe: the frame where all potential Neighbors are. Ex "skoler = read_excel(...) ", where skoler would be the dataframe
#  target: The target field which is used to correlate other fields to the target in order to find fitting neighbors. Ex "Regnskap", "Budsjett", "Ansatte"...
#  data_point: The element you want to find neighbors for. Input type is np.array and you need to include all values in the dataframe for the datapoint without including the value for the target field.
#  Ex data_point= np.array([
#    55,    42.5299,    887.917,
#    89.56, 0.10086,    24888344,]) 

def nearestNeighbor(k, dataframe,target,data_point):

    X = dataframe.drop(target, axis=1)
    X = X.values
    y = dataframe[target]
    y = y.values

    distances = np.linalg.norm(X - data_point, axis=1)
    nearest_neighbor_ids = distances.argsort()[:k]
    nearest_neighbor_budsjett = y[nearest_neighbor_ids]
        
    return nearest_neighbor_budsjett

def plot_clusters(data, centroids):
    """
    Shows a scatter plot with the data points clustered according to the centroids.
    """
    # Assigning the data points to clusters/centroids.
    clusters = [[] for _ in range(centroids.shape[0])]
    for i in range(data.shape[0]):
        distances = np.linalg.norm(data[i] - centroids, axis=1)
        clusters[np.argmin(distances)].append(data[i])

    # Plotting clusters and centroids.
    fig, ax = plt.subplots()
    for c in range(centroids.shape[0]):
        if len(clusters[c]) > 0:
            cluster = np.array(clusters[c])
            ax.scatter(cluster[:, 0], cluster[:, 1], s=7)
    ax.scatter(centroids[:, 0], centroids[:, 1], marker='x', s=200, c='red')

def kmeans(data, centroids):
    """
    Function implementing the k-means clustering.
    
    :param data
        data
    :param centroids
        initial centroids
    :return
        final centroids
    """
    ### START CODE HERE ### 
    currentCentroids = centroids
    newCentroids = [[]]
    switch = True
    while switch:
        w, h = 1, len(centroids) 
        centroidAssignemnt = [[None for x in range(w)] for y in range(h)] 
        for point in data:
            closestDistance = np.Inf
            currentIndex = 0
            closestIndex = 0
            for centroid in currentCentroids: 
                distance = np.linalg.norm(point - centroid, axis=0)
                if distance < closestDistance:
                    closestDistance = distance
                    closestIndex = currentIndex
                currentIndex += 1 

            centroidAssignemnt[closestIndex].append(point)

        # Recompute centroids, mean of all points assigned to centroid
        newCentroids = []
        for i in range(len(centroidAssignemnt)):
            noNoneValues = [x for x in centroidAssignemnt[i] if x is not None]
            meanOfPoints = np.array(noNoneValues, dtype=object).mean(axis=0)
            newCentroids.append(meanOfPoints)
        
        toList = []
        for i in newCentroids:
            toList.append(list(i))
        newCentroids = np.array(toList)
        if (newCentroids == currentCentroids).all():
            switch = False      
        currentCentroids = newCentroids
    ### END CODE HERE ### 
    return currentCentroids

test_centroids = np.array([
    [20, 20, 300,90, 0.09, 14789875, 15789875, 200],
    [45, 40, 450, 100, 0.07, 19789875, 20789875, 305],
    [65, 60, 650 , 110, 0.1, 27789875, 28789875, 500]
])

X = skoler
X = X.values

# Number of clusters.
K = 4

# Boundaries of our data.
x_min = np.min(X[:, 0])
x_max = np.max(X[:, 0])
y_min = np.min(X[:, 1])
y_max = np.max(X[:, 1])

# Generating random centroids within the data boundaries.
# centroids = np.zeros((K, X.shape[1]))
# centroids[:, 0] = np.random.randint(x_min, x_max, size=K)
# centroids[:, 1] = np.random.randint(y_min, y_max, size=K)


centroids = kmeans(X, test_centroids)

# plt.scatter(data[:, 0], data[:, 1], s=3)
# plt.scatter(centroids[:, 0], centroids[:, 1], marker='x', s=200, c='red')

for i in range(len(centroids)):
    print('c%d =' % i, centroids[i])
plot_clusters(X, centroids)

plt.show()
# for i in range(len(skoler)):
#     schoolArr = []
#     similiar = nearestNeighbor(4,skoler,skoler.values[i])




#series["Regnskap"].hist(bins=30)
#skoler["VedtattBudsjett"].hist(bins=15)


#fig, ax = plt.subplots()  # Create a figure containing a single axes.
#ax.plot(arr);  # Plot some data on the axes.
#plt.show()