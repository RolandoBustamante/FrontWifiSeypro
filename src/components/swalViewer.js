import Swal from 'sweetalert2';

// Función del visor de documentos
export const showDocumentViewer = (documentos) => {
    if (!documentos || documentos.length === 0) return;

    let currentIndex = 0;

    const renderHtmlContent = () => {
        const { nombre, url } = documentos[currentIndex];
        const totalDocs = documentos.length;

        return `
      <div style="text-align: center; max-width: 100%; height: 100%; display: flex; flex-direction: column;">
        <h3 style="margin-bottom: 16px;">${nombre}</h3>
        <iframe
          src="https://drive.google.com/file/d/${url}/preview?vq=hd720"
          style="border: none; flex-grow: 1; max-width: 100%; max-height: calc(100% - 64px);"
          allow="autoplay"
        ></iframe>
        ${
            totalDocs > 1
                ? `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <button id="prevBtn" style="background: none; border: none; cursor: pointer;" ${
                    currentIndex === 0 ? 'disabled' : ''
                }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; color: #3f51b5;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <p style="margin: 0;">${currentIndex + 1}/${totalDocs}</p>
              <button id="nextBtn" style="background: none; border: none; cursor: pointer;" ${
                    currentIndex === totalDocs - 1 ? 'disabled' : ''
                }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; color: #3f51b5;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            `
                : ''
        }
      </div>
    `;
    };

    const handleNavigation = (direction) => {
        currentIndex += direction;
        Swal.update({
            html: renderHtmlContent(),
        });
        attachEventListeners(); // Reasignar eventos después de actualizar el contenido
    };

    const attachEventListeners = () => {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => handleNavigation(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => handleNavigation(1));
    };

    Swal.fire({
        html: renderHtmlContent(),
        width: '50%', // Ajusta el ancho del modal
        heightAuto: false, // Desactiva el ajuste automático de altura
        customClass: {
            popup: 'custom-swal-popup',
        },
        showConfirmButton: false,
        showCloseButton: true,
        allowOutsideClick: false,
        didRender: attachEventListeners,
        backdrop: `
      rgba(0, 0, 0, 0.5)
    `,
        willOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
                popup.style.zIndex = '9999';
            }
        },
    });
};
