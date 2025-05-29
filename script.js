(function loadHtml2Pdf() {
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
  script.onload = initDownloadButton;
  document.body.appendChild(script);
})();

function initDownloadButton() {
  document.getElementById("downloadBtn").addEventListener("click", () => {
    const resume = document.getElementById("resume");

    const opt = {
      margin: [0, 0, 0, 0], // no margin
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        background: "#ddd",
        scale: 2,
        useCORS: true,
        scrollY: 0,
        scrollX: 0,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
      },
      jsPDF: { unit: "mm", format: [220, 298], orientation: "p" },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        before: ".html2pdf__page-break",
      },
    };

    // clone to modify temporary version
    const clonedResume = resume.cloneNode(true);
    clonedResume.style.margin = "0";
    clonedResume.style.padding = "30px 40px 30px 40px";
    clonedResume.style.background = "#ddd";
    clonedResume.style.boxShadow = "none";
    clonedResume.style.maxWidth = "755px";
    clonedResume.style.width = "100%";
    clonedResume.style.height = "auto";

    // create a hidden container to hold cloned element
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = 0;
    container.style.left = 0;
    container.style.width = "100%";
    container.style.zIndex = "-1"; // behind everything
    container.appendChild(clonedResume);
    document.body.appendChild(container);

    html2pdf()
      .from(clonedResume)
      .set(opt)
      .save()
      .then(() => {
        document.body.removeChild(container); // clean up after download
      });
  });
}

async function loadResume() {
  const response = await fetch("resume/resume.md");
  const md = await response.text();

  const headingMatch = md.match(/<!--\s*heading\s*-->([\s\S]*?)<!--/);
  const leftMatch = md.match(/<!--\s*left\s*-->([\s\S]*?)<!--/);
  const rightMatch = md.match(/<!--\s*right\s*-->([\s\S]*)/);

  const heading = headingMatch ? headingMatch[1].trim() : "";
  const left = leftMatch ? leftMatch[1].trim() : "";
  const right = rightMatch ? rightMatch[1].trim() : "";

  document.querySelector("#heading").innerHTML = marked.parse(heading);
  document.querySelector("#left").innerHTML = marked.parse(left);
  document.querySelector("#right").innerHTML = marked.parse(right);

  document.getElementById("resume").innerHTML = document
    .getElementById("resume")
    .innerHTML.replace(
      /<!--\s*pagebreak\s*-->/g,
      '<div class="html2pdf__page-break"></div>'
    );
}

window.onload = loadResume;
