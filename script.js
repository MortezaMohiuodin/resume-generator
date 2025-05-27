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
        background: "#e4e4e4",
        scale: 2,
        useCORS: true,
        scrollY: -50,
        scrollX: -20,
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
    clonedResume.style.padding = "30px 0px 30px 30px";
    clonedResume.style.background = "#e4e4e4";
    clonedResume.style.boxShadow = "none";
    clonedResume.style.maxWidth = "100%";
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
  const headingResponse = await fetch("resume/heading.md");
  const leftResponse = await fetch("resume/left.md"); // relative path
  const rightResponse = await fetch("resume/right.md"); // relative path

  // relative path
  const headingMd = await headingResponse.text();
  const leftMd = await leftResponse.text();
  const rightMd = await rightResponse.text();

  const resumeContainer = document.getElementById("resume");
  const page = document.createElement("section");
  const heading = document.querySelector("#heading");
  const left = document.querySelector("#left");
  const right = document.querySelector("#right");

  page.classList.add("page");
  resumeContainer.appendChild(page);
  heading.innerHTML = marked.parse(headingMd.trim());
  left.innerHTML = marked.parse(leftMd.trim());
  right.innerHTML = marked.parse(rightMd.trim());

  const resume = document.getElementById("resume");
  resume.innerHTML = resume.innerHTML.replace(
    /<!--\s*pagebreak\s*-->/g,
    '<div class="html2pdf__page-break"></div>'
  );
}

window.onload = loadResume;
