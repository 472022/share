document.addEventListener("DOMContentLoaded", () => {
    // Initialize the chart
    initChart()
  
    // Add event listeners
    setupEventListeners()
  })
  
  function initChart() {
    const chartElement = document.getElementById("stockChart")
    if (!chartElement) return
  
    // Create a canvas element for the chart
    const canvas = document.createElement("canvas")
    canvas.width = chartElement.clientWidth
    canvas.height = chartElement.clientHeight
    chartElement.appendChild(canvas)
  
    const ctx = canvas.getContext("2d")
    if (!ctx) return
  
    // Sample data for the candlestick chart
    const data = generateCandlestickData()
  
    // Draw the chart
    drawCandlestickChart(ctx, data, canvas.width, canvas.height)
  }
  
  function generateCandlestickData() {
    // Generate some random candlestick data
    const data = []
    let price = 190.5
  
    for (let i = 0; i < 50; i++) {
      const open = price
      const close = open + (Math.random() * 1 - 0.5)
      const high = Math.max(open, close) + Math.random() * 0.3
      const low = Math.min(open, close) - Math.random() * 0.3
  
      data.push({
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000 + 500,
      })
  
      price = close
    }
  
    return data
  }
  
  function drawCandlestickChart(ctx, data, width, height) {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height)
  
    // Find min and max values for scaling
    let minPrice = Math.min(...data.map((d) => d.low))
    let maxPrice = Math.max(...data.map((d) => d.high))
  
    // Add some padding
    const padding = (maxPrice - minPrice) * 0.1
    minPrice -= padding
    maxPrice += padding
  
    // Calculate scaling factors
    const priceRange = maxPrice - minPrice
    const candleWidth = (width / data.length) * 0.8
    const spacing = (width / data.length) * 0.2
  
    // Draw price grid lines
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1
  
    for (let price = Math.floor(minPrice); price <= Math.ceil(maxPrice); price += 0.2) {
      const y = height - ((price - minPrice) / priceRange) * height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
  
      // Draw price labels
      ctx.fillStyle = "#999"
      ctx.font = "10px Arial"
      ctx.fillText(price.toFixed(2), 5, y - 5)
    }
  
    // Draw candlesticks
    data.forEach((candle, i) => {
      const x = i * (candleWidth + spacing) + spacing / 2
      const openY = height - ((candle.open - minPrice) / priceRange) * height
      const closeY = height - ((candle.close - minPrice) / priceRange) * height
      const highY = height - ((candle.high - minPrice) / priceRange) * height
      const lowY = height - ((candle.low - minPrice) / priceRange) * height
  
      // Draw the wick
      ctx.beginPath()
      ctx.moveTo(x + candleWidth / 2, highY)
      ctx.lineTo(x + candleWidth / 2, lowY)
      ctx.strokeStyle = candle.open > candle.close ? "#ef5350" : "#26a69a"
      ctx.stroke()
  
      // Draw the body
      ctx.fillStyle = candle.open > candle.close ? "#ef5350" : "#26a69a"
      const bodyHeight = Math.abs(closeY - openY)
      const bodyY = Math.min(openY, closeY)
      ctx.fillRect(x, bodyY, candleWidth, bodyHeight)
    })
  }
  
  function setupEventListeners() {
    // Toggle dropdowns
    const dropdowns = document.querySelectorAll(".dropdown-header")
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", function () {
        const content = this.nextElementSibling
        if (content) {
          content.style.display = content.style.display === "none" ? "block" : "none"
        }
      })
    })
  
    // Order type selection
    const orderTypeOptions = document.querySelectorAll(".order-type-options .option")
    orderTypeOptions.forEach((option) => {
      option.addEventListener("click", function () {
        orderTypeOptions.forEach((opt) => opt.classList.remove("active"))
        this.classList.add("active")
      })
    })
  
    // Delivery options selection
    const deliveryOptions = document.querySelectorAll(".delivery-options .option")
    deliveryOptions.forEach((option) => {
      option.addEventListener("click", function () {
        deliveryOptions.forEach((opt) => opt.classList.remove("active"))
        this.classList.add("active")
      })
    })
  
    // Quantity input
    const quantityInput = document.querySelector(".quantity-input input")
    const increaseBtn = document.querySelector(".btn-increase")
    if (quantityInput && increaseBtn) {
      increaseBtn.addEventListener("click", () => {
        quantityInput.value = Number.parseInt(quantityInput.value) + 1
      })
    }
  
    // Watchlist item selection
    const stockItems = document.querySelectorAll(".stock-item")
    stockItems.forEach((item) => {
      item.addEventListener("click", function () {
        stockItems.forEach((i) => i.classList.remove("active"))
        this.classList.add("active")
      })
    })
  
    // Window resize handler for chart
    window.addEventListener("resize", () => {
      const chartElement = document.getElementById("stockChart")
      if (!chartElement) return
  
      const canvas = chartElement.querySelector("canvas")
      if (canvas) {
        canvas.width = chartElement.clientWidth
        canvas.height = chartElement.clientHeight
  
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const data = generateCandlestickData()
          drawCandlestickChart(ctx, data, canvas.width, canvas.height)
        }
      }
    })
  
    // Tab selection
    const tabs = document.querySelectorAll(".tab")
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabGroup = this.parentElement
        if (tabGroup) {
          const siblings = tabGroup.querySelectorAll(".tab")
          siblings.forEach((sib) => sib.classList.remove("active"))
          this.classList.add("active")
        }
      })
    })
  
    // Buy and sell buttons
    const buyButton = document.querySelector(".btn-buy")
    const sellButton = document.querySelector(".btn-sell")
  
    if (buyButton) {
      buyButton.addEventListener("click", function () {
        alert("Buy order initiated at price: " + this.textContent.split(" ")[1])
      })
    }
  
    if (sellButton) {
      sellButton.addEventListener("click", function () {
        alert("Sell order initiated at price: " + this.textContent.split(" ")[1])
      })
    }
  
    // Place order button
    const placeOrderButton = document.querySelector(".btn-place-order")
    if (placeOrderButton) {
      placeOrderButton.addEventListener("click", () => {
        const quantity = document.querySelector(".quantity-input input").value
        const price = document.querySelector(".price-input input").value
        alert(`Order review: Sell ${quantity} shares at ${price}`)
      })
    }
  }
  
  