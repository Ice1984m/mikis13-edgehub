const year =
  document.querySelector("#year");

if (year) {
  year.textContent =
    new Date().getFullYear();
}

const check =
  document.querySelector("#lastCheck");

if (check) {
  check.textContent =
    new Date().toLocaleString("nl-BE");
}

const paymentButton =
  document.querySelector("#paymentButton");

const paymentStatus =
  document.querySelector("#paymentStatus");

const paymentUrl =
  window.MIKIS13_CONFIG?.paymentUrl || "";

if (
  paymentButton &&
  /^https:\/\//i.test(paymentUrl)
) {

  paymentButton.href =
    paymentUrl;

  paymentButton.target =
    "_blank";

  paymentButton.rel =
    "noopener noreferrer";

  paymentButton.textContent =
    "BETALEN VIA REVOLUT";

  paymentButton.classList.remove(
    "disabled"
  );

  if (paymentStatus) {
    paymentStatus.textContent =
      "Betaling opent in een beveiligde externe betaalpagina.";
  }
}

async function loadBuildInfo() {

  const el =
    document.querySelector("#buildInfo");

  if (!el) return;

  try {

    const response =
      await fetch(
        "./data/build-info.json",
        {
          cache:"no-store"
        }
      );

    if (!response.ok) {
      throw new Error();
    }

    const data =
      await response.json();

    el.textContent =
      `${data.short_commit} • ${data.generated}`;

  } catch {

    el.textContent =
      "Buildinformatie beschikbaar na GitHub deployment";

  }
}

loadBuildInfo();

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register(
          "./service-worker.js"
        )
        .catch(console.warn);

    }
  );

}
