// We will use html2pdf.js for simple client-side PDF generation
// Load the library dynamically
(function loadHtml2Pdf() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = initDownloadButton;
    document.body.appendChild(script);
  })();
  
  function initDownloadButton() {
    document.getElementById('downloadBtn').addEventListener('click', () => {
      const resume = document.getElementById('resume');
      
      const opt = {
        margin:       0,
        filename:     'resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 1.5 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      html2pdf().from(resume).set(opt).save();
    });
  }
  