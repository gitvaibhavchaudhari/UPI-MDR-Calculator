# 💳 UPI MDR Calculator

A simple, responsive web-based **UPI MDR Calculator** that helps merchants estimate payment processing charges, GST on MDR, total charges, and net settlement amount.
The calculator works completely on the client side, so no transaction data is sent to a server.

# Live Demo
(https://upimdrcalculator.netlify.app/)



## 🚀 Features

* 💰 Calculate MDR charges on a transaction
* 🧾 Calculate GST on MDR
* 📊 View total payment charges
* 💵 Calculate net settlement amount
* 📈 Calculate effective transaction cost
* ⚡ Instant calculation
* 🎯 Predefined MDR rate options
* ✏️ Support for custom MDR rates
* 📅 Monthly UPI charge estimator
* 📋 Copy calculation results
* 🖨️ Print/download calculation report
* 🌙 Dark mode
* 📱 Responsive design for mobile, tablet, and desktop
* ❓ FAQ section
* 🍔 Responsive mobile navigation
* 🔒 Client-side calculation with no backend required

## 🛠️ Technologies Used

* **HTML5** – Website structure
* **CSS3** – Styling and responsive design
* **JavaScript (ES6)** – Calculator logic and interactivity

## 📂 Project Structure

```text
UPI-MDR-Calculator/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## ⚙️ How It Works

The calculator uses the following basic calculations:

### MDR Amount

```text
MDR Amount = Transaction Amount × MDR Rate / 100
```

### GST on MDR

```text
GST = MDR Amount × GST Rate / 100
```

### Total Charges

```text
Total Charges = MDR Amount + GST
```

### Net Settlement

```text
Net Settlement = Transaction Amount − Total Charges
```

### Effective Cost

```text
Effective Cost = (Total Charges / Transaction Amount) × 100
```

## 📊 Example

For a transaction of **₹10,000** with an MDR rate of **1%**:

```text
Transaction Amount = ₹10,000
MDR Rate = 1%
MDR Amount = ₹100
GST on MDR = ₹18
Total Charges = ₹118
Net Settlement = ₹9,882
```

> Note: The calculator is an estimation tool. Actual payment processing charges can vary depending on the payment provider, merchant agreement, payment method, merchant category, and applicable regulations.

## 🎨 User Interface

The application includes:

* Clean and modern interface
* Green financial-themed color scheme
* Responsive layout
* Light and dark themes
* Card-based calculation results
* Mobile-friendly navigation
* Interactive FAQ section

## 📅 Monthly Charge Estimator

The monthly estimator allows users to calculate estimated monthly charges based on:

* Average transaction value
* Transactions per day
* Working days per month
* MDR percentage

It displays:

* Monthly transaction volume
* Monthly MDR
* Monthly GST
* Total monthly charges
* Monthly net settlement

## ▶️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/UPI-MDR-Calculator.git
```

### 2. Open the project

Go to the project directory:

```bash
cd UPI-MDR-Calculator
```

### 3. Run the application

Simply open:

```text
index.html
```

in your web browser.

You can also use **VS Code Live Server** for development.

## 🌐 Deployment

This project can be deployed easily using static hosting services such as:

* GitHub Pages
* Netlify
* Vercel

No backend server or database is required.

## 🔒 Privacy

The calculator performs calculations directly in the browser.

No transaction information is sent to a backend server or stored in a database.

## ⚠️ Disclaimer

This calculator is an independent estimation utility.

Actual payment processing charges, MDR, GST, settlement deductions, and other applicable fees may vary depending on the payment provider, merchant agreement, payment instrument, merchant category, and applicable regulations.

Users should verify applicable charges with their payment service provider.

This project is not affiliated with NPCI, any bank, or any payment provider.

## 🔮 Future Improvements

Possible future enhancements include:

* Saving calculation history
* Exporting reports as PDF
* More payment methods
* Provider-specific fee configurations
* Advanced monthly analytics
* Transaction history dashboard
* PWA/mobile application support

## 👨‍💻 Author

**Vaibhav Kumar Chaudhari**

B.Tech Computer Science Engineering

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
