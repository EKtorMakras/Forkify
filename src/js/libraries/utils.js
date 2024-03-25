import { TIMEOUT_SECONDS } from "../common/config";

// ================== Strings ================== //
export function toProperCase(str) {
  if (typeof str !== "string") {
    throw new Error("toProperCase: Input must be a string.");
  }

  if (str.length === 0) {
    return str; // Return an empty string
  }

  return str[0].toUpperCase() + str.substring(1).toLowerCase();
}

// ================== Numbers ================== //
export function padTo2Digits(num) {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("padTo2Digits: Input must be a number.");
  }

  return num.toString().padStart(2, "0");
}

export function formatDecimals(num, digits = 2) {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("formatDecimals: Input must be a number.");
  }

  if (Number.isInteger(num)) {
    // Check if the number is an integer (no decimal part)
    return num.toString(); // Return the integer as a string
  } else {
    return num.toFixed(digits); // Format with corresponding decimal places
  }
}

export function randomNumberBetween(min, max) {
  if (typeof min !== "number" || isNaN(min) || typeof max !== "number" || isNaN(max)) {
    throw new Error("randomNumberBetween: Both arguments must be numbers.");
  }

  if (min > max) {
    throw new Error(
      "randomNumberBetween: The first argument (min) must be less than or equal to the second argument (max)."
    );
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function numberIsEven(number) {
  if (typeof number !== "number" || isNaN(number)) {
    throw new Error("numberIsEven: Input must be a number.");
  }

  return number % 2 === 0;
}

export function getAverage(...nums) {
  if (nums.length === 0) {
    throw new Error("getAverage: At least one number must be provided.");
  }

  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}

export function formatNumber(number, notation, locale) {
  if (typeof number !== "number" || isNaN(number)) {
    throw new Error("formatNumber: Input must be a number.");
  }

  if (typeof notation !== "string" || (notation !== "compact" && notation !== "scientific")) {
    throw new Error("formatNumber: Notation must be either 'compact' or 'scientific'.");
  }

  if (typeof locale !== "string") {
    throw new Error("formatNumber: Locale must be a string representing a valid locale.");
  }

  const NUMBER_FORMATTER = new Intl.NumberFormat(locale, {
    notation,
  });

  return NUMBER_FORMATTER.format(number);
}

export function formatCurrency(number, currency = "USD", locale = "en-US") {
  if (typeof number !== "number" || isNaN(number)) {
    throw new Error("formatCurrency: Input must be a number.");
  }

  if (typeof currency !== "string") {
    throw new Error("formatCurrency: Currency must be a string representing a valid currency code.");
  }

  if (typeof locale !== "string") {
    throw new Error("formatCurrency: Locale must be a string representing a valid locale.");
  }

  const CURRENCY_FORMATTER = new Intl.NumberFormat(locale, {
    currency: currency,
    style: "currency",
  });

  return CURRENCY_FORMATTER.format(number);
}

// ================== Dates ================== //
export function getNextDay(i, length = 7) {
  if (typeof i !== "number" || isNaN(i)) {
    throw new Error("getNextDay: The first argument must be a number representing the number of days to skip.");
  }

  if (typeof length !== "number" || isNaN(length) || length < 1) {
    throw new Error("getNextDay: The second argument must be a positive number representing the length of the week.");
  }

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const nextDayNumber = new Date().getDay() + 1;
  const nextDay = days[(nextDayNumber + i) % length];

  return nextDay;
}

export function formatDate(date = new Date()) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("formatDate: Input must be a valid Date object.");
  }

  return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join("-");
}

export function formatRelativeDate(toDate, fromDate = new Date(), locale) {
  if (!(toDate instanceof Date) || isNaN(toDate)) {
    throw new Error("formatRelativeDate: The first argument must be a valid Date object representing the target date.");
  }

  if (!(fromDate instanceof Date) || isNaN(fromDate)) {
    throw new Error("formatRelativeDate: The second argument must be a valid Date object representing the base date.");
  }

  if (typeof locale !== "string") {
    throw new Error("formatRelativeDate: Locale must be a string representing a valid locale.");
  }

  const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

  const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });

  let duration = (toDate - fromDate) / 1000;

  for (let i = 0; i <= DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return RELATIVE_DATE_FORMATTER.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

// ================== Colors ================== //
export function getColor(colorName) {
  const color = getComputedStyle(document.documentElement).getPropertyValue(`--clr-${colorName}`);
  return color;
}

export function rgbaToHex(r, g, b, a = 1) {
  // Check if the arguments are valid numbers within the valid range
  if (
    !Number.isInteger(r) ||
    r < 0 ||
    r > 255 ||
    !Number.isInteger(g) ||
    g < 0 ||
    g > 255 ||
    !Number.isInteger(b) ||
    b < 0 ||
    b > 255 ||
    typeof a !== "number" ||
    a < 0 ||
    a > 1
  ) {
    return null;
  }

  // Convert each color component to its hexadecimal representation
  const hexR = Math.round(r).toString(16).padStart(2, "0");
  const hexG = Math.round(g).toString(16).padStart(2, "0");
  const hexB = Math.round(b).toString(16).padStart(2, "0");

  // Convert alpha to a hexadecimal representation
  const hexA = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");

  // Construct the final hexadecimal color string
  let hexColor = `#${hexR}${hexG}${hexB}`;

  // Add the alpha component if it's not equal to 1
  if (a !== 1) {
    hexColor += hexA;
  }

  return hexColor;
}

export function hexToRgba(hex) {
  // Check if the argument is a string
  if (typeof hex !== "string") {
    return null;
  }

  // Remove the '#' symbol if present
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }

  // Check if the hex value has a valid length
  if (!/^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{8}$/.test(hex)) {
    return null;
  }

  // Separate the color components
  const hasAlpha = hex.length === 8;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const a = hasAlpha ? parseInt(hex.substr(6, 2), 16) / 255 : 1;

  // Check if the parsed values are valid
  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
    return null;
  }

  // Construct the final RGBA color string
  let rgbaColor = `rgba(${r}, ${g}, ${b}`;
  if (a !== 1) {
    rgbaColor += `, ${a}`;
  }
  rgbaColor += ")";

  return rgbaColor;
}

export function adjustColors(colors, percent, mode = "darken") {
  //@ Check if the colors argument is an array
  if (!Array.isArray(colors)) {
    // If the colors argument is a string, convert it to an array
    if (typeof colors === "string") {
      colors = [colors];
    } else {
      // Return null if colors is neither an array nor a string
      return null;
    }
  }

  //@ Validate the percent argument
  if (typeof percent !== "number" || percent <= 0 || percent > 100) {
    console.log(`The percentage argument ${percent} is not a valid number. Please provide a number between 0 and 100.`);
    return null;
  }

  //@ Validate the mode argument
  if (mode !== "darken" && mode !== "lighten") {
    console.log(`The mode argument ${mode} is not valid. Please provide either 'darken' or 'lighten'.`);
    return null;
  }

  //@ Adjust each color in the array based on the specified mode and percentage
  const adjustmentAmount = percent / 100;
  const adjustedColors = colors.map((color) => {
    let rgbaColor;
    let isRGBA = false;
    let opacity = 1; // Default opacity value

    //@ Check if the color is already in RGBA format
    if (color.startsWith("rgb")) {
      rgbaColor = color;
      isRGBA = true;
    } else {
      //@ Check if the color has an opacity value in HEX format
      if (color.length === 9) {
        opacity = parseInt(color.substr(6, 2), 16) / 255;
        console.log(opacity);
      }

      // Convert the color to RGBA format
      rgbaColor = hexToRgba(color);

      if (rgbaColor === null) {
        console.log(`The color ${color} is not a valid hexadecimal color.`);
        return null;
      }
    }
    // Extract the color components from the RGBA color string
    const rgbaValues = rgbaColor.match(/[\d.]+/g);
    const r = parseInt(rgbaValues[0]);
    const g = parseInt(rgbaValues[1]);
    const b = parseInt(rgbaValues[2]);
    const a = isRGBA ? parseFloat(rgbaValues[3] ?? 1) : opacity;

    // Adjust the color components
    let adjustedR, adjustedG, adjustedB;
    if (mode === "darken") {
      adjustedR = Math.max(Math.round(r - r * adjustmentAmount), 0);
      adjustedG = Math.max(Math.round(g - g * adjustmentAmount), 0);
      adjustedB = Math.max(Math.round(b - b * adjustmentAmount), 0);
    } else if (mode === "lighten") {
      adjustedR = Math.min(Math.round(r + (255 - r) * adjustmentAmount), 255);
      adjustedG = Math.min(Math.round(g + (255 - g) * adjustmentAmount), 255);
      adjustedB = Math.min(Math.round(b + (255 - b) * adjustmentAmount), 255);
    }

    // Convert the adjusted color back to the original format
    let adjustedColor;
    if (isRGBA) {
      if (a === 1) {
        adjustedColor = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
      } else {
        adjustedColor = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${a})`;
      }
    } else {
      adjustedColor = rgbaToHex(adjustedR, adjustedG, adjustedB, a);

      if (adjustedColor === null) {
        console.log(
          `Unable to convert the adjusted color (${adjustedR}, ${adjustedG}, ${adjustedB}, ${a}) to hexadecimal format.`
        );
        return null;
      }
    }

    return adjustedColor;
  });

  return adjustedColors;
}

// ================== Arrays ================== //
export function arrFirst(arr, n = 1) {
  // Directly return the first element if n is 1
  if (n === 1) return arr[0];
  // Use slice to get the first n elements efficiently
  return arr.slice(0, n);
}

export function arrLast(arr, n = 1) {
  // Directly return the last element if n is 1
  if (n === 1) return arr[arr.length - 1];
  // Use slice with a negative start index to get the last n elements efficiently
  return arr.slice(-n);
}

export function arrRandom(arr) {
  return arr[randomNumberBetween(0, arr.length - 1)];
}

export function arrGetUniqueObjectValues(arr, value) {
  return [
    ...new Set(
      arr.map((item) => {
        return item[value];
      })
    ),
  ];
}

export function arrGroupBy(arr, key) {
  return arr.reduce((group, element) => {
    const keyValue = element[key];

    return {
      ...group,
      [keyValue]: [...(group[keyValue] ?? []), element],
    };
  }, {});
}

export function arrIsNotEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

export function arrShuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

export function arrFindMinMaxByKey(arr, key) {
  if (arr.length === 0) {
    return { min: undefined, max: undefined };
  }

  let min = arr[0][key];
  let max = arr[0][key];

  arr.forEach((element) => {
    const value = element[key];
    if (value < min) min = value;
    if (value > max) max = value;
  });

  return { min, max };
}

// ================== DOM ================== //
// Global Event Listener
export function addGlobalEventListener(type = "click", selector, callback, parent = document, options) {
  parent.addEventListener(
    type,
    (e) => {
      if (e.target.matches(selector)) callback(e);
    },
    options
  );
}

// Get Dom Element //
export function getDomElement(selection, multiple = false, parent = document) {
  let element;

  if (multiple) {
    element = [...parent.querySelectorAll(selection)];
  } else {
    element = parent.querySelector(selection);
  }

  if (element) {
    return element;
  }

  throw new Error("no element selected");
}

// Create Element  //
export function createHtmlElement(htmlString) {
  const template = document.createElement("template");
  htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = htmlString;

  return template.content.firstElementChild;
}

export function createElement(options = {}, type = "div") {
  const element = document.createElement(type);

  Object.entries(options).forEach(([key, value]) => {
    if (key === "class") {
      element.classList.add(value);
      return;
    }

    if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
      return;
    }

    if (key === "text") {
      element.textContent = value;
      return;
    }

    element.setAttribute(key, value);
  });
  return element;
}

// Delete All Child Elements  //
export function deleteChildElements(parentElement) {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
}

// ================== Local Storage ================== //
export function getItemLs(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setItemLs(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

export function updateItemLs(key, property, value) {
  const obj = getItemLs(key);

  if (obj) {
    obj[property] = value;
    setItemLs(key, obj);
  } else {
    setItemLs(key, {
      [property]: value,
    });
  }
}

// ================== Fetch ================== //
export function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

export async function getJSON(url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// ================== Other ================== //
export function sanitizeInput(inputValue) {
  const div = document.createElement("div");
  div.textContent = inputValue;
  return div.innerHTML;
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

// Get parameters by name from url
export function getParameterValue(paramName, url = window.location.href) {
  if (!url) url = window.location.href;
  const regex = new RegExp(`[?&]${paramName}(=([^&#]*))`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
