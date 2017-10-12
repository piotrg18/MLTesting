import pandas as pd
from fbprophet import Prophet

import matplotlib.pyplot as plt

plt.style.use('fivethirtyeight')

df = pd.read_csv('Stock.csv')
df.head(5)


#Print top 5 elements
print(df.head(5))

#Print Data Types
print(df.dtypes)


df = df.rename(columns={'Days': 'ds',
                        'Values': 'y'})

df.head(5)

def plotSampleDate(data):
    ax = df.set_index('ds').plot(figsize=(12, 8))
    ax.set_ylabel('Stock Values') 
    ax.set_xlabel('Date')
    plt.show()

#plotSampleDate(df)


my_model = Prophet(interval_width=0.01)
my_model.fit(df)

future_dates = my_model.make_future_dataframe(periods=35, freq='MS')
print (future_dates.tail())

forecast = my_model.predict(future_dates)

#forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

my_model.plot(forecast,
              uncertainty=False)

#my_model.plot_components(forecast)
plt.show()