# StockSense – Retail Demand & Inventory Intelligence

A browser-based retail analytics dashboard built with HTML, CSS and vanilla JavaScript.

## Features
- Revenue, units sold, active products and stock alert KPIs
- Sales performance chart drawn with the HTML Canvas API
- Inventory health breakdown
- Best-performing product ranking
- Searchable product insights table
- Seven-day demand baseline and replenishment suggestions
- Import your own CSV file and analyse it locally in your browser
- Resettable built-in demo dataset

## Run in VS Code
1. Extract the ZIP.
2. Open the `StockSense-Retail-Intelligence` folder in VS Code.
3. Open `index.html` in your browser (right-click → Open with Live Server if you have that extension, or double-click the file).

No installation, backend, API key, or internet connection is required for the app itself. The optional Google Fonts import falls back to system fonts if offline.

## CSV format
Required columns: `product`, `units_sold`, `price`, `stock`  
Optional column: `category`

Example:
```csv
product,category,units_sold,price,stock
Wireless Mouse,Electronics,120,799,18
Notebook,Stationery,75,99,40
```

The demand forecast is a transparent baseline estimate using units sold divided by 30 demo days. It is not a trained machine-learning model.
