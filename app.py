from flask import Flask, jsonify, render_template
import yfinance as yf

app = Flask(__name__)

# List of stock symbols
stocks = ["INDOFARM.NS", "ORIENTTECH.NS", "RAIN.NS"]

def get_stock_prices():
    stock_data = {}
    for stock in stocks:
        try:
            data = yf.Ticker(stock).history(period="1d")
            if not data.empty:
                last_price = data['Close'].iloc[-1]  # Latest closing price
                stock_data[stock] = round(last_price, 2)
            else:
                stock_data[stock] = "No Data"
        except Exception as e:
            stock_data[stock] = "Error"
    return stock_data

@app.route('/get_stock_prices', methods=['GET'])
def stock_prices():
    return jsonify(get_stock_prices())

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
