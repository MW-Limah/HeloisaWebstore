import styles from './Address.module.css';

export default function Address({ formData, updateFormData }) {
    function address(event: React.FocusEvent<HTMLInputElement>) {
        const cep = (event.target as HTMLInputElement).value;
        updateFormData('cep', cep);

        fetch('https://viacep.com.br/ws/' + cep + '/json/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar endereço, tente de novo ou preencha as informações manualmente.');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);

                // Exemplo de preenchimento dos campos, se existirem:
                const bairroInput = document.getElementById('bairro') as HTMLInputElement;
                const logradouroInput = document.getElementById('logradouro') as HTMLInputElement;

                updateFormData('bairro', data.bairro || '');
                updateFormData('rua', data.logradouro || '');

                if (bairroInput && logradouroInput) {
                    bairroInput.value = data.bairro || '';
                    logradouroInput.value = data.logradouro || '';
                }
            })
            .catch((error) => {
                alert(error.message);
                console.error('Erro: ', error);
            });
    }

    return (
        <div className={styles.Address}>
            <h4>Endereço de entrega</h4>
            <form className={styles.FormContent}>
                <input
                    type="text"
                    id="cep"
                    placeholder="Digite seu CEP*"
                    value={formData.cep}
                    onBlur={address}
                    onChange={(e) => updateFormData('cep', e.target.value)}
                />
                <label className={styles.confirmCEP}>Confirmar CEP</label>
                <h4 className={styles.SectionTitle}>Resumo do Endereço</h4>
                <div className={styles.AddressGrid}>
                    <div className={styles.FieldGroup}>
                        <input
                            type="text"
                            id="bairro"
                            placeholder="Bairro*"
                            value={formData.bairro}
                            onChange={(e) => updateFormData('bairro', e.target.value)}
                        />
                    </div>
                    <div className={styles.FieldGroup}>
                        <input
                            type="text"
                            id="logradouro"
                            placeholder="Rua*"
                            value={formData.rua}
                            onChange={(e) => updateFormData('rua', e.target.value)}
                        />
                    </div>
                    <div className={styles.FieldGroup}>
                        <input
                            type="text"
                            id="numero"
                            placeholder="Digite o número da casa"
                            value={formData.numero}
                            onChange={(e) => updateFormData('numero', e.target.value)}
                        />
                    </div>
                </div>

                <p>No momento, fazemos entregas apenas em Manaus-AM.</p>
            </form>
        </div>
    );
}
