from statsmodels.tsa.arima.model import ARIMA

# Takes in array of values used in ARIMA, e.g. [2240520, 1932110, 2262200, 2302860, 2269930, ...]
# Returns a list of the next 12 forecasted values.
# ar = autoregressive
# i = integrated
# ma = moving average

def arima(values, ar, i, ma):
    model = ARIMA(values, order=(ar, i, ma), seasonal_order=(12,0,0,12),)  
    model_fit = model.fit()
    pred = model_fit.forecast(steps=12, exog=None, alpha=0.05)
    pred = [int(x) for x in pred]  # cast to int values
    return pred
