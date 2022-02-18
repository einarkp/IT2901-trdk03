import pandas as pd
from pandas import read_csv, read_excel
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
from pmdarima import auto_arima
# from statsmodels.tsa.arima_model import ARIMA
from statsmodels.tsa.arima.model import ARIMA
from pmdarima.arima.utils import ndiffs


#series = read_excel(r'C:\Users\fil_e\Downloads\Regnskap2018-21.xls', header=0, index_col=0) 

skoler = read_excel(r'backend\backend\tools\AllDataKnn.xlsx', header=0, index_col=0) 

budget = read_excel(r'backend\backend\tools\budget.xlsx', header=0, index_col=0)


print(skoler.head())
skoler = skoler.drop("AnsvarsNavn", axis=1)
skoler = skoler.drop("BudsjettEndringer", axis=1)
skoler = skoler.drop("RevidertBudsjett", axis=1)
print(skoler.head())

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

arr = np.array([
    55,
    42.5299,
    887.917,
    89.56,
    0.10086,
    24888344,
])

yep = nearestNeighbor(5,skoler,"VedtattBudsjett", arr)

print(yep) 

#series["Regnskap"].hist(bins=30)
#skoler["VedtattBudsjett"].hist(bins=15)


#fig, ax = plt.subplots()  # Create a figure containing a single axes.
#ax.plot(arr);  # Plot some data on the axes.
#plt.show()