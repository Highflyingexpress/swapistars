import React from "react";
// import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { createRoot } from "react-dom/client";

import App from "./App";
import store from "./store";

import { GlobalStyles } from "./styles/global";
import { theme } from "./styles/theme/default";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error('Element with id "root" not found');
}
