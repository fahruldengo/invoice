/* =========================================================
   KONFIGURASI LEDGERINE
   Isi API_URL dengan URL Web App dari Google Apps Script.
   Selama API_URL kosong, aplikasi berjalan mode DEMO (localStorage)
   dengan login  admin / admin123.
   ========================================================= */
window.LEDGERINE_CONFIG = {
  // Tempel URL Web App di sini, contoh:
  // API_URL: "https://script.google.com/macros/s/AKfycbx....../exec",
  API_URL: "",

  COMPANY: {
    name:    "CV. VIDYA AMALIAH",
    tagline: "Strategic Business Partner Telkomsel",
    address: "Jl. Nani Wartabone Ruko Bonanza No.2 RT.002 RW. 004 Kel. Limba U1, Kota Selatan, Kota Gorontalo, GORONTALO, GORONTALO, 96111",
    phone:   "0811435431",
    email:   "cvvidyaamaliah@gmail.com",
    npwp:    "934538901822000",
    city:    "Gorontalo",
    bank: {
      name:    "PT Bank Mandiri Tbk.",
      branch:  "Gorontalo",
      account: "150 00 5551333 5",
      holder:  "CV Vidya Amaliah"
    },
    signer:  "Farin Pohantalo",
    title:   "General Manager"
  }
};
