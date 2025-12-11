import fetch from "node-fetch";

const url = "http://localhost:5000/api/health";
const totalRequests = 150000;
const concurrency = 1500;

async function sendRequest() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

async function runLoad() {
  const promises = [];
  for (let i = 0; i < totalRequests; i++) {
    if (promises.length >= concurrency) {
      await Promise.race(promises);
    }
    const p = sendRequest().finally(() => {
      promises.splice(promises.indexOf(p), 1);
    });
    promises.push(p);
  }
  await Promise.all(promises);
}

runLoad();