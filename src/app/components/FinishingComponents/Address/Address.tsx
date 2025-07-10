import styles from './Address.module.css';

export default function Address({ formData, updateFormData }) {
    function address() {
        const cep = formData.cep;

        if (!cep || cep.length < 8) {
            alert('Digite um CEP válido.');
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar endereço.');
                }
                return response.json();
            })
            .then((data) => {
                if (data.erro) {
                    throw new Error('CEP não encontrado.');
                }

                updateFormData('bairro', data.bairro || '');
                updateFormData('rua', data.logradouro || '');
            })
            .catch((error) => {
                alert('Erro ao buscar endereço, verifique o CEP ou preencha as informações manualmente.');
                console.error('Erro:', error);
            });
    }

    return (
        <div className={styles.Address}>
            <h4>Endereço de entrega</h4>
            <form className={styles.FormContent} onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    id="cep"
                    placeholder="Digite seu CEP*"
                    value={formData.cep}
                    onChange={(e) => {
                        const valuewithoutSpaces = e.target.value.replace(/\s/g, '');
                        updateFormData('cep', valuewithoutSpaces);
                    }}
                />
                <button className={styles.confirmCEP} type="button" onClick={address}>
                    Confirmar CEP
                </button>
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
