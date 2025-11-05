/**
 * Distritos e principais cidades de Portugal
 */

const localizacoesPortugal = {
    "Aveiro": ["Aveiro", "Águeda", "Albergaria-a-Velha", "Anadia", "Arouca", "Espinho", "Ílhavo", "Mealhada", "Murtosa", "Oliveira de Azeméis", "Oliveira do Bairro", "Ovar", "Santa Maria da Feira", "São João da Madeira", "Sever do Vouga", "Vagos", "Vale de Cambra"],
    
    "Beja": ["Beja", "Aljustrel", "Almodôvar", "Alvito", "Barrancos", "Castro Verde", "Cuba", "Ferreira do Alentejo", "Mértola", "Moura", "Odemira", "Ourique", "Serpa", "Vidigueira"],
    
    "Braga": ["Braga", "Amares", "Barcelos", "Cabeceiras de Basto", "Celorico de Basto", "Esposende", "Fafe", "Guimarães", "Póvoa de Lanhoso", "Terras de Bouro", "Vieira do Minho", "Vila Nova de Famalicão", "Vila Verde", "Vizela"],
    
    "Bragança": ["Bragança", "Alfândega da Fé", "Carrazeda de Ansiães", "Freixo de Espada à Cinta", "Macedo de Cavaleiros", "Miranda do Douro", "Mirandela", "Mogadouro", "Torre de Moncorvo", "Vila Flor", "Vimioso", "Vinhais"],
    
    "Castelo Branco": ["Castelo Branco", "Belmonte", "Covilhã", "Fundão", "Idanha-a-Nova", "Oleiros", "Penamacor", "Proença-a-Nova", "Sertã", "Vila de Rei", "Vila Velha de Ródão"],
    
    "Coimbra": ["Coimbra", "Arganil", "Cantanhede", "Condeixa-a-Nova", "Figueira da Foz", "Góis", "Lousã", "Mira", "Miranda do Corvo", "Montemor-o-Velho", "Oliveira do Hospital", "Pampilhosa da Serra", "Penacova", "Penela", "Soure", "Tábua", "Vila Nova de Poiares"],
    
    "Évora": ["Évora", "Alandroal", "Arraiolos", "Borba", "Estremoz", "Montemor-o-Novo", "Mora", "Mourão", "Portel", "Redondo", "Reguengos de Monsaraz", "Vendas Novas", "Viana do Alentejo", "Vila Viçosa"],
    
    "Faro": ["Faro", "Albufeira", "Alcoutim", "Aljezur", "Castro Marim", "Lagoa", "Lagos", "Loulé", "Monchique", "Olhão", "Portimão", "São Brás de Alportel", "Silves", "Tavira", "Vila do Bispo", "Vila Real de Santo António"],
    
    "Guarda": ["Guarda", "Aguiar da Beira", "Almeida", "Celorico da Beira", "Figueira de Castelo Rodrigo", "Fornos de Algodres", "Gouveia", "Manteigas", "Mêda", "Pinhel", "Sabugal", "Seia", "Trancoso", "Vila Nova de Foz Côa"],
    
    "Leiria": ["Leiria", "Alcobaça", "Alvaiázere", "Ansião", "Batalha", "Bombarral", "Caldas da Rainha", "Castanheira de Pêra", "Figueiró dos Vinhos", "Marinha Grande", "Nazaré", "Óbidos", "Pedrógão Grande", "Peniche", "Pombal", "Porto de Mós"],
    
    "Lisboa": ["Lisboa", "Alenquer", "Almada", "Amadora", "Arruda dos Vinhos", "Azambuja", "Barreiro", "Cadaval", "Cascais", "Loures", "Lourinhã", "Mafra", "Moita", "Montijo", "Odivelas", "Oeiras", "Palmela", "Seixal", "Sesimbra", "Setúbal", "Sintra", "Sobral de Monte Agraço", "Torres Vedras", "Vila Franca de Xira"],
    
    "Portalegre": ["Portalegre", "Alter do Chão", "Arronches", "Avis", "Campo Maior", "Castelo de Vide", "Crato", "Elvas", "Fronteira", "Gavião", "Marvão", "Monforte", "Nisa", "Ponte de Sor", "Sousel"],
    
    "Porto": ["Porto", "Amarante", "Baião", "Felgueiras", "Gondomar", "Lousada", "Maia", "Marco de Canaveses", "Matosinhos", "Paços de Ferreira", "Paredes", "Penafiel", "Póvoa de Varzim", "Santo Tirso", "Trofa", "Valongo", "Vila do Conde", "Vila Nova de Gaia"],
    
    "Santarém": ["Santarém", "Abrantes", "Alcanena", "Almeirim", "Alpiarça", "Benavente", "Cartaxo", "Chamusca", "Constância", "Coruche", "Entroncamento", "Ferreira do Zêzere", "Golegã", "Mação", "Rio Maior", "Salvaterra de Magos", "Sardoal", "Tomar", "Torres Novas", "Vila Nova da Barquinha", "Ourém"],
    
    "Setúbal": ["Setúbal", "Alcácer do Sal", "Alcochete", "Almada", "Barreiro", "Grândola", "Moita", "Montijo", "Palmela", "Santiago do Cacém", "Seixal", "Sesimbra", "Sines"],
    
    "Viana do Castelo": ["Viana do Castelo", "Arcos de Valdevez", "Caminha", "Melgaço", "Monção", "Paredes de Coura", "Ponte da Barca", "Ponte de Lima", "Valença", "Vila Nova de Cerveira"],
    
    "Vila Real": ["Vila Real", "Alijó", "Boticas", "Chaves", "Mesão Frio", "Mondim de Basto", "Montalegre", "Murça", "Peso da Régua", "Ribeira de Pena", "Sabrosa", "Santa Marta de Penaguião", "Valpaços", "Vila Pouca de Aguiar"],
    
    "Viseu": ["Viseu", "Armamar", "Carregal do Sal", "Castro Daire", "Cinfães", "Lamego", "Mangualde", "Moimenta da Beira", "Mortágua", "Nelas", "Oliveira de Frades", "Penalva do Castelo", "Penedono", "Resende", "Santa Comba Dão", "São João da Pesqueira", "São Pedro do Sul", "Sátão", "Sernancelhe", "Tabuaço", "Tarouca", "Tondela", "Vila Nova de Paiva", "Vouzela"],
    
    // Regiões Autônomas
    "Açores": ["Ponta Delgada", "Angra do Heroísmo", "Horta", "Ribeira Grande", "Praia da Vitória", "Lagoa", "Vila Franca do Campo"],
    
    "Madeira": ["Funchal", "Câmara de Lobos", "Machico", "Santa Cruz", "Caniço", "Ribeira Brava", "Ponta do Sol"]
};

// Função para obter lista de distritos
function getDistritos() {
    return Object.keys(localizacoesPortugal).sort();
}

// Função para obter cidades de um distrito
function getCidadesPorDistrito(distrito) {
    return localizacoesPortugal[distrito] || [];
}

// Função para popular dropdown de distritos
function popularDistritosDropdown(selectElement) {
    const distritos = getDistritos();
    
    // Limpa opções existentes
    selectElement.innerHTML = '<option value="">Selecione o distrito</option>';
    
    // Adiciona cada distrito
    distritos.forEach(distrito => {
        const option = document.createElement('option');
        option.value = distrito;
        option.textContent = distrito;
        selectElement.appendChild(option);
    });
}

// Função para popular dropdown de cidades
function popularCidadesDropdown(selectElement, distrito) {
    const cidades = getCidadesPorDistrito(distrito);
    
    // Limpa opções existentes
    selectElement.innerHTML = '<option value="">Selecione a cidade</option>';
    
    if (cidades.length === 0) {
        selectElement.disabled = true;
        return;
    }
    
    selectElement.disabled = false;
    
    // Adiciona cada cidade
    cidades.forEach(cidade => {
        const option = document.createElement('option');
        option.value = cidade;
        option.textContent = cidade;
        selectElement.appendChild(option);
    });
}

