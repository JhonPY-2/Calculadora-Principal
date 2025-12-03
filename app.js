const pantalla = document.getElementById("resultado");
const numeros = document.querySelectorAll(".numero");
const operadores = document.querySelectorAll(".operador");

let current = "0";  
pantalla.value = current;

// ------------------------
// NÚMEROS
// ------------------------
numeros.forEach(boton => {
  boton.addEventListener("click", () => {

    if (pantalla.value === "Error") {
      current = "0";
      pantalla.value = "0";
    }

    if (current === "0") {
      current = boton.textContent; 
    } else {
      current += boton.textContent;
    }
    pantalla.value = current;
  });
});


operadores.forEach(boton => {
  boton.addEventListener("click", () => {
    const op = boton.textContent.trim();

    if (op === "C") {
      clearAll();
      return;
    }

    if (op === "←") {
      deleteLast();
      return;
    }

    if (op === "=") {
      calcular();
      return;
    }

    if (op === ".") {
      handleDecimal();
      return;
    }

    const listaOps = ["+", "-", "x", "%", "/"];
    if (listaOps.includes(op)) {
      handleOperator(op);
      return;
    }
  });
});


function deleteLast() {
  if (pantalla.value === "Error") {
    
    current = "0";
    pantalla.value = "0";
    return;
  }

  if (current.length <= 1) {
    current = "0";
  } else {
    current = current.slice(0, -1);
  }
  pantalla.value = current;
}


function clearAll() {
  current = "0";
  pantalla.value = "0";
}


function handleDecimal() {
  if (pantalla.value === "Error") {
    current = "0";
    pantalla.value = "0";
  }

  const last = current.slice(-1);


  if (current === "0" || ["+", "-", "x", "/", "%"].includes(last)) {
    current = current === "0" && last !== "." ? "0." : current + "0.";
    pantalla.value = current;
    return;
  }

  let partes = current.split(/[\+\-x\/%]/);
  let ultimo = partes[partes.length - 1];


  if (!ultimo.includes(".")) {
    current += ".";
    pantalla.value = current;
  }
}

function handleOperator(op) {

  if (pantalla.value === "Error") {
    current = "0";
    pantalla.value = "0";
  }

  const last = current.slice(-1);


  if (current === "0") {
    alert("El formato usado no es válido!");
    return;
  }


  if (/[\+\-x\/%]/.test(last)) {
    alert("El formato usado no es válido!");
    return;
  }

  current += op;
  pantalla.value = current;
}


function calcular() {
  try {
    if (current.trim() === "") throw new Error("No hay nada para calcular");

    let expr = current;

    expr = expr.replace(/(\d+)([\+\-x\/])(\d+)%/g, (_, a, op, b) => {
      return `${a}${op}(${a}*${b}/100)`;
    });

    expr = expr.replace(/(\d+)%/g, (_, num) => `(${num}/100)`);


    expr = expr.replace(/x/g, "*");


    if (/[\+\-\*\/]$/.test(expr)) throw new Error("Expresión inválida");

    let resultado = eval(expr);


    if (!isFinite(resultado)) throw new Error("Error de cálculo");

    pantalla.value = resultado;
    current = String(resultado);


    setTimeout(() => {
      current = "0";
      pantalla.value = "0";
    }, 2000);

  } catch (error) {
    pantalla.value = "Error";
    current = "0";

    setTimeout(() => {
      pantalla.value = "0";
    }, 2000);
  }
}
