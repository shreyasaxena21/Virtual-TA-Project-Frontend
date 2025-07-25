

async function submitQuery() {
  const question = document.getElementById("question").value;
  const answerBox = document.getElementById("answer");
  const spinner = document.getElementById("spinner");

  answerBox.textContent = "";
  spinner.style.display = "block";

  try {
    const response = await fetch("https://virtual-ta-project-backend.onrender.com/query", {
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
  } catch (error) {
    answerBox.textContent = "❌ Error fetching answer.";
    console.error(error);
  } finally {
    spinner.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("askBtn").addEventListener("click", submitQuery);
});

window.submitQuery = submitQuery;
