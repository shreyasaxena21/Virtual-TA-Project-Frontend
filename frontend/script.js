async function submitQuery() {
  const question = document.getElementById("question").value;
  const file = document.getElementById("imageInput").files[0];

  let base64Image = null;
  if (file) {
    const reader = new FileReader();
    reader.onload = async function () {
      base64Image = reader.result.split(',')[1];
      await sendRequest(question, base64Image);
    };
    reader.readAsDataURL(file);
  } else {
    await sendRequest(question, null);
  }
}

async function sendRequest(question, image) {
  const response = await fetch("http://localhost:8000/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, image })
  });

  const data = await response.json();
  document.getElementById("answer").textContent = data.answer + "\n\nSources:\n" +
    data.links.map(l => `- ${l.text}: ${l.url}`).join('\n');
}

async function submitQuery() {
  const question = document.getElementById("question").value;
  const answerBox = document.getElementById("answer");
  const spinner = document.getElementById("spinner");

  answerBox.textContent = ""; // clear previous
  spinner.style.display = "block"; // show spinner

  try {
    const response = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    let sourcesText = "";
    if (data.links && data.links.length > 0) {
      sourcesText = "\n\nSources:\n" + data.links.map(link => `- ${link.text}: ${link.url}`).join("\n");
    }

    answerBox.textContent = data.answer + sourcesText;
  } catch (err) {
    answerBox.textContent = "❌ Error: Could not fetch answer.";
    console.error(err);
  } finally {
    spinner.style.display = "none"; // hide spinner
  }
}
