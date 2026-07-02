/*************************************************************
 * LEDGERINE — Backend Google Apps Script (GET-only, anti-CORS)
 * Deploy: Extensions > Apps Script > Deploy > Web App
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Salin URL Web App -> tempel ke config.js (API_URL)
 *************************************************************/

// ====== KREDENSIAL LOGIN (1 user) ======
var LOGIN_USER = "admin";
var LOGIN_PASS = "admin123";   // GANTI setelah deploy
var SECRET     = "ganti-token-rahasia-ini";

// Nama sheet
var SHEETS = { customers:"Customers", products:"Products", invoices:"Invoices", receipts:"Receipts" };

function doGet(e){
  var out = { ok:false };
  try{
    var action = e.parameter.action;
    var data   = e.parameter.data ? JSON.parse(e.parameter.data) : {};
    var token  = e.parameter.token || "";

    if(action === "login"){
      if(data.user === LOGIN_USER && data.pass === LOGIN_PASS){
        out = { ok:true, data:{ token:SECRET, user:LOGIN_USER } };
      } else { out = { ok:false, error:"Nama pengguna atau kata sandi salah" }; }
      return json(out);
    }

    // semua action lain wajib token valid
    if(token !== SECRET) return json({ ok:false, error:"Sesi tidak valid, silakan login ulang" });

    switch(action){
      case "bootstrap":      out = { ok:true, data:readAll() }; break;
      case "saveCustomer":   out = { ok:true, data:upsert("customers",data) }; break;
      case "deleteCustomer": out = { ok:true, data:remove("customers",data.id) }; break;
      case "saveProduct":    out = { ok:true, data:upsert("products",data) }; break;
      case "deleteProduct":  out = { ok:true, data:remove("products",data.id) }; break;
      case "saveInvoice":    out = { ok:true, data:upsert("invoices",data) }; break;
      case "deleteInvoice":  out = { ok:true, data:remove("invoices",data.id) }; break;
      case "saveReceipt":    out = { ok:true, data:saveReceipt(data) }; break;
      case "deleteReceipt":  out = { ok:true, data:deleteReceipt(data.id) }; break;
      default: out = { ok:false, error:"Aksi tidak dikenal: "+action };
    }
  }catch(err){ out = { ok:false, error:String(err) }; }
  return json(out);
}

function json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ss(){ return SpreadsheetApp.getActiveSpreadsheet(); }
function sheet(key){
  var name = SHEETS[key];
  var s = ss().getSheetByName(name);
  if(!s){ s = ss().insertSheet(name); s.appendRow(["id","json"]); }
  if(s.getLastRow()===0) s.appendRow(["id","json"]);
  return s;
}

// Setiap baris = [id, JSON string dari objek]
function readColl(key){
  var s = sheet(key), last = s.getLastRow();
  if(last < 2) return [];
  var rows = s.getRange(2,1,last-1,2).getValues();
  return rows.filter(function(r){return r[0];}).map(function(r){ return JSON.parse(r[1]); });
}
function readAll(){
  return {
    customers: readColl("customers"),
    products:  readColl("products"),
    invoices:  readColl("invoices"),
    receipts:  readColl("receipts")
  };
}
function findRow(s,id){
  var last = s.getLastRow(); if(last<2) return -1;
  var ids = s.getRange(2,1,last-1,1).getValues();
  for(var i=0;i<ids.length;i++){ if(ids[i][0]===id) return i+2; }
  return -1;
}
function upsert(key,obj){
  var s = sheet(key), row = findRow(s,obj.id), payload = JSON.stringify(obj);
  if(row>0){ s.getRange(row,2).setValue(payload); }
  else{ s.appendRow([obj.id,payload]); }
  return obj;
}
function remove(key,id){
  var s = sheet(key), row = findRow(s,id);
  if(row>0) s.deleteRow(row);
  return { id:id };
}

// Kwitansi: simpan + tandai invoice terkait jadi lunas
function saveReceipt(r){
  upsert("receipts",r);
  var invS = sheet("invoices");
  (r.invoiceIds||[]).forEach(function(iid){
    var row = findRow(invS,iid);
    if(row>0){
      var inv = JSON.parse(invS.getRange(row,2).getValue());
      inv.status = "paid"; inv.paidAt = r.date;
      invS.getRange(row,2).setValue(JSON.stringify(inv));
    }
  });
  return r;
}
function deleteReceipt(id){
  var recS = sheet("receipts"), row = findRow(recS,id);
  if(row>0){
    var r = JSON.parse(recS.getRange(row,2).getValue());
    var invS = sheet("invoices");
    (r.invoiceIds||[]).forEach(function(iid){
      var ir = findRow(invS,iid);
      if(ir>0){
        var inv = JSON.parse(invS.getRange(ir,2).getValue());
        inv.status = "unpaid"; inv.paidAt = "";
        invS.getRange(ir,2).setValue(JSON.stringify(inv));
      }
    });
    recS.deleteRow(row);
  }
  return { id:id };
}
