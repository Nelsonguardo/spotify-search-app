// modal-component.js
export class ModalComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div id="detailMessage"></div>
                </div>
            </div>
        `;
        // Aquí puedes agregar cualquier lógica adicional del modal, como el manejo de eventos, etc.
    }
}

customElements.define('modal-component', ModalComponent);

