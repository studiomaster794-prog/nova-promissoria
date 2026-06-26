/**
 * PROMISSÓRIA DIGITAL - LÓGICA CORE
 * Desenvolvedor Full Stack Sênior
 */

// ==========================================================================
// ESTADO GLOBAL DO APLICATIVO
// ==========================================================================
let state = {
    clientes: [],
    credor: {
        nome: "",
        documento: "",
        telefone: "",
        endereco: "",
        cidade: ""
    },
    ultimoBackup: ""
};

// Elementos DOM principais
const elements = {
    // Abas de navegação
    tabs: document.querySelectorAll('.menu-item'),
    tabContents: document.querySelectorAll('.tab-content'),
    pageTitle: document.getElementById('page-title'),
    pageSubtitle: document.getElementById('page-subtitle'),
    
    // Dashboard
    dashTotalVendido: document.getElementById('dash-total-vendido'),
    dashTotalRecebido: document.getElementById('dash-total-recebido'),
    dashTotalAberto: document.getElementById('dash-total-aberto'),
    dashTotalClientes: document.getElementById('dash-total-clientes'),
    tableRecentClients: document.getElementById('tbody-recent-clients'),
    btnDashboardVerTodos: document.getElementById('btn-dashboard-ver-todos'),
    
    // Clientes e Vendas (Busca)
    inputBuscaCliente: document.getElementById('input-busca-cliente'),
    inputBuscaTelefone: document.getElementById('input-busca-telefone'),
    selectFiltroSituacao: document.getElementById('select-filtro-situacao'),
    tableClientsFull: document.getElementById('tbody-clients-full'),
    
    // Cadastro
    formCadastro: document.getElementById('form-cadastro-venda'),
    vendaValor: document.getElementById('venda-valor'),
    vendaEntrada: document.getElementById('venda-entrada'),
    vendaSaldoCalculado: document.getElementById('venda-saldo-calculado'),
    vendaData: document.getElementById('venda-data'),
    vendaVencimento: document.getElementById('venda-vencimento'),
    
    // Configurações do Credor e Backup
    formConfigCredor: document.getElementById('form-config-credor'),
    credorNome: document.getElementById('credor-nome'),
    credorDocumento: document.getElementById('credor-documento'),
    credorTelefone: document.getElementById('credor-telefone'),
    credorEndereco: document.getElementById('credor-endereco'),
    credorCidade: document.getElementById('credor-cidade'),
    credorNomeTopo: document.getElementById('credor-nome-topo'),
    txtDataUltimoBackup: document.getElementById('txt-data-ultimo-backup'),
    btnBackupDownload: document.getElementById('btn-backup-download'),
    btnBackupRestoreTrigger: document.getElementById('btn-backup-restore-trigger'),
    inputBackupFile: document.getElementById('input-backup-file'),
    btnExportExcel: document.getElementById('btn-export-excel'),
    btnDangerReset: document.getElementById('btn-danger-reset'),
    
    // Modal de Detalhes
    modalDetails: document.getElementById('modal-details'),
    btnCloseDetails: document.getElementById('btn-close-details'),
    btnFecharDetalhes: document.getElementById('btn-fechar-detalhes'),
    detClienteNome: document.getElementById('det-cliente-nome'),
    detClienteCpf: document.getElementById('det-cliente-cpf'),
    detClienteTelefone: document.getElementById('det-cliente-telefone'),
    detClienteEndereco: document.getElementById('det-cliente-endereco'),
    detClienteBairroCidade: document.getElementById('det-cliente-bairro-cidade'),
    detClienteReferencia: document.getElementById('det-cliente-referencia'),
    detClienteObs: document.getElementById('det-cliente-obs'),
    detVendaProduto: document.getElementById('det-venda-produto'),
    detVendaData: document.getElementById('det-venda-data'),
    detVendaVencimento: document.getElementById('det-venda-vencimento'),
    detResumoValor: document.getElementById('det-resumo-valor'),
    detResumoPago: document.getElementById('det-resumo-pago'),
    detResumoRestante: document.getElementById('det-resumo-restante'),
    detResumoSituacao: document.getElementById('det-resumo-situacao'),
    tablePagamentosHistorico: document.getElementById('tbody-pagamentos-historico'),
    btnAbrirNovoPagamento: document.getElementById('btn-abrir-novo-pagamento'),
    btnDetalhesWhatsapp: document.getElementById('btn-detalhes-whatsapp'),
    btnDetalhesPromissoria: document.getElementById('btn-detalhes-promissoria'),
    
    // Modal de Pagamento
    modalPagamento: document.getElementById('modal-pagamento'),
    btnClosePagamento: document.getElementById('btn-close-pagamento'),
    btnCancelarPagamento: document.getElementById('btn-cancelar-pagamento'),
    formNovoPagamento: document.getElementById('form-novo-pagamento'),
    pagamentoValor: document.getElementById('pagamento-valor'),
    pagamentoData: document.getElementById('pagamento-data'),
    pagamentoForma: document.getElementById('pagamento-forma'),
    pagamentoObs: document.getElementById('pagamento-obs'),
    
    // Modal Confirmação
    modalConfirmacao: document.getElementById('modal-confirmacao'),
    btnCloseConfirm: document.getElementById('btn-close-confirm'),
    btnConfirmCancel: document.getElementById('btn-confirm-cancel'),
    btnConfirmAction: document.getElementById('btn-confirm-action'),
    confirmTitle: document.getElementById('confirm-title'),
    confirmMessage: document.getElementById('confirm-message'),
    
    // Modal Promissória Preview
    modalPromissoriaPreview: document.getElementById('modal-promissoria-preview'),
    btnClosePromissoriaPreview: document.getElementById('btn-close-promissoria-preview'),
    btnFecharPromissoriaPreview: document.getElementById('btn-fechar-promissoria-preview'),
    promissoriaViewContainer: document.getElementById('promissoria-view-container'),
    btnTriggerPrint: document.getElementById('btn-trigger-print'),
    
    // Área de Impressão Exclusiva
    printArea: document.getElementById('print-area'),
    
    // Toast
    toast: document.getElementById('toast-notification'),
    toastMessage: document.querySelector('.toast-message')
};

// Cliente atualmente selecionado para manipulação nos modais
let clienteSelecionadoId = null;

// Armazena a ação confirmada do modal de confirmação genérico
let acaoConfirmadaCallback = null;

// ==========================================================================
// MÉTODOS DE FORMATAÇÃO E UTILITÁRIOS
// ==========================================================================

// Formata valores de número para moeda BRL
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Formata datas YYYY-MM-DD para DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Retorna a data de hoje no formato YYYY-MM-DD
function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Adiciona dias a uma data
function addDays(dateString, days) {
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() + days);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Limpa caracteres especiais do telefone
function cleanPhone(phone) {
    return phone.replace(/\D/g, '');
}

// Exibe uma notificação amigável (Toast)
function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    if (type === 'error') {
        elements.toast.querySelector('.toast-content').style.borderLeftColor = 'var(--color-danger)';
    } else {
        elements.toast.querySelector('.toast-content').style.borderLeftColor = 'var(--color-success)';
    }
    elements.toast.classList.remove('hidden');
    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3500);
}

// Abre o modal de confirmação genérico
function askConfirmation(title, message, onConfirm) {
    elements.confirmTitle.textContent = title;
    elements.confirmMessage.textContent = message;
    elements.modalConfirmacao.classList.remove('hidden');
    acaoConfirmadaCallback = onConfirm;
}

// Fecha o modal de confirmação
function closeConfirmation() {
    elements.modalConfirmacao.classList.add('hidden');
    acaoConfirmadaCallback = null;
}

// ==========================================================================
// PERSISTÊNCIA DOS DADOS & BACKUPS
// ==========================================================================

// Inicializa dados do LocalStorage ou cria estruturas vazias
function loadFromStorage() {
    const storedClientes = localStorage.getItem('promissoria_clientes');
    const storedCredor = localStorage.getItem('promissoria_credor');
    const storedBackup = localStorage.getItem('promissoria_ultimo_backup');

    if (storedClientes) {
        state.clientes = JSON.parse(storedClientes);
    } else {
        state.clientes = [];
    }

    if (storedCredor) {
        state.credor = JSON.parse(storedCredor);
    } else {
        state.credor = { nome: "", documento: "", telefone: "", endereco: "", cidade: "" };
    }

    state.ultimoBackup = storedBackup || "Nenhum realizado nesta sessão";
    
    // Atualiza a interface
    updateCredorHeader();
    fillCredorForm();
    elements.txtDataUltimoBackup.textContent = state.ultimoBackup;
}

// Salva dados no LocalStorage e atualiza visualizações
function saveToStorage() {
    localStorage.setItem('promissoria_clientes', JSON.stringify(state.clientes));
    localStorage.setItem('promissoria_credor', JSON.stringify(state.credor));
    
    // Executa Backup Automático local
    localStorage.setItem('promissoria_backup_auto', JSON.stringify({
        clientes: state.clientes,
        credor: state.credor,
        dataBackup: new Date().toLocaleString('pt-BR')
    }));

    // Recarrega tabelas e dashboard
    updateDashboard();
    renderClientsTable();
}

// Atualiza o topo do cabeçalho com os dados do Credor
function updateCredorHeader() {
    if (state.credor.nome) {
        elements.credorNomeTopo.textContent = state.credor.nome;
    } else {
        elements.credorNomeTopo.textContent = "Defina o Credor em Ajustes";
    }
}

// Preenche o formulário do Credor com os dados salvos
function fillCredorForm() {
    elements.credorNome.value = state.credor.nome || "";
    elements.credorDocumento.value = state.credor.documento || "";
    elements.credorTelefone.value = state.credor.telefone || "";
    elements.credorEndereco.value = state.credor.endereco || "";
    elements.credorCidade.value = state.credor.cidade || "";
}

// ==========================================================================
// CÁLCULOS E GESTÃO FINANCEIRA DO CLIENTE
// ==========================================================================

// Calcula estatísticas financeiras de um cliente
function getClienteFinanceiro(cliente) {
    const valorProduto = parseFloat(cliente.venda.valor) || 0;
    const valorEntrada = parseFloat(cliente.venda.entrada) || 0;
    
    // Soma todos os pagamentos realizados adicionais
    const somaPagamentos = cliente.pagamentos.reduce((acc, pag) => acc + parseFloat(pag.valor), 0);
    
    const totalPago = valorEntrada + somaPagamentos;
    const saldoRestante = Math.max(0, valorProduto - totalPago);
    
    // Situação
    let situacao = "Em aberto";
    if (saldoRestante <= 0.01) { // margem pequena para arredondamentos
        situacao = "Quitada";
    } else {
        // Verifica se está atrasado
        const hoje = getTodayDateString();
        if (cliente.venda.vencimento && cliente.venda.vencimento < hoje) {
            situacao = "Atrasada";
        } else if (somaPagamentos > 0) {
            situacao = "Parcialmente paga";
        }
    }
    
    return {
        totalPago,
        saldoRestante,
        situacao
    };
}

// ==========================================================================
// RENDERIZAÇÃO E TABELAS
// ==========================================================================

// Preenche a tabela principal e dashboard
function updateDashboard() {
    let totalVendido = 0;
    let totalRecebido = 0;
    let totalAberto = 0;
    const totalClientes = state.clientes.length;

    state.clientes.forEach(cliente => {
        const fin = getClienteFinanceiro(cliente);
        totalVendido += parseFloat(cliente.venda.valor) || 0;
        totalRecebido += fin.totalPago;
        totalAberto += fin.saldoRestante;
    });

    elements.dashTotalVendido.textContent = formatCurrency(totalVendido);
    elements.dashTotalRecebido.textContent = formatCurrency(totalRecebido);
    elements.dashTotalAberto.textContent = formatCurrency(totalAberto);
    elements.dashTotalClientes.textContent = totalClientes;

    // Transações Recentes (últimos 5)
    // Clonamos a lista, ordenamos por ID de forma decrescente para pegar os mais novos
    const recentes = [...state.clientes]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    elements.tableRecentClients.innerHTML = "";
    if (recentes.length === 0) {
        elements.tableRecentClients.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">Nenhum cliente cadastrado ainda.</td>
            </tr>
        `;
        return;
    }

    recentes.forEach(cliente => {
        const fin = getClienteFinanceiro(cliente);
        const tr = document.createElement('tr');
        
        let badgeClass = 'badge-em-aberto';
        if (fin.situacao === 'Parcialmente paga') badgeClass = 'badge-parcialmente-paga';
        if (fin.situacao === 'Quitada') badgeClass = 'badge-quitada';
        if (fin.situacao === 'Atrasada') badgeClass = 'badge-atrasada';

        tr.innerHTML = `
            <td><strong>${cliente.nome}</strong><br><small class="text-muted">${cliente.telefone}</small></td>
            <td>${cliente.venda.produto}</td>
            <td>${formatCurrency(fin.saldoRestante)}</td>
            <td><span class="badge ${badgeClass}">${fin.situacao}</span></td>
            <td class="actions-cell">
                <button class="btn btn-outline btn-small btn-detalhes" data-id="${cliente.id}" title="Ficha Financeira">
                    Ver Ficha
                </button>
            </td>
        `;
        elements.tableRecentClients.appendChild(tr);
    });

    // Registrar eventos para botões de detalhes nas linhas geradas do dashboard
    document.querySelectorAll('#tbody-recent-clients .btn-detalhes').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            openDetailsModal(id);
        });
    });
}

// Renderiza a lista de clientes completa na aba Clientes
function renderClientsTable() {
    const queryCliente = elements.inputBuscaCliente.value.toLowerCase().trim();
    const queryTelefone = cleanPhone(elements.inputBuscaTelefone.value);
    const filtroSituacao = elements.selectFiltroSituacao.value;

    const filtrados = state.clientes.filter(cliente => {
        const fin = getClienteFinanceiro(cliente);
        
        // Match Nome ou Produto
        const matchCliente = cliente.nome.toLowerCase().includes(queryCliente) || 
                             cliente.venda.produto.toLowerCase().includes(queryCliente);
        
        // Match Telefone
        const matchTelefone = queryTelefone === "" || cleanPhone(cliente.telefone).includes(queryTelefone);
        
        // Match Situação
        const matchSituacao = filtroSituacao === "" || fin.situacao === filtroSituacao;

        return matchCliente && matchTelefone && matchSituacao;
    });

    // Ordenar de forma decrescente pelo ID (mais recente primeiro)
    filtrados.sort((a, b) => b.id - a.id);

    elements.tableClientsFull.innerHTML = "";
    if (filtrados.length === 0) {
        elements.tableClientsFull.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">Nenhum cliente atende aos filtros de busca.</td>
            </tr>
        `;
        return;
    }

    filtrados.forEach(cliente => {
        const fin = getClienteFinanceiro(cliente);
        const tr = document.createElement('tr');
        
        let badgeClass = 'badge-em-aberto';
        if (fin.situacao === 'Parcialmente paga') badgeClass = 'badge-parcialmente-paga';
        if (fin.situacao === 'Quitada') badgeClass = 'badge-quitada';
        if (fin.situacao === 'Atrasada') badgeClass = 'badge-atrasada';

        tr.innerHTML = `
            <td><strong>${cliente.nome}</strong></td>
            <td>${cliente.telefone}</td>
            <td>${cliente.venda.produto}</td>
            <td>${formatCurrency(cliente.venda.valor)}</td>
            <td>${formatCurrency(fin.saldoRestante)}</td>
            <td><span class="badge ${badgeClass}">${fin.situacao}</span></td>
            <td class="actions-cell">
                <button class="btn btn-outline btn-small btn-detalhes" data-id="${cliente.id}" title="Ver detalhes do cliente">
                    Detalhes
                </button>
                <button class="btn btn-danger btn-small btn-excluir-cliente" data-id="${cliente.id}" title="Remover cliente">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon-small"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        `;
        elements.tableClientsFull.appendChild(tr);
    });

    // Eventos
    document.querySelectorAll('#tbody-clients-full .btn-detalhes').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            openDetailsModal(id);
        });
    });

    document.querySelectorAll('#tbody-clients-full .btn-excluir-cliente').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            confirmDeleteCliente(id);
        });
    });
}

// Confirmar exclusão do cliente
function confirmDeleteCliente(id) {
    const cliente = state.clientes.find(c => c.id == id);
    if (!cliente) return;
    
    askConfirmation(
        "Excluir Cliente e Venda",
        `Deseja realmente excluir permanentemente o cadastro de ${cliente.nome} e todo o seu histórico financeiro?`,
        () => {
            state.clientes = state.clientes.filter(c => c.id != id);
            saveToStorage();
            closeConfirmation();
            showToast("Cliente removido com sucesso!");
        }
    );
}

// ==========================================================================
// CONTROLE DE MODAL DE DETALHES & HISTÓRICO FINANCEIRO
// ==========================================================================

function openDetailsModal(id) {
    clienteSelecionadoId = id;
    const cliente = state.clientes.find(c => c.id == id);
    if (!cliente) return;

    const fin = getClienteFinanceiro(cliente);

    // Preenche dados cadastrais
    elements.detClienteNome.textContent = cliente.nome;
    elements.detClienteCpf.textContent = cliente.cpf || "Não informado";
    elements.detClienteTelefone.textContent = cliente.telefone;
    elements.detClienteEndereco.textContent = cliente.endereco;
    elements.detClienteBairroCidade.textContent = `${cliente.bairro} / ${cliente.cidade}`;
    elements.detClienteReferencia.textContent = cliente.referencia || "Não informado";
    elements.detClienteObs.textContent = cliente.obs || "Nenhuma observação cadastrada.";

    // Preenche dados da venda
    elements.detVendaProduto.textContent = cliente.venda.produto;
    elements.detVendaData.textContent = formatDate(cliente.venda.dataVenda);
    elements.detVendaVencimento.textContent = formatDate(cliente.venda.vencimento);

    // Preenche resumo financeiro
    elements.detResumoValor.textContent = formatCurrency(cliente.venda.valor);
    elements.detResumoPago.textContent = formatCurrency(fin.totalPago);
    elements.detResumoRestante.textContent = formatCurrency(fin.saldoRestante);
    elements.detResumoSituacao.textContent = fin.situacao;

    // Badges de cores no resumo do modal
    elements.detResumoSituacao.className = "badge"; // reset classes
    if (fin.situacao === 'Quitada') elements.detResumoSituacao.classList.add('badge-quitada');
    else if (fin.situacao === 'Parcialmente paga') elements.detResumoSituacao.classList.add('badge-parcialmente-paga');
    else if (fin.situacao === 'Atrasada') elements.detResumoSituacao.classList.add('badge-atrasada');
    else elements.detResumoSituacao.classList.add('badge-em-aberto');

    // Preenche histórico de pagamentos
    renderPagamentosHistorico(cliente);

    elements.modalDetails.classList.remove('hidden');
}

// ==========================================================================
// EDIÇÃO DE DADOS — MODAL SEPARADO
// ==========================================================================

function abrirModalEdicao(cliente) {
    document.getElementById('edit-nome').value = cliente.nome || '';
    document.getElementById('edit-cpf').value = cliente.cpf || '';
    document.getElementById('edit-telefone').value = cliente.telefone || '';
    document.getElementById('edit-endereco').value = cliente.endereco || '';
    document.getElementById('edit-bairro').value = cliente.bairro || '';
    document.getElementById('edit-cidade').value = cliente.cidade || '';
    document.getElementById('edit-referencia').value = cliente.referencia || '';
    document.getElementById('edit-obs').value = cliente.obs || '';
    document.getElementById('edit-produto').value = cliente.venda.produto || '';
    document.getElementById('edit-data-venda').value = cliente.venda.dataVenda || '';
    document.getElementById('edit-vencimento').value = cliente.venda.vencimento || '';
    document.getElementById('modal-edicao').classList.remove('hidden');
}

function fecharModalEdicao() {
    document.getElementById('modal-edicao').classList.add('hidden');
}

function salvarEdicao() {
    const cliente = state.clientes.find(c => c.id == clienteSelecionadoId);
    if (!cliente) return;
    cliente.nome = document.getElementById('edit-nome').value.trim();
    cliente.cpf = document.getElementById('edit-cpf').value.trim();
    cliente.telefone = document.getElementById('edit-telefone').value.trim();
    cliente.endereco = document.getElementById('edit-endereco').value.trim();
    cliente.bairro = document.getElementById('edit-bairro').value.trim();
    cliente.cidade = document.getElementById('edit-cidade').value.trim();
    cliente.referencia = document.getElementById('edit-referencia').value.trim();
    cliente.obs = document.getElementById('edit-obs').value.trim();
    cliente.venda.produto = document.getElementById('edit-produto').value.trim();
    cliente.venda.dataVenda = document.getElementById('edit-data-venda').value;
    cliente.venda.vencimento = document.getElementById('edit-vencimento').value;
    saveToStorage();
    fecharModalEdicao();
    openDetailsModal(cliente.id);
    showToast("Dados atualizados com sucesso!");
}

// Renderiza a lista de pagamentos do cliente
function renderPagamentosHistorico(cliente) {
    elements.tablePagamentosHistorico.innerHTML = "";
    
    // 1. Linha do valor da entrada (se houver)
    const entradaVal = parseFloat(cliente.venda.entrada) || 0;
    if (entradaVal > 0) {
        const trEntrada = document.createElement('tr');
        trEntrada.innerHTML = `
            <td>${formatDate(cliente.venda.dataVenda)}</td>
            <td><strong>Entrada Inicial</strong></td>
            <td>${formatCurrency(entradaVal)}</td>
            <td>Dinheiro / Ajuste</td>
            <td class="text-muted">Valor pago no ato da compra</td>
            <td class="text-right">--</td>
        `;
        elements.tablePagamentosHistorico.appendChild(trEntrada);
    }

    // 2. Linhas de parcelas e pagamentos adicionais
    if (cliente.pagamentos.length === 0) {
        if (entradaVal === 0) {
            elements.tablePagamentosHistorico.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">Nenhum pagamento registrado ainda.</td>
                </tr>
            `;
        }
        return;
    }

    // Ordena pagamentos adicionais por data
    const pagamentosOrdenados = [...cliente.pagamentos].sort((a, b) => new Date(a.data) - new Date(b.data));

    pagamentosOrdenados.forEach((pag, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(pag.data)}</td>
            <td>Pagamento Registrado</td>
            <td>${formatCurrency(pag.valor)}</td>
            <td>${pag.forma}</td>
            <td>${pag.obs || '-'}</td>
            <td class="actions-cell">
                <button class="btn btn-danger btn-small btn-excluir-pagamento" data-pag-id="${pag.id}" title="Excluir este pagamento">
                    Excluir
                </button>
            </td>
        `;
        elements.tablePagamentosHistorico.appendChild(tr);
    });

    // Registra os botões de exclusão de pagamento
    document.querySelectorAll('#tbody-pagamentos-historico .btn-excluir-pagamento').forEach(btn => {
        btn.addEventListener('click', () => {
            const pagId = btn.getAttribute('data-pag-id');
            confirmDeletePagamento(cliente.id, pagId);
        });
    });
}

// Confirma exclusão de pagamento específico
function confirmDeletePagamento(clienteId, pagId) {
    const cliente = state.clientes.find(c => c.id == clienteId);
    if (!cliente) return;

    askConfirmation(
        "Excluir Registro de Pagamento",
        "Tem certeza que deseja apagar permanentemente este pagamento? O saldo devedor do cliente aumentará novamente.",
        () => {
            cliente.pagamentos = cliente.pagamentos.filter(p => p.id != pagId);
            saveToStorage();
            closeConfirmation();
            openDetailsModal(clienteId); // Recarrega o modal de detalhes
            showToast("Pagamento removido do histórico.");
        }
    );
}

// ==========================================================================
// REGISTRO DE VENDAS E NOVO PAGAMENTO
// ==========================================================================

// Calcula o saldo devedor instantaneamente no form de Nova Venda
function calcularSaldoDevedorForm() {
    const valor = parseFloat(elements.vendaValor.value) || 0;
    const entrada = parseFloat(elements.vendaEntrada.value) || 0;
    const saldo = Math.max(0, valor - entrada);
    elements.vendaSaldoCalculado.value = formatCurrency(saldo);
}

// Lida com o submit do formulário de cadastro de venda/cliente
elements.formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const valor = parseFloat(elements.vendaValor.value) || 0;
    const entrada = parseFloat(elements.vendaEntrada.value) || 0;

    if (entrada > valor) {
        showToast("O valor da entrada não pode ser maior que o valor total do produto!", "error");
        return;
    }

    const novoCliente = {
        id: Date.now(),
        nome: document.getElementById('cliente-nome').value.trim(),
        cpf: document.getElementById('cliente-cpf').value.trim(),
        telefone: document.getElementById('cliente-telefone').value.trim(),
        endereco: document.getElementById('cliente-endereco').value.trim(),
        bairro: document.getElementById('cliente-bairro').value.trim(),
        cidade: document.getElementById('cliente-cidade').value.trim(),
        referencia: document.getElementById('cliente-referencia').value.trim(),
        obs: document.getElementById('cliente-obs').value.trim(),
        venda: {
            produto: document.getElementById('venda-produto').value.trim(),
            valor: valor,
            entrada: entrada,
            dataVenda: elements.vendaData.value,
            vencimento: elements.vendaVencimento.value
        },
        pagamentos: []
    };

    state.clientes.push(novoCliente);
    saveToStorage();
    
    elements.formCadastro.reset();
    setDefaultFormDates();
    calcularSaldoDevedorForm();
    
    showToast("Cliente e Venda registrados com sucesso!");
    
    // Vai para a aba Clientes
    switchTab('tab-clientes');
});

// Preenche datas default no formulário de Nova Venda
function setDefaultFormDates() {
    const hoje = getTodayDateString();
    elements.vendaData.value = hoje;
    // Vencimento default para 30 dias depois
    elements.vendaVencimento.value = addDays(hoje, 30);
}

// Configura datas caso o usuário mude a data da venda (recalcula vencimento +30 dias automaticamente como sugestão)
elements.vendaData.addEventListener('change', () => {
    if (elements.vendaData.value) {
        elements.vendaVencimento.value = addDays(elements.vendaData.value, 30);
    }
});

// Novo pagamento submit
elements.formNovoPagamento.addEventListener('submit', (e) => {
    e.preventDefault();

    const cliente = state.clientes.find(c => c.id == clienteSelecionadoId);
    if (!cliente) return;

    const fin = getClienteFinanceiro(cliente);
    const valorPago = parseFloat(elements.pagamentoValor.value) || 0;

    if (valorPago > fin.saldoRestante + 0.01) {
        showToast(`O valor informado é maior que o saldo restante (${formatCurrency(fin.saldoRestante)}).`, "error");
        return;
    }

    const novoPag = {
        id: Date.now(),
        valor: valorPago,
        data: elements.pagamentoData.value,
        forma: elements.pagamentoForma.value,
        obs: elements.pagamentoObs.value.trim()
    };

    cliente.pagamentos.push(novoPag);
    saveToStorage();
    
    elements.formNovoPagamento.reset();
    elements.modalPagamento.classList.add('hidden');
    
    // Atualiza modal de detalhes
    openDetailsModal(clienteSelecionadoId);
    showToast("Pagamento registrado com sucesso!");
});

// ==========================================================================
// CONFIGURAÇÕES DO CREDOR
// ==========================================================================
elements.formConfigCredor.addEventListener('submit', (e) => {
    e.preventDefault();

    state.credor = {
        nome: elements.credorNome.value.trim(),
        documento: elements.credorDocumento.value.trim(),
        telefone: elements.credorTelefone.value.trim(),
        endereco: elements.credorEndereco.value.trim(),
        cidade: elements.credorCidade.value.trim()
    };

    localStorage.setItem('promissoria_credor', JSON.stringify(state.credor));
    updateCredorHeader();
    showToast("Dados do Credor atualizados com sucesso!");
});

// ==========================================================================
// WHATSAPP - RESUMO FINANCEIRO
// ==========================================================================
function getWhatsappResumo(cliente) {
    const fin = getClienteFinanceiro(cliente);
    const cleanNum = cleanPhone(cliente.telefone);

    // Converte vencimento de AAAA-MM-DD para DD/MM/AAAA
    const vencFormat = formatDate(cliente.venda.vencimento);

    let text = `Olá, *${cliente.nome}*! Segue abaixo o resumo financeiro atualizado da sua compra:%0A%0A`;
    text += `*Produto:* ${cliente.venda.produto}%0A`;
    text += `*Valor do Produto:* ${formatCurrency(cliente.venda.valor)}%0A`;
    
    if (parseFloat(cliente.venda.entrada) > 0) {
        text += `*Valor da Entrada:* ${formatCurrency(cliente.venda.entrada)}%0A`;
    }
    
    text += `*Total Pago (Entrada + Parcelas):* ${formatCurrency(fin.totalPago)}%0A`;
    text += `*Saldo Devedor Pendente:* *${formatCurrency(fin.saldoRestante)}*%0A`;
    
    if (fin.saldoRestante > 0) {
        text += `*Situação:* ${fin.situacao === 'Atrasada' ? '⚠️ Atrasado' : '⏳ Em aberto'}%0A`;
        text += `*Data de Vencimento:* ${vencFormat}%0A%0A`;
        
        if (state.credor.nome) {
            text += `_Qualquer dúvida, por favor entre em contato com ${state.credor.nome} no telefone ${state.credor.telefone || ''}._`;
        }
    } else {
        text += `*Situação:* ✅ Quitada%0A%0A`;
        text += `Obrigado pela parceria! Seu título está quitado.`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=55${cleanNum}&text=${text}`;
    window.open(whatsappUrl, '_blank');
}

// ==========================================================================
// BACKUP E RESTAURAÇÃO (JSON & EXCEL/CSV)
// ==========================================================================

// Baixar backup JSON
function downloadBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        clientes: state.clientes,
        credor: state.credor,
        versao: "1.0",
        exportadoEm: new Date().toLocaleString('pt-BR')
    }, null, 4));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const dataAtual = new Date().toISOString().slice(0,10);
    downloadAnchor.setAttribute("download", `backup_promissoria_digital_${dataAtual}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    // Registra data do último backup
    const dataHoraBackup = new Date().toLocaleString('pt-BR');
    state.ultimoBackup = dataHoraBackup;
    localStorage.setItem('promissoria_ultimo_backup', dataHoraBackup);
    elements.txtDataUltimoBackup.textContent = dataHoraBackup;
    
    showToast("Backup baixado com sucesso!");
}

// Restaurar backup JSON (gatilho de upload)
elements.btnBackupRestoreTrigger.addEventListener('click', () => {
    elements.inputBackupFile.click();
});

// Ler arquivo de backup enviado pelo usuário
elements.inputBackupFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const parsedData = JSON.parse(event.target.result);
            
            // Valida minimamente a estrutura do JSON importado
            if (!parsedData || !Array.isArray(parsedData.clientes)) {
                showToast("Erro: O arquivo de backup selecionado é inválido ou está corrompido.", "error");
                e.target.value = ''; // Limpa input
                return;
            }

            // Pede confirmação do usuário antes de sobrescrever
            askConfirmation(
                "Restaurar Banco de Dados",
                `Tem certeza que deseja substituir todos os clientes e configurações atuais pelo arquivo de backup (${file.name})? Seus dados atuais serão excluídos.`,
                () => {
                    state.clientes = parsedData.clientes || [];
                    state.credor = parsedData.credor || { nome: "", documento: "", telefone: "", endereco: "", cidade: "" };
                    
                    // Salva e atualiza
                    saveToStorage();
                    fillCredorForm();
                    updateCredorHeader();
                    
                    closeConfirmation();
                    showToast("Banco de dados restaurado com sucesso!");
                    switchTab('tab-dashboard');
                }
            );

        } catch (err) {
            showToast("Erro de leitura: Formato JSON inválido.", "error");
        }
        e.target.value = ''; // Limpa input
    };
    reader.readAsText(file);
});

// Exportar Tabela Completa para Excel (CSV formatado)
function exportToExcel() {
    if (state.clientes.length === 0) {
        showToast("Nenhum dado cadastrado para exportar!", "error");
        return;
    }

    // Estrutura do cabeçalho do CSV
    let csvContent = "\uFEFF"; // Adiciona UTF-8 BOM para garantir acentos corretos no Excel
    csvContent += "Nome do Cliente;Telefone;Bairro;Cidade;Produto;Valor Produto;Valor Entrada;Total Pago;Saldo Restante;Situação;Data Venda;Vencimento\r\n";

    state.clientes.forEach(cliente => {
        const fin = getClienteFinanceiro(cliente);
        const row = [
            cliente.nome.replace(/;/g, ','), // previne quebras de coluna por ponto-e-vírgula no texto
            cliente.telefone,
            cliente.bairro.replace(/;/g, ','),
            cliente.cidade.replace(/;/g, ','),
            cliente.venda.produto.replace(/;/g, ','),
            cliente.venda.valor.toString().replace('.', ','), // converte decimal para padrão BR
            cliente.venda.entrada.toString().replace('.', ','),
            fin.totalPago.toString().replace('.', ','),
            fin.saldoRestante.toString().replace('.', ','),
            fin.situacao,
            formatDate(cliente.venda.dataVenda),
            formatDate(cliente.venda.vencimento)
        ];
        csvContent += row.join(";") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const dataAtual = new Date().toISOString().slice(0,10);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_promissoria_digital_${dataAtual}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Relatório de clientes exportado para CSV/Excel!");
}

// Reset Geral do Banco de Dados (Limpar Tudo)
elements.btnDangerReset.addEventListener('click', () => {
    askConfirmation(
        "Limpar Todo o Sistema",
        "⚠️ ATENÇÃO: Esta ação é permanente e irreversível. Todos os clientes cadastrados, vendas e históricos financeiros de pagamentos serão apagados definitivamente do seu LocalStorage. Deseja realmente limpar tudo?",
        () => {
            state.clientes = [];
            state.credor = { nome: "", documento: "", telefone: "", endereco: "", cidade: "" };
            saveToStorage();
            fillCredorForm();
            updateCredorHeader();
            closeConfirmation();
            showToast("Todo o banco de dados foi excluído.");
            switchTab('tab-dashboard');
        }
    );
});

// ==========================================================================
// IMPRESSÃO E FORMATADOR DE VALORES POR EXTENSO (MÉTODO PREMIUM SÊNIOR)
// ==========================================================================

// Função em JS para escrever números por extenso em Português
function numeroParaExtenso(valor) {
    if (valor <= 0) return "Zero Reais";
    
    const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
    const dezenas_1 = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

    function escreverInteiro(num) {
        if (num === 100) return "cem";
        if (num < 10) return unidades[num];
        if (num >= 10 && num < 20) return dezenas_1[num - 10];
        
        const dez = Math.floor(num / 10) % 10;
        const uni = num % 10;
        let result = "";
        
        if (num >= 100) {
            const cent = Math.floor(num / 100);
            result = centenas[cent];
            const resto = num % 100;
            if (resto > 0) {
                result += " e " + escreverInteiro(resto);
            }
            return result;
        }
        
        result = dezenas[dez];
        if (uni > 0) result += " e " + unidades[uni];
        return result;
    }

    function escreverGrupo(num) {
        return escreverInteiro(num);
    }

    // Separa a parte inteira e os centavos
    const parteInteira = Math.floor(valor);
    const parteCentavos = Math.round((valor - parteInteira) * 100);

    let extensoStr = "";

    // Lida com Reais
    if (parteInteira > 0) {
        if (parteInteira === 1) {
            extensoStr = "um real";
        } else if (parteInteira < 1000) {
            extensoStr = escreverGrupo(parteInteira) + " reais";
        } else {
            // Suporta até 999.999
            const milhares = Math.floor(parteInteira / 1000);
            const restoMilhar = parteInteira % 1000;
            
            let milharStr = "";
            if (milhares === 1) {
                milharStr = "um mil";
            } else {
                milharStr = escreverGrupo(milhares) + " mil";
            }
            
            extensoStr = milharStr;
            if (restoMilhar > 0) {
                // Adiciona conectores de forma natural
                const conector = (restoMilhar < 100 || restoMilhar % 100 === 0) ? " e " : " ";
                extensoStr += conector + escreverGrupo(restoMilhar) + " reais";
            } else {
                extensoStr += " reais";
            }
        }
    }

    // Lida com Centavos
    if (parteCentavos > 0) {
        const centavosStr = escreverInteiro(parteCentavos) + (parteCentavos === 1 ? " centavo" : " centavos");
        if (parteInteira > 0) {
            extensoStr += " e " + centavosStr;
        } else {
            extensoStr = centavosStr;
        }
    }

    // Capitaliza a primeira letra
    return extensoStr.charAt(0).toUpperCase() + extensoStr.slice(1);
}

// Cria o layout da promissória física
function gerarTemplatePromissoria(cliente, inPreview = false) {
    const fin = getClienteFinanceiro(cliente);
    
    // Dados do credor ou padrão
    const credorNome = state.credor.nome || "[Cadastre o Credor nos Ajustes]";
    const credorCpfCnpj = state.credor.documento || "CPF/CNPJ do credor pendente";
    const credorEndereco = state.credor.endereco || "Endereço comercial pendente";
    const credorCidade = state.credor.cidade || "Praça de emissão pendente";

    // Data da venda e vencimento
    const dataVendaExtenso = formatarDataPorExtenso(cliente.venda.dataVenda);
    const dataVencimentoExtenso = formatarDataPorExtenso(cliente.venda.vencimento);
    const dataVencFormat = formatDate(cliente.venda.vencimento);

    // O valor do título promissório a ser cobrado é o SALDO RESTANTE (o valor devedor atual)
    // Se o saldo restante for zero, emitimos a promissória com o valor cheio original
    const valorCobrado = fin.saldoRestante > 0 ? fin.saldoRestante : cliente.venda.valor;
    const valorExtenso = numeroParaExtenso(valorCobrado);

    // Elemento HTML estrutural da Promissória
    const wrapperClass = inPreview ? "promissoria-preview-card" : "promissoria-documento";
    const borderWrapperStart = inPreview ? "" : "<div class='promissoria-border-wrapper'>";
    const borderWrapperEnd = inPreview ? "" : "</div>";
    
    const idUnicoFormatado = String(cliente.id).slice(-6);

    const htmlContent = `
        ${borderWrapperStart}
        <div class="${wrapperClass}">
            <!-- TOPO / CABEÇALHO -->
            <div class="${inPreview ? 'promissoria-topo' : 'promissoria-print-topo'}">
                <div class="${inPreview ? 'promissoria-titulo-principal' : 'promissoria-print-titulo'}">NOTA PROMISSÓRIA</div>
                <div class="${inPreview ? 'promissoria-num-valor' : 'promissoria-print-valores'}">
                    <span>Nº ${idUnicoFormatado}</span>
                    <span>Vencimento: ${dataVencFormat}</span>
                    <span>Valor: ${formatCurrency(valorCobrado)}</span>
                </div>
            </div>
            
            <!-- CORPO JURÍDICO DA PROMISSÓRIA -->
            <div class="${inPreview ? 'promissoria-corpo' : 'promissoria-print-corpo'}">
                No(s) dia(s) <span class="${inPreview ? 'promissoria-fill-line' : 'print-fill-text'}">${dataVencimentoExtenso}</span>, 
                pagarei(emos) por esta única via de Nota Promissória a <span class="${inPreview ? 'promissoria-fill-line' : 'print-fill-text'}">${credorNome}</span>, 
                inscrito no CPF/CNPJ sob o nº <span class="${inPreview ? 'promissoria-fill-line' : 'print-fill-text'}">${credorCpfCnpj}</span>, 
                ou à sua ordem, a quantia de <span class="${inPreview ? 'promissoria-fill-line' : 'print-fill-text'}">${valorExtenso}</span>, 
                em moeda corrente deste país, pagável na praça de <span class="${inPreview ? 'promissoria-fill-line' : 'print-fill-text'}">${credorCidade}</span>.
                <br><br>
                Esta nota vincula-se ao seguinte produto comercial: <strong>${cliente.venda.produto}</strong>.
            </div>
            
            <!-- ASSINATURA E IDENTIFICAÇÃO DO EMITENTE (DEVEDOR) -->
            <div class="${inPreview ? 'promissoria-rodape' : 'promissoria-print-rodape'}">
                <div class="${inPreview ? 'promissoria-emitente-info' : 'promissoria-print-emitente-detalhes'}">
                    <h4>Emitente (Devedor)</h4>
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                    <p><strong>Endereço:</strong> ${cliente.endereco}, ${cliente.bairro}</p>
                    <p><strong>Cidade:</strong> ${cliente.cidade}</p>
                    ${cliente.referencia ? `<p><strong>Ref:</strong> ${cliente.referencia}</p>` : ''}
                </div>
                
                <div class="${inPreview ? 'promissoria-assinatura' : 'promissoria-print-assinatura'}">
                    <div class="promissoria-linha-assinatura"></div>
                    <div class="${inPreview ? 'promissoria-linha-assinatura' : 'promissoria-print-linha'}"></div>
                    <span>Assinatura do Emitente</span>
                    <small style="font-size: 8pt; display: block; margin-top: 3px; color: #555;">Emitido em: ${dataVendaExtenso}</small>
                </div>
            </div>
        </div>
        ${borderWrapperEnd}
    `;

    return htmlContent;
}

// Auxiliar para retornar data formatada por extenso ("25 de junho de 2026")
function formatarDataPorExtenso(dateString) {
    if (!dateString) return "...";
    // Garantir fuso correto na leitura da string de data do input
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    const dataObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
}

// Dispara a visualização da promissória antes de imprimir
function openPromissoriaPreview(id) {
    const cliente = state.clientes.find(c => c.id == id);
    if (!cliente) return;
    
    // Gera o preview em tela
    elements.promissoriaViewContainer.innerHTML = gerarTemplatePromissoria(cliente, true);
    
    // Gera o layout oficial para impressão no frame invisível de impressão
    elements.printArea.innerHTML = gerarTemplatePromissoria(cliente, false);
    
    elements.modalPromissoriaPreview.classList.remove('hidden');
}

// Dispara a impressão física da promissória / PDF
function triggerPrint() {
    window.print();
}

// ==========================================================================
// NAVEGAÇÃO DE ABAS & INTERFACE DO APP
// ==========================================================================
function switchTab(targetTabId) {
    elements.tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === targetTabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    elements.tabContents.forEach(content => {
        if (content.id === targetTabId) {
            content.classList.add('active-content');
        } else {
            content.classList.remove('active-content');
        }
    });

    // Atualiza cabeçalhos dinâmicos baseados na aba ativa
    if (targetTabId === 'tab-dashboard') {
        elements.pageTitle.textContent = "Dashboard";
        elements.pageSubtitle.textContent = "Visão geral dos seus recebimentos e clientes.";
        updateDashboard();
    } else if (targetTabId === 'tab-clientes') {
        elements.pageTitle.textContent = "Clientes & Vendas";
        elements.pageSubtitle.textContent = "Pesquise, filtre e controle as notas promissórias.";
        renderClientsTable();
    } else if (targetTabId === 'tab-cadastro') {
        elements.pageTitle.textContent = "Registrar Nova Venda";
        elements.pageSubtitle.textContent = "Cadastre os dados pessoais do cliente e os termos da promissória.";
        setDefaultFormDates();
        calcularSaldoDevedorForm();
    } else if (targetTabId === 'tab-configuracoes') {
        elements.pageTitle.textContent = "Configurações Gerais";
        elements.pageSubtitle.textContent = "Gerencie os dados do credor emissor e backups de segurança.";
    }
}

// ==========================================================================
// REGISTRO DE EVENTOS (EVENT LISTENERS)
// ==========================================================================

// Cliques nos itens de menu
elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        switchTab(target);
    });
});

// Botão "Ver todos" no Dashboard direciona para aba de Clientes
elements.btnDashboardVerTodos.addEventListener('click', () => {
    switchTab('tab-clientes');
});

// Eventos de Busca na tabela de clientes
elements.inputBuscaCliente.addEventListener('input', renderClientsTable);
elements.inputBuscaTelefone.addEventListener('input', renderClientsTable);
elements.selectFiltroSituacao.addEventListener('change', renderClientsTable);

// Eventos de cálculo dinâmico no form de Nova Venda
elements.vendaValor.addEventListener('input', calcularSaldoDevedorForm);
elements.vendaEntrada.addEventListener('input', calcularSaldoDevedorForm);

// Modais fechamento genérico
elements.btnCloseDetails.addEventListener('click', () => elements.modalDetails.classList.add('hidden'));
elements.btnFecharDetalhes.addEventListener('click', () => elements.modalDetails.classList.add('hidden'));

elements.btnClosePagamento.addEventListener('click', () => elements.modalPagamento.classList.add('hidden'));
elements.btnCancelarPagamento.addEventListener('click', () => elements.modalPagamento.classList.add('hidden'));

elements.btnCloseConfirm.addEventListener('click', closeConfirmation);
elements.btnConfirmCancel.addEventListener('click', closeConfirmation);

// Botão de confirmação de ação no modal de confirmação
elements.btnConfirmAction.addEventListener('click', () => {
    if (acaoConfirmadaCallback && typeof acaoConfirmadaCallback === 'function') {
        acaoConfirmadaCallback();
    }
});

// Ações no Modal de Detalhes do Cliente
elements.btnAbrirNovoPagamento.addEventListener('click', () => {
    const cliente = state.clientes.find(c => c.id == clienteSelecionadoId);
    if (!cliente) return;
    
    const fin = getClienteFinanceiro(cliente);
    if (fin.saldoRestante <= 0) {
        showToast("Este título já foi totalmente quitado!", "error");
        return;
    }

    // Inicializa valores no modal de pagamento
    elements.pagamentoValor.value = "";
    elements.pagamentoValor.max = fin.saldoRestante;
    elements.pagamentoData.value = getTodayDateString();
    elements.pagamentoForma.value = "";
    elements.pagamentoObs.value = "";

    elements.modalPagamento.classList.remove('hidden');
});

elements.btnDetalhesWhatsapp.addEventListener('click', () => {
    const cliente = state.clientes.find(c => c.id == clienteSelecionadoId);
    if (cliente) {
        getWhatsappResumo(cliente);
    }
});

elements.btnDetalhesPromissoria.addEventListener('click', () => {
    openPromissoriaPreview(clienteSelecionadoId);
});

// Ações no visualizador de promissória
elements.btnClosePromissoriaPreview.addEventListener('click', () => elements.modalPromissoriaPreview.classList.add('hidden'));
elements.btnFecharPromissoriaPreview.addEventListener('click', () => elements.modalPromissoriaPreview.classList.add('hidden'));
elements.btnTriggerPrint.addEventListener('click', triggerPrint);

// Backup e Ajustes
elements.btnBackupDownload.addEventListener('click', downloadBackupJSON);
elements.btnExportExcel.addEventListener('click', exportToExcel);

// ==========================================================================
// INICIALIZAÇÃO DO APP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados locais
    loadFromStorage();
    
    // Atualiza dashboard inicial
    updateDashboard();

    // Botões de edição do modal de detalhes
    document.getElementById('btn-editar-dados').addEventListener('click', () => {
        const cliente = state.clientes.find(c => c.id == clienteSelecionadoId);
        if (cliente) abrirModalEdicao(cliente);
    });

    document.getElementById('btn-salvar-edicao').addEventListener('click', salvarEdicao);
    document.getElementById('btn-cancelar-edicao').addEventListener('click', fecharModalEdicao);
    document.getElementById('btn-close-edicao').addEventListener('click', fecharModalEdicao);
});
