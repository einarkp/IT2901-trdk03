from statsmodels.tsa.arima.model import ARIMA

# Takes in array of values used in ARIMA, e.g. [2240520, 1932110, 2262200, 2302860, 2269930, ...]
# Returns a list of the next 12 forecasted values.
# ar = autoregressive
# i = integrated
# ma = moving average

def arima(values, ar, i, ma, conf):
    model = ARIMA(values, order=(ar, i, ma),)  
    print("Creating ARIMA prediction")
    model_fit = model.fit()
    pred = model_fit.get_forecast(steps=12)
    forecast = pred.predicted_mean

# summarize confidence intervals
    ci = 0
    ci = pred.conf_int(alpha=conf)

    return forecast, ci