const spaces = {
  "rgb": {
    "name": "RGB",
    "channels": [
      {
        "name": "r",
        "min": 0,
        "max": 255
      },
      {
        "name": "g",
        "min": 0,
        "max": 255
      },
      {
        "name": "b",
        "min": 0,
        "max": 255
      }
    ],
    "getCss": color => `rgb(${color.r} ${color.g} ${color.b})`,
    "getDisplay": color => `rgb(${color.r} ${color.g} ${color.b})`,
    "getInput": () => {
      const inputHolder = document.createElement("div");
      const inputR = document.createElement("input");
      const inputG = document.createElement("input");
      const inputB = document.createElement("input");
      inputR.name = "guessR";
      inputG.name = "guessG";
      inputB.name = "guessB";
      inputHolder.innerText = "rgb(";
      inputHolder.className = "inputHolder";
      inputHolder.appendChild(inputR);
      inputHolder.appendChild(inputG);
      inputHolder.appendChild(inputB);
      inputHolder.innerHTML += ")";
      return inputHolder;
    },
    "guessToObj": (usp) => {
      const guessR = usp.get("guessR");
      const guessG = usp.get("guessG");
      const guessB = usp.get("guessB");
      return { r: parseInt(guessR), g: parseInt(guessG), b: parseInt(guessB) }
    }
  },
  "hex": {
    "name": "RGB Hexadecimal",
    "channels": [
      {
        "name": "r",
        "min": 0,
        "max": 255
      },
      {
        "name": "g",
        "min": 0,
        "max": 255
      },
      {
        "name": "b",
        "min": 0,
        "max": 255
      }
    ],
    "getCss": color => `#${Math.floor(color.r).toString(16).padStart(2, "0")}${Math.floor(color.g).toString(16).padStart(2, "0")}${Math.floor(color.b).toString(16).padStart(2, "0")}`,
    "getDisplay": color => `#${Math.floor(color.r).toString(16).padStart(2, "0")}${Math.floor(color.g).toString(16).padStart(2, "0")}${Math.floor(color.b).toString(16).padStart(2, "0")}`,
    "getInput": () => {
      const inputHolder = document.createElement("div");
      const inputElement = document.createElement("input");
      inputElement.name = "guess";
      inputHolder.innerText = "#";
      inputHolder.className = "inputHolder";
      inputHolder.appendChild(inputElement);
      return inputHolder;
    },
    "guessToObj": (usp) => {
      const guess = usp.get("guess");
      const guessNoHash = guess.startsWith("#") ? guess.substring(1) : guess;
      const r = parseInt(guessNoHash.substring(0, 2), 16);
      const g = parseInt(guessNoHash.substring(2, 4), 16);
      const b = parseInt(guessNoHash.substring(4, 6), 16);
      return { r, g, b };
    }
  },
  "hsl": {
    "name": "HSL",
    "channels": [
      {
        "name": "h",
        "min": 0,
        "max": 360
      },
      {
        "name": "s",
        "min": 0,
        "max": 100
      },
      {
        "name": "l",
        "min": 10,
        "max": 100
      }
    ],
    "getCss": color => `hsl(${color.h} ${color.s}% ${color.l}%)`,
    "getDisplay": color => `hsl(${color.h} ${color.s}% ${color.l}%)`,
    "getInput": () => {
      const inputHolder = document.createElement("div");
      const inputH = document.createElement("input");
      const inputS = document.createElement("input");
      const inputL = document.createElement("input");
      inputH.name = "guessH";
      inputS.name = "guessS";
      inputL.name = "guessL";
      inputHolder.innerText = "hsl(";
      inputHolder.className = "inputHolder";
      inputHolder.appendChild(inputH);
      inputHolder.appendChild(inputS);
      inputHolder.appendChild(inputL);
      inputHolder.innerHTML += ")";
      return inputHolder;
    },
    "guessToObj": (usp) => {
      const guessH = usp.get("guessH");
      const guessS = usp.get("guessS");
      const guessL = usp.get("guessL");
      return { h: parseInt(guessH), s: parseInt(guessS), l: parseInt(guessL) };
    }
  },
  "hsluv": {
    "name": "HSLuv",
    "channels": [
      {
        "name": "h",
        "min": 0,
        "max": 360
      },
      {
        "name": "s",
        "min": 0,
        "max": 100
      },
      {
        "name": "l",
        "min": 10,
        "max": 100
      }
    ],
    "getCss": color => {
      const conv = new Hsluv();
      conv.hsluv_h = color.h;
      conv.hsluv_s = color.s;
      conv.hsluv_l = color.l;
      conv.hsluvToRgb();
      conv.rgbToHex();
      return conv.hex;
    },
    "getDisplay": color => `HSLuv(${color.h} ${color.s}% ${color.l}%)`,
    "getInput": () => {
      const inputHolder = document.createElement("div");
      const inputH = document.createElement("input");
      const inputS = document.createElement("input");
      const inputL = document.createElement("input");
      inputH.name = "guessH";
      inputS.name = "guessS";
      inputL.name = "guessL";
      inputHolder.innerText = "HSLuv(";
      inputHolder.className = "inputHolder";
      inputHolder.appendChild(inputH);
      inputHolder.appendChild(inputS);
      inputHolder.appendChild(inputL);
      inputHolder.innerHTML += ")";
      return inputHolder;
    },
    "guessToObj": (usp) => {
      const guessH = usp.get("guessH");
      const guessS = usp.get("guessS");
      const guessL = usp.get("guessL");
      return { h: parseInt(guessH), s: parseInt(guessS), l: parseInt(guessL) };
    }
  },
  "hpluv": {
    "name": "HPLuv",
    "channels": [
      {
        "name": "h",
        "min": 0,
        "max": 360
      },
      {
        "name": "p",
        "min": 0,
        "max": 100
      },
      {
        "name": "l",
        "min": 10,
        "max": 100
      }
    ],
    "getCss": color => {
      const conv = new Hsluv();
      conv.hpluv_h = color.h;
      conv.hpluv_p = color.p;
      conv.hpluv_l = color.l;
      conv.hpluvToRgb();
      conv.rgbToHex();
      return conv.hex;
    },
    "getDisplay": color => {
      return `HPLuv(${color.h} ${color.p} ${color.l})`
    },
    "getInput": () => {
      const inputHolder = document.createElement("div");
      const inputH = document.createElement("input");
      const inputP = document.createElement("input");
      const inputL = document.createElement("input");
      inputH.name = "guessH";
      inputP.name = "guessP";
      inputL.name = "guessL";
      inputHolder.innerText = "HPLuv(";
      inputHolder.className = "inputHolder";
      inputHolder.appendChild(inputH);
      inputHolder.appendChild(inputP);
      inputHolder.appendChild(inputL);
      inputHolder.innerHTML += ")";
      return inputHolder;
    },
    "guessToObj": (usp) => {
      const guessH = usp.get("guessH");
      const guessP = usp.get("guessP");
      const guessL = usp.get("guessL");
      return { h: parseInt(guessH), p: parseInt(guessP), l: parseInt(guessL) };
    }
  }
}