from operator import index
import pandas as pd
from pandas import read_csv, read_excel
import numpy as np
import matplotlib.pyplot as plt

from statsmodels.tsa.stattools import adfuller
from pmdarima import auto_arima
# from statsmodels.tsa.arima_model import ARIMA
from statsmodels.tsa.arima.model import ARIMA
from pmdarima.arima.utils import nsdiffs
from pmdarima.arima.utils import nsdiffs
from pmdarima.arima import nsdiffs
from pandas.plotting import autocorrelation_plot
from sklearn.metrics import mean_squared_error
from math import sqrt
from pandas import DataFrame

 

skoler = read_excel(r'backend\backend\tools\AllDataKnn.xlsx', header=0, index_col=0) 
#X = skoler.drop("VedtattBudsjett", axis=1)
#X = X.values
#print(X)

# load dataset
series = read_excel(r'backend\backend\tools\virus.xlsx', header=0, index_col=0, squeeze=True)
series = read_excel(r'backend\backend\tools\virus.xlsx', header=0, index_col=0, squeeze=True)

#series.dropna(inplace=True)

#series = series.drop("Dead", axis=1)
#series = series.drop("Unamed: 3", axis=1)
#series.index = series.index.to_period('M')
print(series.head())
#print(series.isnull())

# split into train and test sets
X = series.values
#print(series.values)
#print("---------")
#print(X)
#print("----------")

size = int(len(X) * 0.66)

train, test = X[0:size], X[size:len(X)]

history = [x for x in train]

print(history)
#print(train)
#print(history)
predictions = list()

stepwise_fit = auto_arima(history, trace=True, suppress_warnings=True, max_p=24, max_q=24, start_q=12, start_p=12,  stationary = False,
  seasonal = True,   stepwise = False,   nmodels = 294, allowdrift=True, allowmean=True, ic = "aic") 


# walk-forward validation
for t in range(len(test)):
	model = ARIMA(history, order=(1,0,0),seasonal_order=(6,0,1,6))
	model_fit = model.fit()
	output = model_fit.forecast()
	yhat = output[0]
	predictions.append(yhat)
	obs = test[t]
	history.append(obs)
	print('predicted=%f, expected=%f' % (yhat, obs))

# evaluate forecasts
# summary of fit model
print(model_fit.summary())
# line plot of residuals
residuals = DataFrame(model_fit.resid)
#residuals.plot()
#plt.show()
# density plot of residuals
#residuals.plot(kind='kde')
#plt.show()
# summary stats of residuals
print(residuals.describe())


print(test)
print(predictions)
rmse = sqrt(mean_squared_error(test, predictions))
print('Test RMSE: %.3f' % rmse)
# plot forecasts against actual outcomes
print(test.sum())
yep = np.array(predictions)
print(yep.sum())


plt.plot(test)
plt.plot(predictions, color='red')
plt.show()












# Takes in array of values used in ARIMA, e.g. [2240520, 1932110, 2262200, 2302860, 2269930]

series = read_excel(r'C:\Users\fil_e\Downloads\Regnskap2018-21.xls', header=0, index_col=0) # OBS: local file path



series.iterrows()

arr1 = []
arr2 = []
arr3 = []

for row in series.itertuples():
    if ((row.Index == "E011070 - Singsaker skole") & (row.År <= 2020)): #& (row.År <= 2020)):
        arr1.append(row.Regnskap)

for row in series.itertuples():
    if ((row.Index == "E031030 - Nardo skole") & (row.År <= 2020)):  #(row.År <= 2020)):
        arr2.append(row.Regnskap)
        print(row)

for row in series.itertuples():
    if ((row.Index == "E031060 - Sunnland skole") & (row.År <= 2020)): #& (row.År <= 2020)):
        arr3.append(row.Regnskap)
        print(row)




arr1.reverse()
arr2.reverse()
arr3.reverse()

print()




#series = read_excel(r'C:\Users\fil_e\Downloads\Regnskap2018-21.xls', header=0, index_col=0) 

skoler = read_excel(r'backend\backend\tools\AllDataKnn.xlsx', header=0, index_col=0) 

budget = read_excel(r'backend\backend\tools\budget.xlsx', header=0, index_col=0)



print(skoler.head())
skoler = skoler.drop("AnsvarsNavn", axis=1)
skoler = skoler.drop("BudsjettEndringer", axis=1)
skoler = skoler.drop("RevidertBudsjett", axis=1)
print(skoler.head())

X = skoler.drop("VedtattBudsjett", axis=1)
X = X.values
print(X)
y = skoler["VedtattBudsjett"]
y = y.values

new_data_point = np.array([
    80,
    51.5137,
    982.4548,
    147.8231,
    0.1504,
    26274770,
])


k=3
distances = np.linalg.norm(X - new_data_point, axis=1)
nearest_neighbor_ids = distances.argsort()[:k]
nearest_neighbor_rings = y[nearest_neighbor_ids]



print(nearest_neighbor_rings)


print("--------------------------------------------")
    #series["Regnskap"].hist(bins=30)
    #skoler["VedtattBudsjett"].hist(bins=15)







# result = adfuller(arr)
# print('ADF Statistic: %f' % result[0])
# print('p-value: %f' % result[1])

# print(ndiffs(arr, test='adf'))  # Returns 0, meaning data is stationary
# print(ndiffs(arr, test='kpss'))  # Returns 0, meaning data is stationary
# print(ndiffs(arr, test='pp'))  # Returns 0, meaning data is stationary


#stepwise_fit = auto_arima(arr1, trace=True, suppress_warnings=True, max_p=10, max_q=10, start_q=5, start_p=5) 
#stepwise_fit = auto_arima(arr2, trace=True, suppress_warnings=True, max_p=10, max_q=10, start_q=5, start_p=5) 
#stepwise_fit = auto_arima(arr3, trace=True, suppress_warnings=True, max_p=10, max_q=10, start_q=5, start_p=5) 

model1 = ARIMA(arr1, order=(0,0,0), seasonal_order=(12,1,0,12))
model2 = ARIMA(arr2, order=(0,0,0), seasonal_order=(12,1,0,12))
model3 = ARIMA(arr3, order=(0,0,0), seasonal_order=(12,1,0,12))
model_fit1 = model1.fit() 
model_fit2 = model2.fit() 
model_fit3 = model3.fit() 

pred1 = model_fit1.forecast(steps=12, exog=None, alpha=0.05,)
pred2 = model_fit2.forecast(steps=12, exog=None, alpha=0.05)
pred3 = model_fit3.forecast(steps=12, exog=None, alpha=0.05)
print("------------------")
print(pred1)
print(pred2)
print(pred3)
print("------------------")

arry = []

for x in range (12):
    totPred = pred1[x]*0.1+pred2[x]*0.1+pred3[x]*0.8
    arry.append(totPred)

arry = np.array(arry)
#pred = [ int(x) for x in pred ]
#pred = np.array(pred)

print(pred3.sum())
print(pred2.sum())
print(pred1.sum())

#arr = np.concatenate((arr, pred))

#print(arr)


#fig, ax = plt.subplots()  # Create a figure containing a single axes.
#autocorrelation_plot(arr2)
#ax.plot(arry);  # Plot some data on the axes.
#plt.show()