export default function Slides() {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>Formulário: Slides</h2>
            <form>
                <label>Título do Slide:</label>
                <br />
                <input type="text" placeholder="Ex: Slide Inicial" />
                <br />
                <br />

                <label>Conteúdo:</label>
                <br />
                <textarea placeholder="Conteúdo do slide..." rows="4" cols="30"></textarea>
                <br />
                <br />

                <button type="submit">Salvar Slide</button>
            </form>
        </div>
    );
}
