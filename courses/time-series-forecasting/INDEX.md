# Time Series & Forecasting

Everything you need to model and forecast time-ordered data — from classical statistics
to gradient boosting to deep learning. You will learn not just how to call a library but
why each method works, when it fails, and how to evaluate it honestly.

---

## Who this course is for

You know Python and pandas and have seen regression before. You want to understand what
ARIMA actually fits, why random-shuffle CV is wrong for time series, and when to reach
for LightGBM instead of statsmodels.

**In plain words:** a time series is data where order matters, and forecasting is guessing the
next values from the past without peeking at the future. Chapters 1–3 teach you to take a
series apart: trend, seasonal wave and noise, and how to tell whether its behaviour is stable.
Chapters 4–5 build the classic forecasters — exponential smoothing and ARIMA — and check what
they leave behind. Chapter 6 shows how to score any forecaster honestly by replaying history,
and chapters 7–8 turn forecasting into ordinary machine learning with lag and calendar features
and gradient boosting. Chapters 9–12 widen the view to several series at once (VAR), forecasting
risk itself (GARCH), honest uncertainty ranges (prediction intervals) and deep global models;
chapter 13 asks you to build the whole system yourself.

---

## Part 1 — Classical Foundations (ch. 1–5)

| # | Chapter | Topic |
|---|---------|-------|
| 1 | Time Series Structure | Trend, seasonality, noise; datetime indexing |
| 2 | Stationarity & ACF/PACF | ADF test, differencing, autocorrelation plots |
| 3 | Decomposition | Classical MA-based, STL |
| 4 | Exponential Smoothing | SES from scratch, Holt, Holt-Winters |
| 5 | ARIMA & SARIMA | Identification, fitting, diagnostics |

## Part 2 — Evaluation and ML (ch. 6–8)

| # | Chapter | Topic |
|---|---------|-------|
| 6 | Backtesting | Rolling-origin CV; why random shuffle is wrong |
| 7 | ML Forecasting Features | Lags, rolling stats, calendar, cyclical encoding |
| 8 | Gradient Boosting for TS | LightGBM, direct/recursive, early stopping |

## Part 3 — Advanced Topics (ch. 9–12)

| # | Chapter | Topic |
|---|---------|-------|
| 9  | VAR & Granger Causality | Multivariate, impulse response |
| 10 | ARCH & GARCH | Volatility modeling |
| 11 | Prediction Intervals | Quantile regression, conformal, calibration |
| 12 | Deep Forecasting | DeepAR, N-BEATS, TFT overview |

## Capstone (ch. 13)

Build a complete forecasting system from scratch: Holt-Winters, AR(p), a rolling-origin
backtester, LightGBM baseline, calibrated prediction intervals, and a written comparison.

---

## Prerequisites

- **Python for Data Work ch. 12** — pandas datetime indexing and resample
- **Classical ML ch. 2** — linear regression (you will use it as a TS baseline)
- Basic probability: mean, variance, covariance

---

## Environment

```
pip install statsmodels scipy lightgbm arch numpy pandas matplotlib scikit-learn
```

---

## References

- Hyndman, R.J. & Athanasopoulos, G. *Forecasting: Principles and Practice*, 3rd ed. (free online at otexts.com/fpp3)
- statsmodels documentation — tsa module
- arch library documentation — GARCH models
