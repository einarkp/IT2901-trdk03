from concurrent.futures.process import _system_limits_checked
from operator import index
from turtle import color
import pandas as pd
from pandas import read_csv, read_excel
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
from pmdarima import auto_arima
from statsmodels.tsa.arima.model import ARIMA
from pmdarima.arima.utils import nsdiffs
from pmdarima.arima.utils import nsdiffs
from pmdarima.arima import nsdiffs
from pandas.plotting import autocorrelation_plot
from sklearn.metrics import mean_squared_error
from math import sqrt
from pandas import DataFrame
from statsmodels.graphics.tsaplots import plot_acf
from statsmodels.tsa.ar_model import AutoReg
from sklearn.metrics import mean_squared_error



# Takes in array of values used in ARIMA, e.g. [2240520, 1932110, 2262200, 2302860, 2269930, ...]
# Returns a list of the next 12 forecasted values.
# ar = autoregressive
# i = integrated
# ma = moving average

series = read_excel(r'virus.xlsx', header=0, index_col=0)
X = series.values
size = X.size
train = X[0:36]
test = X[36:]
pred = []

model_ar = AutoReg(train, 12)
model_ar_fit = model_ar.fit()
prediction = model_ar_fit.predict(start=39, end=48)
sum_pred = np.array(prediction)
sum_test = np.array(test)



def arima(values, ar, i, ma):
    model = ARIMA(values, order=(ar, i, ma),)  
    print(type(model))
    model_fit = model.fit()
    pred = model_fit.get_forecast(steps=12)
    forecast = pred.predicted_mean
# summarize confidence intervals
    # intervals = [0.2, 0.1, 0.01, 0.05]
    ci = 0
    a=0.05
    ci = pred.conf_int(a)
    print(ci)
    ci1 = ci[0,0]
    ci2 = ci[0,1]
    forecast = [int(x) for x in forecast]  # cast to int values
    print(forecast)
    plt.plot(forecast, color="red")
    plt.plot(test, color = "green")
    for x in range(12):
        plt.fill_between([x-0.5,x+0.5], ci[x,0], ci[x,1] )
    plt.show()
    return forecast


arima_pred = arima(train, 12, 0, 1)

sum_arima_pred= 0

arima_pred = np.array(arima_pred)

for i in range(12):
    sum_arima_pred += arima_pred[i]


print(sum_arima_pred)
print(sum_test.sum())