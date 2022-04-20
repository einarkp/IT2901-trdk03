import pandas as pd
from pandas import read_csv, read_excel
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
from pmdarima import auto_arima
# from statsmodels.tsa.arima_model import ARIMA
from statsmodels.tsa.arima.model import ARIMA
from pmdarima.arima.utils import ndiffs


#  k: amount of Neighbors close to "new_data_point" that is returned 
#  dataframe: the frame where all potential Neighbors are. Ex "skoler = read_excel(...) ", where skoler would be the dataframe
#  data_point: The element you want to find neighbors for. Input type is np.array and you need to include all values in the dataframe for the datapoint without including the value for the target field.
#  Ex data_point= np.array([
#    55,    42.5299,    887.917,
#    89.56, 0.10086,    24888344,]) 

def nearestNeighbor(k, dataframe,data_point):

    X = dataframe
    X = X.values
    y = dataframe.index

    distances = np.linalg.norm(X - data_point, axis=1)
    nearest_neighbor_ids = distances.argsort()[:k]
    nearest_neighbor_schools = y[nearest_neighbor_ids]

#    correlation_matrix = dataframe.corr()
#    print(correlation_matrix["VedtattBudsjett"])

    return nearest_neighbor_schools

