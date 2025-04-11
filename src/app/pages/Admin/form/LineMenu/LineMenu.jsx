export default function LineMenu() {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>Formulário: Linha de Itens</h2>
            <form>
                <label>Nome da Linha:</label>
                <br />
                <input type="text" placeholder="Ex: Linha 1" />
                <br />
                <br />

                <label>Número de Itens:</label>
                <br />
                <input type="number" min="1" />
                <br />
                <br />

                <button type="submit">Salvar Linha</button>
            </form>
        </div>
    );
}
