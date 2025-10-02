document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'http://localhost:3000/api';
  const token = sessionStorage.getItem('authToken');
  let editingUserUuid = null; // Use UUID for editing

  // --- Autenticação ---
  if (sessionStorage.getItem('isLoggedIn') !== 'true' || !token) {
      window.location.href = 'auth/login.html';
      return;
  }

  // Lógica para menu responsivo (mobile)
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Lógica para colapsar/expandir menu (desktop)
  const collapseBtn = document.getElementById("collapse-btn");
  const mainContent = document.getElementById("main-content");

  if (collapseBtn && sidebar && mainContent) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("collapsed");
    });
  }

  // Elementos do DOM
  const dashboardContainer = document.getElementById("dashboard-container");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmailDisplay = document.getElementById("user-email-display");
  const userNameDisplay = document.getElementById("user-name-display");
  const userMenuToggle = document.getElementById("user-menu-toggle");
  const userMenuDropdown = document.getElementById("user-menu-dropdown");

  const sidebarMenuItems = document.querySelectorAll(".sidebar-menu li");
  const overviewSection = document.getElementById("overview-section");
  const productsSection = document.getElementById("products-section");
  const productionSection = document.getElementById("production-section");
  const stockSection = document.getElementById("stock-section");
  const clientsSection = document.getElementById("clients-section");
  const pdvSection = document.getElementById("pdv-section");
  const reportsSection = document.getElementById("reports-section");
  const usersSection = document.getElementById("users-section");
  const sectionTitle = document.getElementById("section-title");

  const productForm = document.getElementById("product-form");
  const productsTableBody = document.getElementById("products-table-body");
  const finishedProductSelect = document.getElementById("finished-product");

  const productionForm = document.getElementById("production-form");
  const ingredientsContainer = document.getElementById("ingredients-container");
  const addIngredientBtn = document.getElementById("add-ingredient");
  const productionResults = document.getElementById("production-results");
  const saveProductionBtn = document.getElementById("save-production");
  const productionHistory = document.getElementById("production-history");

  const stockTableBody = document.getElementById("stock-table-body");
  const stockMovements = document.getElementById("stock-movements");

  const clientForm = document.getElementById("client-form");
  const clientsTableBody = document.getElementById("clients-table-body");
  const clientTypeRadios = document.querySelectorAll(
    'input[name="client-type"]'
  );
  const cpfField = document.getElementById("cpf-field");
  const cnpjField = document.getElementById("cnpj-field");
  const companyNameField = document.getElementById("company-name-field");

  // Elementos do PDV
  const productSearch = document.getElementById("product-search");
  const searchProductPdvBtn = document.getElementById("search-product-pdv-btn");
  const productTypeFilter = document.getElementById("product-type-filter");
  const productsGrid = document.getElementById("products-grid");
  const cartItems = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const discountInput = document.getElementById("discount");
  const cartDiscount = document.getElementById("cart-discount");
  const cartTotal = document.getElementById("cart-total");
  const paymentMethod = document.getElementById("payment-method");
  const saleClient = document.getElementById("sale-client");
  const finalizeSaleBtn = document.getElementById("finalize-sale");
  const clearCartBtn = document.getElementById("clear-cart");
  const receipt = document.getElementById("receipt");
  const receiptDate = document.getElementById("receipt-date");
  const receiptItems = document.getElementById("receipt-items");
  const receiptTotal = document.getElementById("receipt-total");
  const receiptPayment = document.getElementById("receipt-payment");
  const printReceiptBtn = document.getElementById("print-receipt");
  const emailReceiptBtn = document.getElementById("email-receipt");
  const newSaleBtn = document.getElementById("new-sale");

  // Elementos para tipo de desconto no PDV
  const discountTypeRadios = document.querySelectorAll(
    'input[name="discount-type"]'
  );

  // Elementos dos Relatórios
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Relatório de Vendas
  const salesStartDate = document.getElementById("sales-start-date");
  const salesEndDate = document.getElementById("sales-end-date");
  const salesPaymentMethod = document.getElementById("sales-payment-method");
  const generateSalesReportBtn = document.getElementById(
    "generate-sales-report"
  );
  const exportSalesPdfBtn = document.getElementById("export-sales-pdf");
  const salesSummary = document.getElementById("sales-summary");
  const totalSalesCount = document.getElementById("total-sales-count");
  const totalSalesAmount = document.getElementById("total-sales-amount");
  const averageSale = document.getElementById("average-sale");
  const salesReportBody = document.getElementById("sales-report-body");

  // Relatório de Produção
  const productionStartDate = document.getElementById("production-start-date");
  const productionEndDate = document.getElementById("production-end-date");
  const productionProduct = document.getElementById("production-product");
  const generateProductionReportBtn = document.getElementById(
    "generate-production-report"
  );
  const exportProductionPdfBtn = document.getElementById(
    "export-production-pdf"
  );
  const productionSummary = document.getElementById("production-summary");
  const totalProductionsCount = document.getElementById(
    "total-productions-count"
  );
  const totalProductionCost = document.getElementById("total-production-cost");
  const totalUnitsProduced = document.getElementById("total-units-produced");
  const productionReportBody = document.getElementById(
    "production-report-body"
  );

  // Elementos para Relatório de Vendas por Cliente
  const clientSalesStartDate = document.getElementById(
    "client-sales-start-date"
  );
  const clientSalesEndDate = document.getElementById("client-sales-end-date");
  const clientSalesClient = document.getElementById("client-sales-client");
  const generateClientSalesReportBtn = document.getElementById(
    "generate-client-sales-report"
  );
  const exportClientSalesPdfBtn = document.getElementById(
    "export-client-sales-pdf"
  );
  const clientSalesSummary = document.getElementById("client-sales-summary");
  const clientTotalSalesCount = document.getElementById(
    "client-total-sales-count"
  );
  const clientTotalSalesAmount = document.getElementById(
    "client-total-sales-amount"
  );
  const clientAverageSale = document.getElementById("client-average-sale");
  const clientSalesReportBody = document.getElementById(
    "client-sales-report-body"
  );

  // Elementos para imagem e embalagem
  const productImageInput = document.getElementById("product-image");
  const productImagePreview = document.getElementById("product-image-preview");
  const removeImageBtn = document.getElementById("remove-image");
  const productUnitSelect = document.getElementById("product-unit");

  // NOVOS ELEMENTOS: Consulta de produtos e clientes
  // Consulta de produtos
  const searchProductBarcode = document.getElementById(
    "search-product-barcode"
  );
  const searchProductDescription = document.getElementById(
    "search-product-description"
  );
  const searchProductAll = document.getElementById("search-product-all");
  const productSearchInput = document.getElementById("product-search-input");
  const searchProductConsultaBtn = document.getElementById(
    "search-product-consulta-btn"
  ); // Renomeado
  const clearProductSearch = document.getElementById("clear-product-search");

  // Consulta de clientes
  const searchClientName = document.getElementById("search-client-name");
  const searchClientCpf = document.getElementById("client-cpf");
  const searchClientCnpj = document.getElementById("client-cnpj");
  const searchClientAll = document.getElementById("search-client-all");
  const clientSearchInput = document.getElementById("client-search-input");
  const searchClientBtn = document.getElementById("search-client-btn");
  const clearClientSearch = document.getElementById("clear-client-search");

  // NOVOS ELEMENTOS: Visão Geral
  const totalProductsSummary = document.getElementById(
    "total-products-summary"
  );
  const totalClientsSummary = document.getElementById("total-clients-summary");
  const totalSalesSummary = document.getElementById("total-sales-summary");
  const totalUsersSummary = document.getElementById("total-users-summary");
  let stockStatusChart = null; // Variável para o gráfico de estoque
  let salesChartInstance = null; // Variável para o gráfico de vendas

  // NOVOS ELEMENTOS: Usuários
  const userForm = document.getElementById("user-form");
  const usersTableBody = document.getElementById("users-table-body");
  const userSearchInput = document.getElementById("user-search-input");
  const searchUserBtn = document.getElementById("search-user-btn");
  const clearUserSearch = document.getElementById("clear-user-search");
  const userRoleSelect = document.getElementById('user-role');
  const toggleUserFormBtn = document.getElementById('toggle-user-form-btn');
  const userFormContainer = document.getElementById('user-form-container');

  const editUserRoleModal = document.getElementById("edit-user-role-modal");
  const editUserRoleModalUserName = document.getElementById(
    "edit-user-role-modal-user-name"
  );
  const editUserRoleModalSelect = document.getElementById(
    "edit-user-role-select"
  );
  const editUserRoleModalCloseBtn = document.getElementById(
    "edit-user-role-modal-close-btn"
  );
  const editUserRoleModalCancelBtn = document.getElementById(
    "edit-user-role-modal-cancel-btn"
  );
  const editUserRoleModalConfirmBtn = document.getElementById(
    "edit-user-role-modal-confirm-btn"
  );


  // Dados da aplicação
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let productions = JSON.parse(localStorage.getItem("productions")) || [];
  let stockMovementsList =
    JSON.parse(localStorage.getItem("stockMovements")) || [];
  let clients = JSON.parse(localStorage.getItem("clients")) || [];
  let sales = JSON.parse(localStorage.getItem("sales")) || [];
  let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  let currentProduction = null;
  let cart = [];

  // Exibir o nome do usuário
  if (currentUser && userNameDisplay) {
    userNameDisplay.textContent = currentUser.nome;
  }

  // Lógica do menu de usuário
  if (userMenuToggle) {
    userMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Impede que o evento de clique na janela feche o menu imediatamente
      userMenuDropdown.classList.toggle("hidden");
    });
  }

  // Fechar o menu de usuário se clicar fora dele
  window.addEventListener("click", () => {
    if (userMenuDropdown && !userMenuDropdown.classList.contains("hidden")) {
      userMenuDropdown.classList.add("hidden");
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    // Clear session storage flag
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("authToken");
    // Redirect to login page
    window.location.href = "auth/login.html";
  });

  // Navegação do menu lateral
  const sections = {
    overview: {
      element: document.getElementById("overview-section"),
      title: "Visão Geral",
      onShow: () => {
        updateOverviewCards();
      },
    },
    products: {
      element: document.getElementById("products-section"),
      title: "Cadastro de Produtos",
    },
    production: {
      element: document.getElementById("production-section"),
      title: "Controle de Produção",
      onShow: () => {
        updateFinishedProductSelect();
      },
    },
    stock: {
      element: document.getElementById("stock-section"),
      title: "Controle de Estoque",
      onShow: () => {
        loadStockTable();
      },
    },
    clients: {
      element: document.getElementById("clients-section"),
      title: "Cadastro de Clientes",
    },
    pdv: {
      element: document.getElementById("pdv-section"),
      title: "Ponto de Venda (PDV)",
      onShow: () => {
        loadProductsGrid();
        loadSaleClientSelect();
      },
    },
    reports: {
      element: document.getElementById("reports-section"),
      title: "Relatórios",
      onShow: () => {
        updateProductionProductSelect();
        updateClientSalesClientSelect();
      },
    },
    users: {
      element: document.getElementById("users-section"),
      title: "Cadastro de Usuários",
      onShow: () => {
        loadUsersTable();
        loadRolesForRegistration();
      },
    },
  };

  sidebarMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove a classe 'active' de todos os itens
      sidebarMenuItems.forEach((i) => i.classList.remove("active"));
      // Adiciona a classe 'active' ao item clicado
      item.classList.add("active");

      const sectionName = item.getAttribute("data-section");

      // Oculta todas as seções
      Object.values(sections).forEach((sectionInfo) => {
        if (sectionInfo.element) {
          sectionInfo.element.classList.add("hidden");
        }
      });

      // Mostra a seção correspondente
      const selectedSection = sections[sectionName];
      if (selectedSection && selectedSection.element) {
        selectedSection.element.classList.remove("hidden");
        sectionTitle.textContent = selectedSection.title;
        if (selectedSection.onShow) {
          selectedSection.onShow();
        }
      }
    });
  });

  // Alternar entre abas nos relatórios
  if (tabBtns) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");

        // Remover active de todos os botões e conteúdos
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        // Adicionar active no botão e conteúdo clicado
        btn.classList.add("active");
        document.getElementById(tabId).classList.add("active");
      });
    });
  }

  // Cadastro de produtos
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const barcode = document.getElementById("product-barcode").value;
      const description = document.getElementById("product-description").value;
      const cost = parseFloat(document.getElementById("product-cost").value);
      const price = parseFloat(document.getElementById("product-price").value);
      const stock = parseFloat(document.getElementById("product-stock").value);
      const minStock = parseFloat(
        document.getElementById("product-min-stock").value
      );
      const type = document.querySelector(
        'input[name="product-type"]:checked'
      ).value;
      const unit = productUnitSelect.value;

      // Validar se o código de barras já existe
      if (products.find((p) => p.barcode === barcode)) {
        showNotification(
          "Já existe um produto com este código de barras!",
          "error"
        );
        return;
      }

      // Processar imagem (se fornecida)
      let imageData = null;
      if (productImageInput.files && productImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imageData = e.target.result;
          // Continuar com o salvamento do produto após a leitura da imagem
          saveProductWithImage();
        };
        reader.readAsDataURL(productImageInput.files[0]);
      } else {
        saveProductWithImage();
      }

      function saveProductWithImage() {
        // Adicionar produto
        const product = {
          id: Date.now().toString(),
          barcode,
          description,
          cost,
          price,
          stock,
          minStock,
          type,
          unit,
          image: imageData,
        };

        products.push(product);
        saveProducts();
        loadProducts();
        updateFinishedProductSelect();
        updateProductionProductSelect();

        // Registrar movimentação de estoque inicial
        addStockMovement(product.id, "ENTRADA", stock, "Estoque inicial");

        // Limpar formulário
        productForm.reset();
        productImagePreview.style.display = "none";
        removeImageBtn.style.display = "none";
        showNotification("Produto salvo com sucesso!", "success");
      }
    });
  }

  // Visualização de imagem antes do upload
  if (productImageInput) {
    productImageInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          productImagePreview.src = e.target.result;
          productImagePreview.style.display = "block";
          removeImageBtn.style.display = "inline-block";
        };

        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  // Remover imagem selecionada
  if (removeImageBtn) {
    removeImageBtn.addEventListener("click", function () {
      productImageInput.value = "";
      productImagePreview.style.display = "none";
      this.style.display = "none";
    });
  }

  // Carregar produtos na tabela
  function loadProducts(productsToLoad = products) {
    productsTableBody.innerHTML = "";

    if (productsToLoad.length === 0) {
      productsTableBody.innerHTML =
        '<tr><td colspan="8" style="text-align: center;">Nenhum produto encontrado</td></tr>';
      return;
    }

    productsToLoad.forEach((product) => {
      const row = document.createElement("tr");
      const typeBadge = getTypeBadge(product.type);
      const stockClass = getStockClass(product.stock, product.minStock);
      const unitText = getUnitText(product.unit);

      row.innerHTML = `
                    <td>${product.barcode}</td>
                    <td>${product.description}</td>
                    <td>${typeBadge}</td>
                    <td>${unitText}</td>
                    <td>R$ ${product.cost.toFixed(2)}</td>
                    <td>R$ ${product.price.toFixed(2)}</td>
                    <td class="${stockClass}">${product.stock}</td>
                    <td class="actions-cell">
                        <a href="#" class="action-icon" onclick="editProduct('${
                          product.id
                        }')" title="Editar"><i class="bi bi-pencil-fill"></i></a>
                        <a href="#" class="action-icon" onclick="deleteProduct('${
                          product.id
                        }')" title="Excluir"><i class="bi bi-trash-fill"></i></a>
                    </td>
                `;
      productsTableBody.appendChild(row);
    });
  }

  // Obter badge para o tipo de produto
  function getTypeBadge(type) {
    let badgeClass = "";
    let badgeText = "";

    switch (type) {
      case "finished":
        badgeClass = "finished";
        badgeText = "Acabado";
        break;
      case "intermediate":
        badgeClass = "intermediate";
        badgeText = "Intermediário";
        break;
      case "supply":
        badgeClass = "supply";
        badgeText = "Insumo";
        break;
    }

    return `<span class="product-type-badge ${badgeClass}">${badgeText}</span>`;
  }

  // Obter classe CSS para o estoque baseado no nível
  function getStockClass(stock, minStock) {
    if (stock <= 0) return "stock-low";
    if (stock <= minStock) return "stock-warning";
    return "stock-ok";
  }

  // Obter texto da embalagem
  function getUnitText(unit) {
    switch (unit) {
      case "un":
        return "UN";
      case "kg":
        return "KG";
      case "l":
        return "Litro";
      default:
        return unit;
    }
  }

  // Atualizar select de produtos acabados
  function updateFinishedProductSelect() {
    finishedProductSelect.innerHTML =
      '<option value="">Selecione um produto</option>';

    // Filtrar apenas produtos acabados
    const finishedProducts = products.filter(
      (product) => product.type === "finished"
    );

    finishedProducts.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${product.description} (R$ ${product.price.toFixed(
        2
      )})`;
      finishedProductSelect.appendChild(option);
    });
  }

  // Atualizar select de produtos para relatório de produção
 function updateProductionProductSelect() {
  // busque sempre que for usar (evita referência velha/null)
  const select = document.getElementById("production-product");
  if (!select) {
    console.warn('#production-product não encontrado; ignorando atualização.');
    return; // não quebre a app se a aba/elemento não existe ainda
  }

  select.innerHTML = '<option value="all">Todos</option>';

  const finishedProducts = products.filter(p => p.type === "finished");
  finishedProducts.forEach(product => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.description;
    select.appendChild(option);
  });
}


  // Atualizar select de clientes para relatório de vendas por cliente
  function updateClientSalesClientSelect() {
  const select = document.getElementById("client-sales-client");
  if (!select) {
    console.warn('#client-sales-client não encontrado; ignorando atualização.');
    return;
  }

  select.innerHTML = '<option value="all">Todos os Clientes</option>';
  clients.forEach(client => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name;
    select.appendChild(option);
  });
}


  // Salvar produtos no localStorage
  function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Salvar produções no localStorage
  function saveProductions() {
    localStorage.setItem("productions", JSON.stringify(productions));
  }

  // Salvar movimentações de estoque no localStorage
  function saveStockMovements() {
    localStorage.setItem("stockMovements", JSON.stringify(stockMovementsList));
  }

  // Salvar clientes no localStorage
  function saveClients() {
    localStorage.setItem("clients", JSON.stringify(clients));
  }

  // Salvar vendas no localStorage
  function saveSales() {
    localStorage.setItem("sales", JSON.stringify(sales));
  }

  // Adicionar ingrediente à receita
  if (addIngredientBtn) {
    addIngredientBtn.addEventListener("click", () => {
      addIngredientRow();
    });
  }

  function addIngredientRow(ingredient = null) {
    const row = document.createElement("div");
    row.className = "ingredient-row";

    // Filtrar apenas insumos e produtos intermediários para ingredientes
    const ingredientProducts = products.filter(
      (p) => p.type === "supply" || p.type === "intermediate"
    );

    row.innerHTML = `
                <div class="form-group">
                    <label>Ingrediente</label>
                    <select class="ingredient-select" required>
                        <option value="">Selecione um ingrediente</option>
                        ${ingredientProducts
                          .map(
                            (p) =>
                              `<option value="${p.id}" ${
                                ingredient && ingredient.id === p.id
                                  ? "selected"
                                  : ""
                              }>${p.description} (Estoque: ${
                                p.stock
                              } ${getUnitText(p.unit)})</option>`
                          )
                          .join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantidade</label>
                    <input type="number" class="ingredient-quantity" min="0" step="0.01" value="${
                      ingredient ? ingredient.quantity : ""
                    }" required>
                </div>
                <div class="form-group">
                    <label>Unidade</label>
                    <select class="ingredient-unit" required>
                        <!-- Opções serão preenchidas dinamicamente com base no produto selecionado -->
                    </select>
                </div>
                <button type="button" class="btn btn-danger remove-ingredient">Remover</button>
            `;

    ingredientsContainer.appendChild(row);

    // Adicionar evento para atualizar unidade quando ingrediente for selecionado
    const ingredientSelect = row.querySelector(".ingredient-select");
    const unitSelect = row.querySelector(".ingredient-unit");

    // Preencher unidade se já tiver um ingrediente selecionado
    if (ingredient && ingredient.id) {
      const product = products.find((p) => p.id === ingredient.id);
      if (product) {
        updateUnitOptions(unitSelect, product.unit);
        unitSelect.value = ingredient.unit || product.unit;
      }
    }

    // Atualizar opções de unidade quando ingrediente for alterado
    ingredientSelect.addEventListener("change", function () {
      const productId = this.value;
      if (productId) {
        const product = products.find((p) => p.id === productId);
        if (product) {
          updateUnitOptions(unitSelect, product.unit);
        }
      }
    });

    // Adicionar evento para remover ingrediente
    row.querySelector(".remove-ingredient").addEventListener("click", () => {
      row.remove();
    });
  }

  // Atualizar opções de unidade com base na embalagem do produto
  function updateUnitOptions(unitSelect, productUnit) {
    unitSelect.innerHTML = "";

    // Adicionar a unidade padrão do produto como primeira opção
    const defaultOption = document.createElement("option");
    defaultOption.value = productUnit;
    defaultOption.textContent = getUnitText(productUnit);
    unitSelect.appendChild(defaultOption);

    // Adicionar outras opções de conversão baseadas na unidade do produto
    if (productUnit === "kg") {
      unitSelect.innerHTML += `
                    <option value="g">Gramas (g)</option>
                    <option value="kg">Quilogramas (kg)</option>
                `;
    } else if (productUnit === "l") {
      unitSelect.innerHTML += `
                    <option value="ml">Mililitros (ml)</option>
                    <option value="l">Litros (l)</option>
                `;
    } else if (productUnit === "un") {
      unitSelect.innerHTML += `
                    <option value="un">Unidades (un)</option>
                `;
    }
  }

  // Processar formulário de produção
  if (productionForm) {
    productionForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const finishedProductId = finishedProductSelect.value;
      const batchSize = parseInt(document.getElementById("batch-size").value);

      if (!finishedProductId) {
        showNotification("Selecione um produto acabado!", "error");
        return;
      }

      const finishedProduct = products.find((p) => p.id === finishedProductId);
      if (!finishedProduct) {
        showNotification("Produto acabado não encontrado!", "error");
        return;
      }

      // Coletar ingredientes
      const ingredientRows =
        ingredientsContainer.querySelectorAll(".ingredient-row");
      if (ingredientRows.length === 0) {
        showNotification("Adicione pelo menos um ingrediente!", "error");
        return;
      }

      const ingredients = [];
      let totalCost = 0;
      let hasInsufficientStock = false;

      ingredientRows.forEach((row) => {
        const select = row.querySelector(".ingredient-select");
        const quantityInput = row.querySelector(".ingredient-quantity");
        const unitSelect = row.querySelector(".ingredient-unit");

        const ingredientId = select.value;
        const quantity = parseFloat(quantityInput.value);
        const unit = unitSelect.value;

        if (!ingredientId || isNaN(quantity)) {
          showNotification(
            "Preencha todos os campos dos ingredientes!",
            "error"
          );
          return;
        }

        const ingredientProduct = products.find((p) => p.id === ingredientId);
        if (!ingredientProduct) {
          showNotification("Ingrediente não encontrado!", "error");
          return;
        }

        // Verificar se há estoque suficiente
        if (ingredientProduct.stock < quantity) {
          hasInsufficientStock = true;
          row.style.border = "2px solid #e74c3c";
        } else {
          row.style.border = "";
        }

        // Calcular custo do ingrediente (simplificado)
        let cost = 0;
        if (unit === "g" || unit === "ml") {
          // Assumindo que o custo do produto é por kg ou litro
          cost = (ingredientProduct.cost / 1000) * quantity;
        } else if (unit === "kg" || unit === "l") {
          cost = ingredientProduct.cost * quantity;
        } else if (unit === "un") {
          cost = ingredientProduct.cost * quantity;
        }

        ingredients.push({
          id: ingredientId,
          product: ingredientProduct,
          quantity,
          unit,
          cost,
        });

        totalCost += cost;
      });

      if (hasInsufficientStock) {
        showNotification(
          "Estoque insuficiente para um ou mais ingredientes!",
          "error"
        );
        saveProductionBtn.disabled = true;
        return;
      }

      // Calcular resultados
      const unitCost = totalCost / batchSize;
      const profitMargin =
        ((finishedProduct.price - unitCost) / finishedProduct.price) * 100;

      // Exibir resultados
      document.getElementById(
        "total-cost"
      ).textContent = `R$ ${totalCost.toFixed(2)}`;
      document.getElementById("unit-cost").textContent = `R$ ${unitCost.toFixed(
        2
      )}`;
      document.getElementById("yield").textContent = `${batchSize} unidades`;
      document.getElementById(
        "profit-margin"
      ).textContent = `${profitMargin.toFixed(2)}%`;

      // Atualizar produção atual
      currentProduction = {
        finishedProductId,
        finishedProduct,
        batchSize,
        ingredients,
        totalCost,
        unitCost,
        profitMargin,
        date: new Date().toISOString(),
      };

      // Habilitar botão de salvar produção
      saveProductionBtn.disabled = false;

      productionResults.classList.remove("hidden");
    });
  }

  // Salvar produção
  if (saveProductionBtn) {
    saveProductionBtn.addEventListener("click", () => {
      if (!currentProduction) return;

      // Atualizar estoque
      // Adicionar produto acabado ao estoque
      const finishedProduct = products.find(
        (p) => p.id === currentProduction.finishedProductId
      );
      if (finishedProduct) {
        finishedProduct.stock += currentProduction.batchSize;
        addStockMovement(
          finishedProduct.id,
          "ENTRADA",
          currentProduction.batchSize,
          "Produção"
        );
      }

      // Remover ingredientes do estoque
      currentProduction.ingredients.forEach((ingredient) => {
        const product = products.find((p) => p.id === ingredient.id);
        if (product) {
          product.stock -= ingredient.quantity;
          addStockMovement(
            product.id,
            "SAÍDA",
            ingredient.quantity,
            "Produção"
          );
        }
      });

      // Salvar produção no histórico
      productions.push({
        ...currentProduction,
        id: Date.now().toString(),
      });

      // Salvar dados
      saveProducts();
      saveProductions();
      saveStockMovements();

      // Recarregar dados
      loadProducts();
      loadProductionHistory();
      loadStockMovements();

      // Limpar formulário
      productionForm.reset();
      ingredientsContainer.innerHTML = "";
      addIngredientRow();
      productionResults.classList.add("hidden");
      saveProductionBtn.disabled = true;
      currentProduction = null;

      showNotification(
        "Produção salva com sucesso! Estoque atualizado.",
        "success"
      );
    });
  }

  // Carregar histórico de produção
  function loadProductionHistory() {
    productionHistory.innerHTML = "";

    if (productions.length === 0) {
      productionHistory.innerHTML =
        '<p style="text-align: center; padding: 20px; color: #666;">Nenhuma produção registrada</p>';
      return;
    }

    // Ordenar produções por data (mais recente primeiro)
    const sortedProductions = [...productions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedProductions.forEach((production) => {
      const item = document.createElement("div");
      item.className = "history-item";

      const date = new Date(production.date).toLocaleDateString("pt-BR");
      const time = new Date(production.date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      item.innerHTML = `
                    <div class="history-info">
                        <div class="history-date">${date} às ${time}</div>
                        <div class="history-product">${
                          production.finishedProduct.description
                        }</div>
                        <div class="history-details">Quantidade: ${
                          production.batchSize
                        } unidades | Custo total: R$ ${production.totalCost.toFixed(
        2
      )}</div>
                    </div>
                    <div class="history-quantity positive">+${
                      production.batchSize
                    }</div>
                `;

      productionHistory.appendChild(item);
    });
  }

  // Carregar tabela de estoque
  function loadStockTable() {
    stockTableBody.innerHTML = "";

    if (products.length === 0) {
      stockTableBody.innerHTML =
        '<tr><td colspan="8" style="text-align: center;">Nenhum produto cadastrado</td></tr>';
      return;
    }

    products.forEach((product) => {
      const row = document.createElement("tr");
      const typeBadge = getTypeBadge(product.type);
      const stockClass = getStockClass(product.stock, product.minStock);
      const stockStatus = getStockStatus(product.stock, product.minStock);
      const unitText = getUnitText(product.unit);

      row.innerHTML = `
                    <td>${product.barcode}</td>
                    <td>${product.description}</td>
                    <td>${typeBadge}</td>
                    <td>${unitText}</td>
                    <td class="${stockClass}">${product.stock}</td>
                    <td>${product.minStock}</td>
                    <td>${stockStatus}</td>
                    <td class="actions-cell">
                        <a href="#" class="action-icon" onclick="adjustStock('${product.id}')" title="Ajustar Estoque"><i class="bi bi-pencil-fill"></i></a>
                    </td>
                `;
      stockTableBody.appendChild(row);
    });
  }

  // Obter status do estoque
  function getStockStatus(stock, minStock) {
    if (stock <= 0) return '<span class="stock-low">ESGOTADO</span>';
    if (stock <= minStock) return '<span class="stock-warning">BAIXO</span>';
    return '<span class="stock-ok">NORMAL</span>';
  }

  // Carregar movimentações de estoque
  function loadStockMovements() {
    stockMovements.innerHTML = "";

    if (stockMovementsList.length === 0) {
      stockMovements.innerHTML =
        '<p style="text-align: center; padding: 20px; color: #666;">Nenhuma movimentação registrada</p>';
      return;
    }

    // Ordenar movimentações por data (mais recente primeiro)
    const sortedMovements = [...stockMovementsList].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedMovements.forEach((movement) => {
      const product = products.find((p) => p.id === movement.productId);
      if (!product) return;

      const item = document.createElement("div");
      item.className = "history-item";

      const date = new Date(movement.date).toLocaleDateString("pt-BR");
      const time = new Date(movement.date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const quantityClass =
        movement.type === "ENTRADA" ? "positive" : "negative";
      const quantitySymbol = movement.type === "ENTRADA" ? "+" : "-";

      item.innerHTML = `
                    <div class="history-info">
                        <div class="history-date">${date} às ${time}</div>
                        <div class="history-product">${product.description}</div>
                        <div class="history-details">${movement.reason}</div>
                    </div>
                    <div class="history-quantity ${quantityClass}">${quantitySymbol}${movement.quantity}</div>
                `;

      stockMovements.appendChild(item);
    });
  }

  // Adicionar movimentação de estoque
  function addStockMovement(productId, type, quantity, reason) {
    const movement = {
      id: Date.now().toString(),
      productId,
      type,
      quantity,
      reason,
      date: new Date().toISOString(),
    };

    stockMovementsList.push(movement);
    saveStockMovements();
  }

  // Cadastro de clientes
  if (clientForm) {
    clientForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("client-name").value;
      const type = document.querySelector(
        'input[name="client-type"]:checked'
      ).value;
      const cpf = document.getElementById("client-cpf").value;
      const cnpj = document.getElementById("client-cnpj").value;
      const companyName = document.getElementById("client-company-name").value;
      const email = document.getElementById("client-email").value;
      const phone = document.getElementById("client-phone").value;
      const whatsapp = document.getElementById("client-whatsapp").value;
      const address = document.getElementById("client-address").value;

      // Validar campos obrigatórios baseados no tipo
      if (type === "physical" && !cpf) {
        showNotification("CPF é obrigatório para pessoa física!", "error");
        return;
      }

      if (type === "legal" && !cnpj) {
        showNotification("CNPJ é obrigatório para pessoa jurídica!", "error");
        return;
      }

      if (type === "legal" && !companyName) {
        showNotification(
          "Razão Social é obrigatória para pessoa jurídica!",
          "error"
        );
        return;
      }

      // Validar se CPF/CNPJ já existe
      if (type === "physical" && clients.find((c) => c.cpf === cpf)) {
        showNotification("Já existe um cliente com este CPF!", "error");
        return;
      }

      if (type === "legal" && clients.find((c) => c.cnpj === cnpj)) {
        showNotification("Já existe um cliente com este CNPJ!", "error");
        return;
      }

      // Adicionar cliente
      const client = {
        id: Date.now().toString(),
        name,
        type,
        cpf: type === "physical" ? cpf : "",
        cnpj: type === "legal" ? cnpj : "",
        companyName: type === "legal" ? companyName : "",
        email,
        phone,
        whatsapp,
        address,
      };

      clients.push(client);
      saveClients();
      loadClients();
      loadSaleClientSelect();
      updateClientSalesClientSelect(); // Atualizar select de clientes para relatório

      // Limpar formulário
      clientForm.reset();
      toggleClientFields(); // Reset para pessoa física
      showNotification("Cliente salvo com sucesso!", "success");
    });
  }

  // Carregar clientes na tabela
  function loadClients(clientsToLoad = clients) {
    clientsTableBody.innerHTML = "";

    if (clientsToLoad.length === 0) {
      clientsTableBody.innerHTML =
        '<tr><td colspan="7" style="text-align: center;">Nenhum cliente encontrado</td></tr>';
      return;
    }

    clientsToLoad.forEach((client) => {
      const row = document.createElement("tr");
      const typeBadge = getClientTypeBadge(client.type);
      const documentNumber =
        client.type === "physical" ? client.cpf : client.cnpj;

      row.innerHTML = `
                    <td>${client.name}</td>
                    <td>${typeBadge}</td>
                    <td>${documentNumber}</td>
                    <td>${client.email}</td>
                    <td>${client.phone}</td>
                    <td>${client.whatsapp}</td>
                    <td class="actions-cell">
                        <a href="#" class="action-icon" onclick="editClient('${client.id}')" title="Editar"><i class="bi bi-pencil-fill"></i></a>
                        <a href="#" class="action-icon" onclick="deleteClient('${client.id}')" title="Excluir"><i class="bi bi-trash-fill"></i></a>
                    </td>
                `;
      clientsTableBody.appendChild(row);
    });
  }

  // Obter badge para o tipo de cliente
  function getClientTypeBadge(type) {
    let badgeClass = "";
    let badgeText = "";

    switch (type) {
      case "physical":
        badgeClass = "physical";
        badgeText = "Pessoa Física";
        break;
      case "legal":
        badgeClass = "legal";
        badgeText = "Pessoa Jurídica";
        break;
    }

    return `<span class="customer-type-badge ${badgeClass}">${badgeText}</span>`;
  }

  // Alternar campos baseados no tipo de cliente
  function toggleClientFields() {
    const clientType = document.querySelector(
      'input[name="client-type"]:checked'
    ).value;

    if (clientType === "physical") {
      cpfField.style.display = "block";
      cnpjField.style.display = "none";
      companyNameField.style.display = "none";

      document.getElementById("client-cpf").required = true;
      document.getElementById("client-cnpj").required = false;
      document.getElementById("client-company-name").required = false;
    } else {
      cpfField.style.display = "none";
      cnpjField.style.display = "block";
      companyNameField.style.display = "block";

      document.getElementById("client-cpf").required = false;
      document.getElementById("client-cnpj").required = true;
      document.getElementById("client-company-name").required = true;
    }
  }

  // Adicionar eventos para alternar campos de cliente
  if (clientTypeRadios) {
    clientTypeRadios.forEach((radio) => {
      radio.addEventListener("change", toggleClientFields);
    });
  }

  // Carregar select de clientes para venda
  function loadSaleClientSelect() {
    saleClient.innerHTML = '<option value="">Selecione um cliente</option>';

    clients.forEach((client) => {
      const option = document.createElement("option");
      option.value = client.id;
      option.textContent = `${client.name} (${
        client.type === "physical" ? client.cpf : client.cnpj
      })`;
      saleClient.appendChild(option);
    });
  }

  // PDV - Carregar produtos na grade
  function loadProductsGrid() {
    productsGrid.innerHTML = "";

    if (products.length === 0) {
      productsGrid.innerHTML =
        '<p style="text-align: center; padding: 20px; color: #666;">Nenhum produto cadastrado</p>';
      return;
    }

    // Filtrar produtos por tipo selecionado
    const selectedType = productTypeFilter.value;
    let filteredProducts = products;

    if (selectedType !== "all") {
      filteredProducts = products.filter(
        (product) => product.type === selectedType && product.stock > 0
      );
    } else {
      filteredProducts = products.filter((product) => product.stock > 0);
    }

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML =
        '<p style="text-align: center; padding: 20px; color: #666;">Nenhum produto disponível para venda</p>';
      return;
    }

    filteredProducts.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-id", product.id);

      // Adicionar imagem do produto no PDV
      let imageHtml = "";
      if (product.image) {
        imageHtml = `<img src="${product.image}" class="product-image-pdv" alt="${product.description}">`;
      } else {
        imageHtml = `<div class="no-image">Sem imagem</div>`;
      }

      card.innerHTML = `
                    ${imageHtml}
                    <h4>${product.description}</h4>
                    <div class="price">R$ ${product.price.toFixed(2)}</div>
                    <div class="stock">Estoque: ${product.stock} ${getUnitText(
        product.unit
      )}</div>
                    <div>${getTypeBadge(product.type)}</div>
                `;

      card.addEventListener("click", () => {
        addToCart(product);
      });

      productsGrid.appendChild(card);
    });
  }

  // PDV - Filtrar produtos por tipo
  if (productTypeFilter) {
    productTypeFilter.addEventListener("change", loadProductsGrid);
  }

  // PDV - Buscar produtos
  if (searchProductPdvBtn) {
    searchProductPdvBtn.addEventListener("click", () => {
      const searchTerm = productSearch.value.toLowerCase();

      if (!searchTerm) {
        loadProductsGrid();
        return;
      }

      const selectedType = productTypeFilter.value;
      let filteredProducts = products;

      if (selectedType !== "all") {
        filteredProducts = products.filter(
          (product) =>
            product.type === selectedType &&
            product.stock > 0 &&
            (product.description.toLowerCase().includes(searchTerm) ||
              product.barcode.toLowerCase().includes(searchTerm))
        );
      } else {
        filteredProducts = products.filter(
          (product) =>
            product.stock > 0 &&
            (product.description.toLowerCase().includes(searchTerm) ||
              product.barcode.toLowerCase().includes(searchTerm))
        );
      }

      productsGrid.innerHTML = "";

      if (filteredProducts.length === 0) {
        productsGrid.innerHTML =
          '<p style="text-align: center; padding: 20px; color: #666;">Nenhum produto encontrado</p>';
        return;
      }

      filteredProducts.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("data-id", product.id);

        // Adicionar imagem do produto no PDV
        let imageHtml = "";
        if (product.image) {
          imageHtml = `<img src="${product.image}" class="product-image-pdv" alt="${product.description}">`;
        } else {
          imageHtml = `<div class="no-image">Sem imagem</div>`;
        }

        card.innerHTML = `
                        ${imageHtml}
                        <h4>${product.description}</h4>
                        <div class="price">R$ ${product.price.toFixed(2)}</div>
                        <div class="stock">Estoque: ${
                          product.stock
                        } ${getUnitText(product.unit)}</div>
                        <div>${getTypeBadge(product.type)}</div>
                    `;

        card.addEventListener("click", () => {
          addToCart(product);
        });

        productsGrid.appendChild(card);
      });
    });
  }

  // PDV - Adicionar produto ao carrinho
  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
      } else {
        showNotification(
          `Estoque insuficiente para ${product.description}. Disponível: ${product.stock}`,
          "error"
        );
        return;
      }
    } else {
      if (product.stock > 0) {
        cart.push({
          id: product.id,
          name: product.description,
          price: product.price,
          quantity: 1,
          type: product.type,
          unit: product.unit,
        });
      } else {
        showNotification(
          `Estoque esgotado para ${product.description}`,
          "error"
        );
        return;
      }
    }

    updateCartDisplay();
  }

  // PDV - Atualizar exibição do carrinho
  function updateCartDisplay() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML =
        '<p style="text-align: center; padding: 20px; color: #666;">Carrinho vazio</p>';
      cartSubtotal.textContent = "R$ 0,00";
      cartDiscount.textContent = "R$ 0,00";
      cartTotal.textContent = "R$ 0,00";
      return;
    }

    let subtotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-details">
                            <span>R$ ${item.price.toFixed(2)} x ${
        item.quantity
      } ${getUnitText(item.unit)}</span>
                            <span>R$ ${itemTotal.toFixed(2)}</span>
                        </div>
                        <div>${getTypeBadge(item.type)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" class="cart-item-quantity" value="${
                          item.quantity
                        }" min="1" max="${getProductStock(item.id)}" data-id="${
        item.id
      }">
                        <button class="remove-item" data-id="${
                          item.id
                        }">×</button>
                    </div>
                `;

      cartItems.appendChild(cartItem);
    });

    // Adicionar eventos aos inputs de quantidade e botões de remoção
    document.querySelectorAll(".cart-item-quantity").forEach((input) => {
      input.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        const newQuantity = parseInt(e.target.value);
        const maxStock = getProductStock(id);

        if (newQuantity > maxStock) {
          showNotification(
            `Estoque insuficiente. Disponível: ${maxStock}`,
            "error"
          );
          e.target.value = maxStock;
          updateCartItemQuantity(id, maxStock);
        } else if (newQuantity < 1) {
          removeFromCart(id);
        } else {
          updateCartItemQuantity(id, newQuantity);
        }

        updateCartDisplay();
      });
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        removeFromCart(id);
        updateCartDisplay();
      });
    });

    // Calcular desconto baseado no tipo selecionado
    const discountValue = parseFloat(discountInput.value) || 0;
    const discountType = document.querySelector(
      'input[name="discount-type"]:checked'
    ).value;

    let discount = 0;
    if (discountType === "percent") {
      discount = (subtotal * discountValue) / 100;
    } else {
      discount = discountValue;
    }

    const total = subtotal - discount;

    cartSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
    cartDiscount.textContent = `R$ ${discount.toFixed(2)}`;
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
  }

  // PDV - Obter estoque do produto
  function getProductStock(productId) {
    const product = products.find((p) => p.id === productId);
    return product ? product.stock : 0;
  }

  // PDV - Atualizar quantidade do item no carrinho
  function updateCartItemQuantity(productId, quantity) {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // PDV - Remover item do carrinho
  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
  }

  // PDV - Atualizar desconto
  if (discountInput) {
    discountInput.addEventListener("input", () => {
      updateCartDisplay();
    });
  }

  // Atualizar tipo de desconto
  if (discountTypeRadios) {
    discountTypeRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        updateCartDisplay();
      });
    });
  }

  // PDV - Limpar carrinho
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      discountInput.value = "0";
      updateCartDisplay();
    });
  }

  // PDV - Finalizar venda
  if (finalizeSaleBtn) {
    finalizeSaleBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showNotification(
          "Adicione produtos ao carrinho antes de finalizar a venda.",
          "error"
        );
        return;
      }

      const discountValue = parseFloat(discountInput.value) || 0;
      const discountType = document.querySelector(
        'input[name="discount-type"]:checked'
      ).value;
      const payment = paymentMethod.value;
      const clientId = saleClient.value;
      const client = clientId ? clients.find((c) => c.id === clientId) : null;

      // Calcular total
      let subtotal = 0;
      cart.forEach((item) => {
        subtotal += item.price * item.quantity;
      });

      // Calcular desconto baseado no tipo
      let discount = 0;
      if (discountType === "percent") {
        discount = (subtotal * discountValue) / 100;
      } else {
        discount = discountValue;
      }

      const total = subtotal - discount;

      // Verificar estoque
      for (const item of cart) {
        const product = products.find((p) => p.id === item.id);
        if (product.stock < item.quantity) {
          showNotification(
            `Estoque insuficiente para ${item.name}. Disponível: ${product.stock}, Solicitado: ${item.quantity}`,
            "error"
          );
          return;
        }
      }

      // Atualizar estoque
      cart.forEach((item) => {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          product.stock -= item.quantity;
          addStockMovement(product.id, "SAÍDA", item.quantity, "Venda");
        }
      });

      // Salvar venda
      const sale = {
        id: Date.now().toString(),
        items: [...cart],
        subtotal,
        discount,
        discountType, // Salvar tipo de desconto
        total,
        payment,
        client: client
          ? {
              id: client.id,
              name: client.name,
              document: client.type === "physical" ? client.cpf : client.cnpj,
            }
          : null,
        date: new Date().toISOString(),
      };

      sales.push(sale);
      saveSales();
      saveProducts();
      saveStockMovements();

      // Exibir cupom
      showReceipt(sale);

      // Limpar carrinho
      cart = [];
      discountInput.value = "0";
      saleClient.value = "";
      updateCartDisplay();
    });
  }

  // PDV - Exibir cupom
  function showReceipt(sale) {
    receiptDate.textContent = new Date().toLocaleString("pt-BR");
    receiptItems.innerHTML = "";

    sale.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      const receiptItem = document.createElement("div");
      receiptItem.className = "receipt-item";

      receiptItem.innerHTML = `
                    <div>${item.name} (${item.quantity}x)</div>
                    <div>R$ ${itemTotal.toFixed(2)}</div>
                `;

      receiptItems.appendChild(receiptItem);
    });

    receiptTotal.textContent = `R$ ${sale.total.toFixed(2)}`;

    const paymentMethods = {
      cash: "Dinheiro",
      pix: "Pix",
      debit: "Cartão de Débito",
      credit: "Cartão de Crédito",
    };

    receiptPayment.textContent = paymentMethods[sale.payment];

    receipt.classList.remove("hidden");
  }

  // PDV - Imprimir cupom
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // PDV - Enviar cupom por e-mail
  if (emailReceiptBtn) {
    emailReceiptBtn.addEventListener("click", () => {
      const clientId = saleClient.value;
      const client = clientId ? clients.find((c) => c.id === clientId) : null;

      if (client && client.email) {
        showNotification(`Cupom enviado para ${client.email}`, "info");
      } else {
        showNotification(
          "Nenhum cliente selecionado ou cliente não possui e-mail cadastrado.",
          "error"
        );
      }
    });
  }

  // PDV - Nova venda
  if (newSaleBtn) {
    newSaleBtn.addEventListener("click", () => {
      receipt.classList.add("hidden");
    });
  }

  // RELATÓRIOS - Gerar relatório de vendas
  if (generateSalesReportBtn) {
    generateSalesReportBtn.addEventListener("click", () => {
      const startDate = salesStartDate.value;
      const endDate = salesEndDate.value;
      const paymentMethod = salesPaymentMethod.value;

      // Filtrar vendas
      let filteredSales = [...sales];

      if (startDate) {
        filteredSales = filteredSales.filter((sale) => sale.date >= startDate);
      }

      if (endDate) {
        // Ajustar a data fim para incluir o dia inteiro
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filteredSales = filteredSales.filter(
          (sale) => sale.date <= end.toISOString()
        );
      }

      if (paymentMethod !== "all") {
        filteredSales = filteredSales.filter(
          (sale) => sale.payment === paymentMethod
        );
      }

      // Exibir resultados
      salesReportBody.innerHTML = "";

      if (filteredSales.length === 0) {
        salesReportBody.innerHTML =
          '<tr><td colspan="7" style="text-align: center;">Nenhuma venda encontrada no período</td></tr>';
        salesSummary.classList.add("hidden");
        return;
      }

      // Calcular totais
      let totalSales = 0;
      let totalDiscount = 0;
      let totalAmount = 0;

      filteredSales.forEach((sale) => {
        totalSales += sale.subtotal;
        totalDiscount += sale.discount;
        totalAmount += sale.total;

        const row = document.createElement("tr");
        const date = new Date(sale.date).toLocaleDateString("pt-BR");
        const clientName = sale.client ? sale.client.name : "Não informado";
        const itemsText = sale.items
          .map((item) => `${item.quantity}x ${item.name}`)
          .join(", ");

        row.innerHTML = `
                        <td>${date}</td>
                        <td>${clientName}</td>
                        <td>${getPaymentMethodText(sale.payment)}</td>
                        <td>${itemsText}</td>
                        <td>R$ ${sale.subtotal.toFixed(2)}</td>
                        <td>R$ ${sale.discount.toFixed(2)}</td>
                        <td>R$ ${sale.total.toFixed(2)}</td>
                    `;

        salesReportBody.appendChild(row);
      });

      // Atualizar resumo
      totalSalesCount.textContent = filteredSales.length;
      totalSalesAmount.textContent = `R$ ${totalAmount.toFixed(2)}`;
      averageSale.textContent = `R$ ${(
        totalAmount / filteredSales.length
      ).toFixed(2)}`;

      salesSummary.classList.remove("hidden");
    });
  }

  // RELATÓRIOS - Gerar relatório de produção
  if (generateProductionReportBtn) {
    generateProductionReportBtn.addEventListener("click", () => {
      const startDate = productionStartDate.value;
      const endDate = productionEndDate.value;
      const productId = productionProduct.value;

      // Filtrar produções
      let filteredProductions = [...productions];

      if (startDate) {
        filteredProductions = filteredProductions.filter(
          (production) => production.date >= startDate
        );
      }

      if (endDate) {
        // Ajustar a data fim para incluir o dia inteiro
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filteredProductions = filteredProductions.filter(
          (production) => production.date <= end.toISOString()
        );
      }

      if (productId !== "all") {
        filteredProductions = filteredProductions.filter(
          (production) => production.finishedProductId === productId
        );
      }

      // Exibir resultados
      productionReportBody.innerHTML = "";

      if (filteredProductions.length === 0) {
        productionReportBody.innerHTML =
          '<tr><td colspan="6" style="text-align: center;">Nenhuma produção encontrada no período</td></tr>';
        productionSummary.classList.add("hidden");
        return;
      }

      // Calcular totais
      let totalCost = 0;
      let totalUnits = 0;

      filteredProductions.forEach((production) => {
        totalCost += production.totalCost;
        totalUnits += production.batchSize;

        const row = document.createElement("tr");
        const date = new Date(production.date).toLocaleDateString("pt-BR");

        row.innerHTML = `
                        <td>${date}</td>
                        <td>${production.finishedProduct.description}</td>
                        <td>${production.batchSize}</td>
                        <td>R$ ${production.totalCost.toFixed(2)}</td>
                        <td>R$ ${production.unitCost.toFixed(2)}</td>
                        <td>${production.profitMargin.toFixed(2)}%</td>
                    `;

        productionReportBody.appendChild(row);
      });

      // Atualizar resumo
      totalProductionsCount.textContent = filteredProductions.length;
      totalProductionCost.textContent = `R$ ${totalCost.toFixed(2)}`;
      totalUnitsProduced.textContent = totalUnits;

      productionSummary.classList.remove("hidden");
    });
  }

  // RELATÓRIOS - Gerar relatório de vendas por cliente
  if (generateClientSalesReportBtn) {
    generateClientSalesReportBtn.addEventListener("click", () => {
      const startDate = clientSalesStartDate.value;
      const endDate = clientSalesEndDate.value;
      const clientId = clientSalesClient.value;

      // Filtrar vendas
      let filteredSales = [...sales];

      if (startDate) {
        filteredSales = filteredSales.filter((sale) => sale.date >= startDate);
      }

      if (endDate) {
        // Ajustar a data fim para incluir o dia inteiro
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filteredSales = filteredSales.filter(
          (sale) => sale.date <= end.toISOString()
        );
      }

      if (clientId !== "all") {
        filteredSales = filteredSales.filter(
          (sale) => sale.client && sale.client.id === clientId
        );
      }

      // Exibir resultados
      clientSalesReportBody.innerHTML = "";

      if (filteredSales.length === 0) {
        clientSalesReportBody.innerHTML =
          '<tr><td colspan="7" style="text-align: center;">Nenhuma venda encontrada no período</td></tr>';
        clientSalesSummary.classList.add("hidden");
        return;
      }

      // Calcular totais
      let totalSales = 0;
      let totalDiscount = 0;
      let totalAmount = 0;

      filteredSales.forEach((sale) => {
        totalSales += sale.subtotal;
        totalDiscount += sale.discount;
        totalAmount += sale.total;

        const row = document.createElement("tr");
        const date = new Date(sale.date).toLocaleDateString("pt-BR");
        const clientName = sale.client ? sale.client.name : "Não informado";
        const itemsText = sale.items
          .map((item) => `${item.quantity}x ${item.name}`)
          .join(", ");

        row.innerHTML = `
                        <td>${date}</td>
                        <td>${clientName}</td>
                        <td>${getPaymentMethodText(sale.payment)}</td>
                        <td>${itemsText}</td>
                        <td>R$ ${sale.subtotal.toFixed(2)}</td>
                        <td>R$ ${sale.discount.toFixed(2)}</td>
                        <td>R$ ${sale.total.toFixed(2)}</td>
                    `;

        clientSalesReportBody.appendChild(row);
      });

      // Atualizar resumo
      clientTotalSalesCount.textContent = filteredSales.length;
      clientTotalSalesAmount.textContent = `R$ ${totalAmount.toFixed(2)}`;
      clientAverageSale.textContent = `R$ ${(
        totalAmount / filteredSales.length
      ).toFixed(2)}`;

      clientSalesSummary.classList.remove("hidden");
    });
  }

  // RELATÓRIOS - Exportar PDF do relatório de vendas
  if (exportSalesPdfBtn) {
    exportSalesPdfBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Título
      doc.setFontSize(16);
      doc.text("Relatório de Vendas", 105, 15, { align: "center" });

      // Filtros aplicados
      doc.setFontSize(10);
      let filtersText = "Filtros: ";
      if (salesStartDate.value) filtersText += `De ${salesStartDate.value} `;
      if (salesEndDate.value) filtersText += `Até ${salesEndDate.value} `;
      if (salesPaymentMethod.value !== "all")
        filtersText += `| Pagamento: ${
          salesPaymentMethod.options[salesPaymentMethod.selectedIndex].text
        }`;

      doc.text(filtersText, 14, 25);

      // Dados das vendas
      const tableData = [];
      const headers = [
        "Data",
        "Cliente",
        "Pagamento",
        "Subtotal",
        "Desconto",
        "Total",
      ];

      let filteredSales = [...sales];

      if (salesStartDate.value) {
        filteredSales = filteredSales.filter(
          (sale) => sale.date >= salesStartDate.value
        );
      }

      if (salesEndDate.value) {
        const end = new Date(salesEndDate.value);
        end.setHours(23, 59, 59, 999);
        filteredSales = filteredSales.filter(
          (sale) => sale.date <= end.toISOString()
        );
      }

      if (salesPaymentMethod.value !== "all") {
        filteredSales = filteredSales.filter(
          (sale) => sale.payment === salesPaymentMethod.value
        );
      }

      filteredSales.forEach((sale) => {
        const date = new Date(sale.date).toLocaleDateString("pt-BR");
        const clientName = sale.client ? sale.client.name : "Não informado";

        tableData.push([
          date,
          clientName,
          getPaymentMethodText(sale.payment),
          `R$ ${sale.subtotal.toFixed(2)}`,
          `R$ ${sale.discount.toFixed(2)}`,
          `R$ ${sale.total.toFixed(2)}`,
        ]);
      });

      // Adicionar tabela
      doc.autoTable({
        startY: 35,
        head: [headers],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [106, 17, 203] },
      });

      // Resumo
      let totalAmount = 0;
      filteredSales.forEach((sale) => {
        totalAmount += sale.total;
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Total de Vendas: ${filteredSales.length}`, 14, finalY);
      doc.text(`Valor Total: R$ ${totalAmount.toFixed(2)}`, 14, finalY + 7);

      // Salvar PDF
      doc.save("relatorio_vendas.pdf");
    });
  }

  // RELATÓRIOS - Exportar PDF do relatório de produção
  if (exportProductionPdfBtn) {
    exportProductionPdfBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Título
      doc.setFontSize(16);
      doc.text("Relatório de Produção", 105, 15, { align: "center" });

      // Filtros aplicados
      doc.setFontSize(10);
      let filtersText = "Filtros: ";
      if (productionStartDate.value)
        filtersText += `De ${productionStartDate.value} `;
      if (productionEndDate.value)
        filtersText += `Até ${productionEndDate.value} `;
      if (productionProduct.value !== "all") {
        const product = products.find((p) => p.id === productionProduct.value);
        if (product) filtersText += `| Produto: ${product.description}`;
      }

      doc.text(filtersText, 14, 25);

      // Dados das produções
      const tableData = [];
      const headers = [
        "Data",
        "Produto",
        "Quantidade",
        "Custo Total",
        "Custo Unitário",
        "Margem",
      ];

      let filteredProductions = [...productions];

      if (productionStartDate.value) {
        filteredProductions = filteredProductions.filter(
          (production) => production.date >= productionStartDate.value
        );
      }

      if (productionEndDate.value) {
        const end = new Date(productionEndDate.value);
        end.setHours(23, 59, 59, 999);
        filteredProductions = filteredProductions.filter(
          (production) => production.date <= end.toISOString()
        );
      }

      if (productionProduct.value !== "all") {
        filteredProductions = filteredProductions.filter(
          (production) =>
            production.finishedProductId === productionProduct.value
        );
      }

      filteredProductions.forEach((production) => {
        const date = new Date(production.date).toLocaleDateString("pt-BR");

        tableData.push([
          date,
          production.finishedProduct.description,
          production.batchSize,
          `R$ ${production.totalCost.toFixed(2)}`,
          `R$ ${production.unitCost.toFixed(2)}`,
          `${production.profitMargin.toFixed(2)}%`,
        ]);
      });

      // Adicionar tabela
      doc.autoTable({
        startY: 35,
        head: [headers],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [106, 17, 203] },
      });

      // Resumo
      let totalCost = 0;
      let totalUnits = 0;
      filteredProductions.forEach((production) => {
        totalCost += production.totalCost;
        totalUnits += production.batchSize;
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Total de Produções: ${filteredProductions.length}`, 14, finalY);
      doc.text(`Unidades Produzidas: ${totalUnits}`, 14, finalY + 7);
      doc.text(`Custo Total: R$ ${totalCost.toFixed(2)}`, 14, finalY + 14);

      // Salvar PDF
      doc.save("relatorio_producao.pdf");
    });
  }

  // RELATÓRIOS - Exportar PDF do relatório de vendas por cliente
  if (exportClientSalesPdfBtn) {
    exportClientSalesPdfBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Título
      doc.setFontSize(16);
      doc.text("Relatório de Vendas por Cliente", 105, 15, { align: "center" });

      // Filtros aplicados
      doc.setFontSize(10);
      let filtersText = "Filtros: ";
      if (clientSalesStartDate.value)
        filtersText += `De ${clientSalesStartDate.value} `;
      if (clientSalesEndDate.value)
        filtersText += `Até ${clientSalesEndDate.value} `;
      if (clientSalesClient.value !== "all") {
        const client = clients.find((c) => c.id === clientSalesClient.value);
        if (client) filtersText += `| Cliente: ${client.name}`;
      }

      doc.text(filtersText, 14, 25);

      // Dados das vendas
      const tableData = [];
      const headers = [
        "Data",
        "Cliente",
        "Pagamento",
        "Subtotal",
        "Desconto",
        "Total",
      ];

      let filteredSales = [...sales];

      if (clientSalesStartDate.value) {
        filteredSales = filteredSales.filter(
          (sale) => sale.date >= clientSalesStartDate.value
        );
      }

      if (clientSalesEndDate.value) {
        const end = new Date(clientSalesEndDate.value);
        end.setHours(23, 59, 59, 999);
        filteredSales = filteredSales.filter(
          (sale) => sale.date <= end.toISOString()
        );
      }

      if (clientSalesClient.value !== "all") {
        filteredSales = filteredSales.filter(
          (sale) => sale.client && sale.client.id === clientSalesClient.value
        );
      }

      filteredSales.forEach((sale) => {
        const date = new Date(sale.date).toLocaleDateString("pt-BR");
        const clientName = sale.client ? sale.client.name : "Não informado";

        tableData.push([
          date,
          clientName,
          getPaymentMethodText(sale.payment),
          `R$ ${sale.subtotal.toFixed(2)}`,
          `R$ ${sale.discount.toFixed(2)}`,
          `R$ ${sale.total.toFixed(2)}`,
        ]);
      });

      // Adicionar tabela
      doc.autoTable({
        startY: 35,
        head: [headers],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [106, 17, 203] },
      });

      // Resumo
      let totalAmount = 0;
      filteredSales.forEach((sale) => {
        totalAmount += sale.total;
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Total de Vendas: ${filteredSales.length}`, 14, finalY);
      doc.text(`Valor Total: R$ ${totalAmount.toFixed(2)}`, 14, finalY + 7);

      // Salvar PDF
      doc.save("relatorio_vendas_cliente.pdf");
    });
  }

  // Função auxiliar para obter o texto da forma de pagamento
  function getPaymentMethodText(payment) {
    const methods = {
      cash: "Dinheiro",
      pix: "Pix",
      debit: "Cartão de Débito",
      credit: "Cartão de Crédito",
    };

    return methods[payment] || payment;
  }

  // NOVAS FUNÇÕES: Consulta de produtos e clientes

  // Consulta de produtos
  if (searchProductConsultaBtn) {
    searchProductConsultaBtn.addEventListener("click", searchProducts);
  }

  function searchProducts() {
    const searchType = document.querySelector(
      'input[name="product-search-type"]:checked'
    ).value;
    const searchTerm = productSearchInput.value.toLowerCase();

    let filteredProducts = [];

    if (searchType === "all") {
      filteredProducts = products.filter((product) =>
        Object.values(product).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    } else if (searchType === "barcode") {
      filteredProducts = products.filter((product) =>
        product.barcode.toLowerCase().includes(searchTerm)
      );
    } else if (searchType === "description") {
      filteredProducts = products.filter((product) =>
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    loadProducts(filteredProducts);
  }

  // Limpar busca de produtos
  if (clearProductSearch) {
    clearProductSearch.addEventListener("click", () => {
      productSearchInput.value = "";
      loadProducts();
    });
  }

  // Consulta de clientes
  if (searchClientBtn) {
    searchClientBtn.addEventListener("click", searchClients);
  }

  function searchClients() {
    const searchType = document.querySelector(
      'input[name="client-search-type"]:checked'
    ).value;
    const searchTerm = clientSearchInput.value.toLowerCase();

    let filteredClients = [];

    if (searchType === "all") {
      filteredClients = clients.filter((client) =>
        Object.values(client).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    } else if (searchType === "name") {
      filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm)
      );
    } else if (searchType === "cpf") {
      filteredClients = clients.filter(
        (client) => client.cpf && client.cpf.toLowerCase().includes(searchTerm)
      );
    } else if (searchType === "cnpj") {
      filteredClients = clients.filter(
        (client) =>
          client.cnpj && client.cnpj.toLowerCase().includes(searchTerm)
      );
    }

    loadClients(filteredClients);
  }

  // Limpar busca de clientes
  if (clearClientSearch) {
    clearClientSearch.addEventListener("click", () => {
      clientSearchInput.value = "";
      loadClients();
    });
  }

  // =================================================================
  // Funções de Usuário
  // =================================================================

  if (toggleUserFormBtn) {
    toggleUserFormBtn.addEventListener('click', () => {
        userFormContainer.classList.toggle('hidden');
    });
  }

  async function loadRolesForRegistration() {
    try {
        const response = await fetch(`${API_URL}/roles`, {
            headers: { 'x-auth-token': token }
        });
        if (!response.ok) {
            throw new Error('Falha ao carregar funções.');
        }
        const roles = await response.json();
        const userRoleSelect = document.getElementById('user-role');
        userRoleSelect.innerHTML = '<option value="">Selecione uma função</option>';
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.nome;
            userRoleSelect.appendChild(option);
        });
    } catch (error) {
        showNotification(error.message, 'error');
    }
  }

  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            nome: document.getElementById('user-nome').value,
            sobrenome: document.getElementById('user-sobrenome').value,
            email: document.getElementById('user-email').value,
            cpf: document.getElementById('user-cpf').value,
            senha: document.getElementById('user-password').value,
            role_id: document.getElementById('user-role').value,
        };

        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Falha ao criar usuário.');
            }

            showNotification('Usuário criado com sucesso!', 'success');
            userForm.reset();
            userFormContainer.classList.add('hidden');
            loadUsersTable();

        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
  }


  // Consulta de usuários
  if (searchUserBtn) {
    searchUserBtn.addEventListener("click", searchUsers);
  }
  if (clearUserSearch) {
    clearUserSearch.addEventListener("click", () => {
      userSearchInput.value = "";
      loadUsersTable();
    });
  }

  async function searchUsers() {
    const searchTerm = userSearchInput.value.toLowerCase();
    try {
      const response = await fetch(`${API_URL}/users?search=${searchTerm}`, {
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao buscar usuários.');
      }
      const usersFromDB = await response.json();
      renderUsersTable(usersFromDB);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }

  // Carregar usuários na tabela
  async function loadUsersTable() {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'x-auth-token': token },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao carregar usuários.');
      }

      const usersFromDB = await response.json();
      renderUsersTable(usersFromDB);

    } catch (error) {
      showNotification(error.message, 'error');
    }
  }

  function renderUsersTable(usersToLoad) {
    if (usersTableBody) {
      usersTableBody.innerHTML = "";

      if (usersToLoad.length === 0) {
        usersTableBody.innerHTML =
          '<tr><td colspan="5" style="text-align: center;">Nenhum usuário encontrado</td></tr>';
        return;
      }

      usersToLoad.forEach((user) => {
        const row = document.createElement("tr");
        const roleText = user.role_name || 'N/A';
        const registrationDate = new Date(user.data_cadastro).toLocaleDateString('pt-BR');

        row.innerHTML = `
                        <td>${user.nome} ${user.sobrenome}</td>
                        <td>${user.email}</td>
                        <td>${roleText}</td>
                        <td>${registrationDate}</td>
                        <td class="actions-cell">
                            <a href="#" class="action-icon" onclick="editUser('${user.uuid}')" title="Editar Permissão"><i class="bi bi-pencil-fill"></i></a>
                            <a href="#" class="action-icon" onclick="deleteUser('${user.uuid}')" title="Excluir"><i class="bi bi-trash-fill"></i></a>
                        </td>
                    `;
        usersTableBody.appendChild(row);
      });
    }
  }


  function getRoleText(role) {
    switch (role) {
      case "admin":
        return "Administrador";
      case "seller":
        return "Vendedor";
      case "stockist":
        return "Estoquista";
      default:
        return role;
    }
  }

  // Verificar se há e-mail salvo
  window.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      document.getElementById("login-email").value = savedEmail;
      document.getElementById("remember-password").checked = true;
    }

    if (editUserRoleModal) {
      editUserRoleModalCloseBtn.addEventListener("click", () => {
        editUserRoleModal.classList.add("hidden");
      });

      editUserRoleModalCancelBtn.addEventListener("click", () => {
        editUserRoleModal.classList.add("hidden");
      });

      editUserRoleModalConfirmBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`${API_URL}/users/${editingUserUuid}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ roleId: editUserRoleModalSelect.value })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao atualizar permissão.');
            }

            showNotification("Permissão de usuário atualizada com sucesso!", "success");
            loadUsersTable();
            editUserRoleModal.classList.add("hidden");

        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
    }

    // Adicionar um ingrediente inicial
    if (addIngredientRow) {
      addIngredientRow();
    }

    // Inicializar campos de cliente
    if (toggleClientFields) {
      toggleClientFields();
    }

    // Configurar datas padrão para os relatórios (últimos 30 dias)
    if (salesStartDate) {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setDate(today.getDate() - 30);

      salesStartDate.value = lastMonth.toISOString().split("T")[0];
      salesEndDate.value = today.toISOString().split("T")[0];

      productionStartDate.value = lastMonth.toISOString().split("T")[0];
      productionEndDate.value = today.toISOString().split("T")[0];

      clientSalesStartDate.value = lastMonth.toISOString().split("T")[0];
      clientSalesEndDate.value = today.toISOString().split("T")[0];
    }

    // Carregar dados iniciais se estiver no dashboard
    if (dashboardContainer) {
      loadProducts();
      updateFinishedProductSelect();
      loadProductionHistory();
      loadStockMovements();
      loadClients();
      loadUsersTable();
      loadSaleClientSelect();
      updateProductionProductSelect();
      updateClientSalesClientSelect();
      updateOverviewCards();
    }

    // Aplicar máscaras
    const userCpfInput = document.getElementById('user-cpf');
    if (userCpfInput) {
        IMask(userCpfInput, { mask: '000.000.000-00' });
    }
    const clientCpfInput = document.getElementById('client-cpf');
    if (clientCpfInput) {
        IMask(clientCpfInput, { mask: '000.000.000-00' });
    }
    const clientCnpjInput = document.getElementById('client-cnpj');
    if (clientCnpjInput) {
        IMask(clientCnpjInput, { mask: '00.000.000/0000-00' });
    }

    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      // Add a small delay to perceive the animation
      setTimeout(() => {
        loadingOverlay.classList.add("hidden");
        if (dashboardContainer) {
          dashboardContainer.classList.remove("hidden");
        }
      }, 500);
    }
  });

  // =================================================================
  // Funções de Notificação e Modal
  // =================================================================

  /**
   * Exibe uma notificação na tela.
   * @param {string} message A mensagem a ser exibida.
   * @param {string} type O tipo de notificação (success, error, info).
   */
  function showNotification(message, type = "success") {
    const container = document.getElementById("notification-container");
    if (!container) return;

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    const icon =
      type === "success"
        ? "check-circle-fill"
        : type === "error"
        ? "x-circle-fill"
        : "info-circle-fill";

    notification.innerHTML = `
        <i class="bi bi-${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(notification);

    // Remove a notificação após a animação de fade-out
    setTimeout(() => {
      notification.remove();
    }, 5000); // 5 segundos (4.5s de espera + 0.5s de animação)
  }

  /**
   * Exibe um modal de confirmação.
   * @param {string} itemName O nome do item a ser confirmado.
   * @param {function} onConfirm A função a ser executada se o usuário confirmar.
   */
  function showConfirmationModal(itemName, onConfirm) {
    const modal = document.getElementById("confirmation-modal");
    const modalItemName = document.getElementById("modal-item-name");
    const confirmBtn = document.getElementById("modal-confirm-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const closeBtn = document.getElementById("modal-close-btn");

    if (!modal || !modalItemName || !confirmBtn || !cancelBtn || !closeBtn)
      return;

    modalItemName.textContent = itemName;
    modal.classList.remove("hidden");

    // Clona o botão de confirmação para remover listeners antigos
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    const closeModal = () => modal.classList.add("hidden");

    newConfirmBtn.onclick = () => {
      onConfirm();
      closeModal();
    };

    cancelBtn.onclick = closeModal;
    closeBtn.onclick = closeModal;
  }

  // =================================================================
  // Funções da Visão Geral
  // =================================================================

  async function updateUsersSummary() {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) {
        console.error('Falha ao carregar o total de usuários.');
        totalUsersSummary.textContent = 'N/A';
        return;
      }
      const usersFromDB = await response.json();
      totalUsersSummary.textContent = usersFromDB.length;
    } catch (error) {
      console.error('Erro ao buscar total de usuários:', error);
      totalUsersSummary.textContent = 'N/A';
    }
  }


  function updateOverviewCards() {
    // Total de Produtos
    totalProductsSummary.textContent = products.length;

    // Total de Clientes
    totalClientsSummary.textContent = clients.length;

    // Total de Usuários
    updateUsersSummary();

    // Total de Vendas
    const totalSalesValue = sales.reduce((acc, sale) => acc + sale.total, 0);
    totalSalesSummary.textContent = `R$ ${totalSalesValue.toFixed(2)}`;
  }

  function renderStockStatusChart() {
    const ctx = document.getElementById("stockStatusChart").getContext("2d");

    const stockStatusData = {
      normal: 0,
      baixo: 0,
      esgotado: 0,
    };

    products.forEach((p) => {
      if (p.stock <= 0) {
        stockStatusData.esgotado++;
      } else if (p.stock <= p.minStock) {
        stockStatusData.baixo++;
      } else {
        stockStatusData.normal++;
      }
    });

    if (stockStatusChart) {
      stockStatusChart.destroy();
    }

    stockStatusChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Normal", "Baixo", "Esgotado"],
        datasets: [
          {
            label: "Status do Estoque",
            data: [
              stockStatusData.normal,
              stockStatusData.baixo,
              stockStatusData.esgotado,
            ],
            backgroundColor: [
              "rgba(52, 152, 219, 0.8)", // Azul
              "rgba(243, 156, 18, 0.8)", // Amarelo
              "rgba(231, 76, 60, 0.8)", // Vermelho
            ],
            borderColor: ["#3498db", "#f39c12", "#e74c3c"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }

  function renderSalesChart() {
    const canvas = document.getElementById("salesChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Agrega vendas por mês do ano atual
    const now = new Date();
    const year = now.getFullYear();
    const labels = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const totals = new Array(12).fill(0);

    sales.forEach((sale) => {
      const d = new Date(sale.date);
      if (!isNaN(d) && d.getFullYear() === year) {
        totals[d.getMonth()] += sale.total || 0;
      }
    });

    // Destroi o gráfico anterior se existir (evita erro ao trocar de seção)
    if (salesChartInstance) {
      salesChartInstance.destroy();
    }

    salesChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: `Vendas ${year}`,
            data: totals,
            // cores padrões do Chart.js já dão conta, não precisa definir
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top" } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  // Funções globais para editar e excluir
  window.editProduct = function (id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    document.getElementById("product-barcode").value = product.barcode;
    document.getElementById("product-description").value = product.description;
    document.getElementById("product-cost").value = product.cost;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-stock").value = product.stock;
    document.getElementById("product-min-stock").value = product.minStock;
    productUnitSelect.value = product.unit;

    // Carregar imagem se existir
    if (product.image) {
      productImagePreview.src = product.image;
      productImagePreview.style.display = "block";
      removeImageBtn.style.display = "inline-block";
    } else {
      productImagePreview.style.display = "none";
      removeImageBtn.style.display = "none";
    }

    // Selecionar o tipo de produto correto
    document.querySelector(`#product-type-${product.type}`).checked = true;

    // Remover produto da lista para evitar duplicação
    products = products.filter((p) => p.id !== id);
    saveProducts();
    loadProducts();
  };

  window.deleteProduct = function (id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    showConfirmationModal(`Excluir Produto: "${product.description}"`, () => {
      products = products.filter((p) => p.id !== id);
      saveProducts();
      loadProducts();
      updateFinishedProductSelect();
      updateProductionProductSelect();
      showNotification("Produto excluído com sucesso!", "success");
    });
  };

  window.adjustStock = function (id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newStock = prompt(
      `Ajustar estoque de ${product.description} (Atual: ${product.stock}):`,
      product.stock
    );

    if (newStock !== null && !isNaN(parseFloat(newStock))) {
      const oldStock = product.stock;
      product.stock = parseFloat(newStock);

      // Registrar movimentação de ajuste
      const reason = "Ajuste manual";
      if (product.stock > oldStock) {
        addStockMovement(
          product.id,
          "ENTRADA",
          product.stock - oldStock,
          reason
        );
      } else if (product.stock < oldStock) {
        addStockMovement(product.id, "SAÍDA", oldStock - product.stock, reason);
      }

      saveProducts();
      saveStockMovements();
      loadProducts();
      loadStockTable();
      loadStockMovements();

      showNotification("Estoque ajustado com sucesso!", "success");
    }
  };

  window.editClient = function (id) {
    const client = clients.find((c) => c.id === id);
    if (!client) return;

    document.getElementById("client-name").value = client.name;
    document.getElementById("client-email").value = client.email;
    document.getElementById("client-phone").value = client.phone;
    document.getElementById("client-whatsapp").value = client.whatsapp;
    document.getElementById("client-address").value = client.address;

    // Selecionar o tipo de cliente correto
    document.querySelector(`#client-type-${client.type}`).checked = true;
    toggleClientFields();

    // Preencher campos específicos do tipo
    if (client.type === "physical") {
      document.getElementById("client-cpf").value = client.cpf;
    } else {
      document.getElementById("client-cnpj").value = client.cnpj;
      document.getElementById("client-company-name").value = client.companyName;
    }

    // Remover cliente da lista para evitar duplicação
    clients = clients.filter((c) => c.id !== id);
    saveClients();
    loadClients();
  };

  window.deleteClient = function (id) {
    const client = clients.find((c) => c.id === id);
    if (!client) return;

    showConfirmationModal(`Excluir Cliente: "${client.name}"`, () => {
      clients = clients.filter((c) => c.id !== id);
      saveClients();
      loadClients();
      showNotification("Cliente excluído com sucesso!", "success");
    });
  };

  async function loadRolesForEditModal() {
    try {
        const response = await fetch(`${API_URL}/roles`, {
            headers: { 'x-auth-token': token }
        });
        if (!response.ok) {
            throw new Error('Falha ao carregar funções para edição.');
        }
        const roles = await response.json();
        const editUserRoleSelect = document.getElementById('edit-user-role-select');
        editUserRoleSelect.innerHTML = ''; // Limpa opções existentes
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.nome;
            editUserRoleSelect.appendChild(option);
        });
    } catch (error) {
        showNotification(error.message, 'error');
    }
  }

  window.editUser = async function (uuid) {
    try {
        await loadRolesForEditModal(); // Carrega as funções no modal primeiro

        const response = await fetch(`${API_URL}/users/${uuid}`, {
            headers: { 'x-auth-token': token }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao carregar usuário.');
        }
        const user = await response.json();
        
        editingUserUuid = uuid;
        editUserRoleModalUserName.textContent = user.nome;
        editUserRoleModalSelect.value = user.role_id;
        editUserRoleModal.classList.remove("hidden");

    } catch (error) {
        showNotification(error.message, 'error');
    }
  };

  window.deleteUser = function (uuid) {
    showConfirmationModal(`Excluir Usuário`, async () => {
        try {
            const response = await fetch(`${API_URL}/users/${uuid}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao excluir usuário.');
            }

            showNotification("Usuário excluído com sucesso!", "success");
            loadUsersTable();

        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
  };
});