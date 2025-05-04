import styles from './Address.module.css';

export default function Address() {
    function address(event: React.FocusEvent<HTMLInputElement>) {
        const cep = (event.target as HTMLInputElement).value;

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
            <h3>Endereço de entrega</h3>

            <form className={styles.FormContent}>
                <input type="text" id="cep" placeholder="Digite seu CEP*" onBlur={address} onSubmit={address} />
                <label className={styles.confirmCEP}>Confirmar CEP</label>
                <h4 className={styles.SectionTitle}>Resumo do Endereço</h4>
                <div className={styles.AddressGrid}>
                    <div className={styles.FieldGroup}>
                        <label>Bairro</label>
                        <input type="text" id="bairro" />
                    </div>
                    <div className={styles.FieldGroup}>
                        <label>Rua</label>
                        <input type="text" id="logradouro" />
                    </div>
                    <div className={styles.FieldGroup}>
                        <label>Nº da Casa</label>
                        <input type="text" placeholder="Digite o número da casa" />
                    </div>
                </div>

                <p>No momento, fazemos entregas apenas em Manaus-AM.</p>
            </form>
        </div>
    );
}
