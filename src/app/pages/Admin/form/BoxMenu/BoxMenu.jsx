export default function BoxMenu() {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>Formulário: Caixa de Itens</h2>
            <form>
                <label>Nome da Caixa:</label>
                <br />
                <input type="text" placeholder="Ex: Caixa A" />
                <br />
                <br />

                <label>Descrição:</label>
                <br />
                <textarea placeholder="Digite a descrição..." rows="4" cols="30"></textarea>
                <br />
                <br />

                <button type="submit">Salvar Caixa</button>
            </form>
        </div>
    );
}
