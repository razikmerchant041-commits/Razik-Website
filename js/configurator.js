/**
 * Shahji Printers - Single-Page Instant Order Configurator Engine
 * Displays all product options on one single page, calculates live estimated prices in real time,
 * handles instant WhatsApp order & direct web order submission.
 * Supports custom size unit selection (in, mm, cm, ft) and automatic product-to-paper/GSM option filtering.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    product: 'Packaging Boxes',
    sheetSize: 'A4',
    customUnit: 'in', // 'in', 'mm', 'cm', 'ft'
    rawWidth: 8.27,
    rawHeight: 11.69,
    customWidth: 8.27, // converted to inches for machine checks & rate calculation
    customHeight: 11.69,
    sizeValid: true,
    paperType: 'Duplex Board',
    gsm: '300',
    colors: '4 Colour CMYK',
    lamination: 'Thermal Gloss Lamination',
    uv: 'No UV',
    cutting: 'Straight Cutting',
    isPackaging: true,
    boxLength: 6,
    boxWidth: 4,
    boxHeight: 2,
    boxStyle: 'Straight Tuck',
    quantity: '1000',
    customQuantity: 1000,
    printSide: 'Single Side',
    designStatus: 'already_have',
    designBrief: '',
    uploadedFileName: '',
    uploadedFileSize: '',
    deliveryMethod: 'Courier Dispatch',
    deliveryDate: '',
    isUrgent: 'No',
    instructions: '',
    customerName: '',
    companyName: '',
    phone: '',
    email: '',
    estimatedPrice: 2850,
    orderNumber: ''
  };

  // Unit Conversion Helper Functions
  function convertToInches(val, unit) {
    const num = parseFloat(val) || 0;
    switch (unit) {
      case 'mm': return num / 25.4;
      case 'cm': return num / 2.54;
      case 'ft': return num * 12;
      case 'in':
      default: return num;
    }
  }

  function convertFromInches(inches, toUnit) {
    const num = parseFloat(inches) || 0;
    switch (toUnit) {
      case 'mm': return Math.round(num * 25.4);
      case 'cm': return parseFloat((num * 2.54).toFixed(2));
      case 'ft': return parseFloat((num / 12).toFixed(2));
      case 'in':
      default: return parseFloat(num.toFixed(2));
    }
  }

  // Data Definitions - Paper Stocks
  const PAPER_DATA = {
    'Art Paper': {
      name: 'Art Paper (Smooth Coated)',
      desc: 'Smooth coated paper suitable for brochures, flyers, posters, and booklets.',
      defaultGsms: ['90', '100', '130', '150', '170', '220']
    },
    'Art Card': {
      name: 'Art Card (Thick Board)',
      desc: 'Thick glossy/matte cardstock for premium business cards, covers & packaging.',
      defaultGsms: ['250', '300', '350']
    },
    'Maplitho': {
      name: 'Maplitho (Writing Paper)',
      desc: 'Uncoated writing paper used for letterheads, bill books & office stationery.',
      defaultGsms: ['70', '80', '90', '100']
    },
    'Ivory Board': {
      name: 'Ivory Board (Pharma & Cosmetic)',
      desc: 'Smooth rigid white board used for pharma and cosmetic packaging.',
      defaultGsms: ['230', '250', '300', '350']
    },
    'Duplex Board': {
      name: 'Duplex Board (Packaging Back)',
      desc: 'Heavy grey-back or white-back board for mono cartons and product boxes.',
      defaultGsms: ['250', '300', '350', '400']
    },
    'Kraft Paper': {
      name: 'Kraft Paper (Brown Eco)',
      desc: 'Eco-friendly sturdy brown paper for retail bags and boxes.',
      defaultGsms: ['120', '180', '250', '300']
    },
    'Sunshine Sticker': {
      name: 'Sunshine Sticker (High Gloss)',
      desc: 'Ultra-bright high gloss sunshine adhesive paper for vibrant product branding.',
      defaultGsms: ['80', '90', '100']
    },
    'PVC Sticker': {
      name: 'PVC Sticker (Durable Plastic)',
      desc: 'Heavy-duty synthetic PVC waterproof sticker, scratch-proof & oil-resistant.',
      defaultGsms: ['100', '120', '150', '200']
    },
    'HM Sticker': {
      name: 'HM Sticker (High Density Poly)',
      desc: 'High-density polyethylene sticker, flexible & tear-resistant for bottles & chemical containers.',
      defaultGsms: ['80', '100', '120']
    },
    'Avery / Every Sticker': {
      name: 'Avery / Every Sticker (Premium Chrome)',
      desc: 'Top-grade imported Avery Dennison self-adhesive stock with high tack adhesive.',
      defaultGsms: ['80', '100', '120', '150']
    },
    'Vinyl Sticker': {
      name: 'Vinyl Sticker (Waterproof)',
      desc: 'Waterproof outdoor scratch-resistant vinyl label.',
      defaultGsms: ['100', '120', '150']
    },
    'Paper Sticker': {
      name: 'Paper Sticker (Indoor)',
      desc: 'Economical self-adhesive paper label for general indoor packaging.',
      defaultGsms: ['80', '90', '100']
    },
    'Mirror Coat Sticker': {
      name: 'Mirror Coat Sticker (Super Gloss)',
      desc: 'Mirror finish cast coated sticker paper with crystal clear sheen.',
      defaultGsms: ['80', '90', '100']
    }
  };

  // Product Rules mapping allowed Paper Stocks & GSMs
  const PRODUCT_PAPER_RULES = {
    'Packaging Boxes': {
      allowedPapers: ['Duplex Board', 'Ivory Board', 'Kraft Paper', 'Art Card'],
      defaultPaper: 'Duplex Board',
      allowedGsms: ['250', '300', '350', '400'],
      defaultGsm: '300'
    },
    'Mono Cartons': {
      allowedPapers: ['Ivory Board', 'Duplex Board', 'Art Card'],
      defaultPaper: 'Ivory Board',
      allowedGsms: ['250', '300', '350', '400'],
      defaultGsm: '300'
    },
    'Business Cards': {
      allowedPapers: ['Art Card', 'Ivory Board'],
      defaultPaper: 'Art Card',
      allowedGsms: ['250', '300', '350'],
      defaultGsm: '350'
    },
    'Brochures': {
      allowedPapers: ['Art Paper', 'Art Card', 'Maplitho'],
      defaultPaper: 'Art Paper',
      allowedGsms: ['130', '150', '170', '220', '250', '300'],
      defaultGsm: '170'
    },
    'Flyers': {
      allowedPapers: ['Art Paper', 'Maplitho'],
      defaultPaper: 'Art Paper',
      allowedGsms: ['90', '100', '130', '150', '170'],
      defaultGsm: '130'
    },
    'Stickers': {
      allowedPapers: [
        'Sunshine Sticker',
        'PVC Sticker',
        'HM Sticker',
        'Avery / Every Sticker',
        'Paper Sticker',
        'Vinyl Sticker',
        'Mirror Coat Sticker'
      ],
      defaultPaper: 'Sunshine Sticker',
      allowedGsms: ['80', '90', '100', '120', '150', '200'],
      defaultGsm: '90'
    },
    'Letterheads': {
      allowedPapers: ['Maplitho', 'Art Paper'],
      defaultPaper: 'Maplitho',
      allowedGsms: ['70', '80', '90', '100'],
      defaultGsm: '90'
    },
    'Paper Bags': {
      allowedPapers: ['Kraft Paper', 'Art Paper', 'Art Card', 'Duplex Board'],
      defaultPaper: 'Kraft Paper',
      allowedGsms: ['120', '180', '250', '300'],
      defaultGsm: '180'
    },
    'Custom Job Work': {
      allowedPapers: Object.keys(PAPER_DATA),
      defaultPaper: 'Art Paper',
      allowedGsms: ['70', '80', '90', '100', '120', '130', '150', '170', '180', '220', '250', '300', '350', '400'],
      defaultGsm: '170'
    },
    'Custom Printing': {
      allowedPapers: Object.keys(PAPER_DATA),
      defaultPaper: 'Art Paper',
      allowedGsms: ['70', '80', '90', '100', '120', '130', '150', '170', '180', '220', '250', '300', '350', '400'],
      defaultGsm: '170'
    }
  };

  const SIZE_LIMITS = {
    maxWidth: 20,
    maxHeight: 28,
    maxArea: 560
  };

  const SIZE_DIMENSIONS = {
    'A6': { w: 4.13, h: 5.83 },
    'A5': { w: 5.83, h: 8.27 },
    'A4': { w: 8.27, h: 11.69 },
    'A3': { w: 11.69, h: 16.54 },
    '12×18': { w: 12, h: 18 },
    '15×20': { w: 15, h: 20 },
    '17×25': { w: 17, h: 25 },
    '18×23': { w: 18, h: 23 },
    '18×25': { w: 18, h: 25 },
    '19×25': { w: 19, h: 25 },
    '20×28': { w: 20, h: 28 }
  };

  const BASE_RATES = {
    'Packaging Boxes': 2.8,
    'Mono Cartons': 2.2,
    'Business Cards': 0.8,
    'Brochures': 3.5,
    'Flyers': 1.2,
    'Stickers': 1.5,
    'Letterheads': 1.1,
    'Paper Bags': 6.5,
    'Custom Job Work': 2.5,
    'Custom Printing': 2.5
  };

  // Initialize Configurator DOM
  function initConfigurator() {
    if (!document.getElementById('printConfiguratorApp')) return;

    setupEventListeners();
    updateProductPaperAndGsmOptions(true);
    validateSheetSize();
    calculateLiveEstimate();
    populateOrderSummary();
  }

  // Filter paper options and GSMs dynamically based on selected product
  function updateProductPaperAndGsmOptions(forceProductChange = false) {
    const paperSelect = document.getElementById('paperTypeSelect');
    const gsmSelect = document.getElementById('gsmSelect');
    const descBox = document.getElementById('paperDescBox');
    if (!paperSelect || !gsmSelect) return;

    const rule = PRODUCT_PAPER_RULES[state.product] || PRODUCT_PAPER_RULES['Custom Job Work'];
    const allowedPapers = rule.allowedPapers;

    // Build paper select options
    paperSelect.innerHTML = allowedPapers.map(pKey => {
      const pObj = PAPER_DATA[pKey] || { name: pKey };
      return `<option value="${pKey}">${pObj.name}</option>`;
    }).join('');

    // If current paper is not allowed for this product, reset to default paper
    if (forceProductChange || !allowedPapers.includes(state.paperType)) {
      state.paperType = rule.defaultPaper;
    }
    paperSelect.value = state.paperType;

    updatePaperGsmOptionsOnly(forceProductChange);
  }

  // Filter GSM options based on selected Paper Stock
  function updatePaperGsmOptionsOnly(forceDefaultGsm = false) {
    const gsmSelect = document.getElementById('gsmSelect');
    const descBox = document.getElementById('paperDescBox');
    if (!gsmSelect) return;

    const rule = PRODUCT_PAPER_RULES[state.product] || PRODUCT_PAPER_RULES['Custom Job Work'];
    const paperObj = PAPER_DATA[state.paperType] || PAPER_DATA['Art Paper'];

    let validGsms = rule.allowedGsms;
    if (paperObj.defaultGsms && paperObj.defaultGsms.length) {
      const intersected = rule.allowedGsms.filter(g => paperObj.defaultGsms.includes(g));
      if (intersected.length > 0) {
        validGsms = intersected;
      }
    }

    gsmSelect.innerHTML = validGsms.map(g => `<option value="${g}">${g} GSM</option>`).join('');

    if (forceDefaultGsm || !validGsms.includes(state.gsm)) {
      state.gsm = validGsms.includes(rule.defaultGsm) ? rule.defaultGsm : validGsms[0];
    }
    gsmSelect.value = state.gsm;

    if (descBox) {
      descBox.innerHTML = `<i class="fas fa-info-circle"></i> ${paperObj.desc || ''}`;
    }
  }

  // Event Listeners Setup
  function setupEventListeners() {
    // Product Selection
    document.querySelectorAll('.js-product-select').forEach(card => {
      card.addEventListener('click', function () {
        document.querySelectorAll('.js-product-select').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        state.product = this.dataset.product;

        const isPkg = (state.product === 'Packaging Boxes' || state.product === 'Mono Cartons');
        state.isPackaging = isPkg;
        const pkgSec = document.getElementById('packagingOptionsSection');
        if (pkgSec) pkgSec.style.display = isPkg ? 'block' : 'none';

        // Auto-filter Paper Stocks and GSMs for selected product
        updateProductPaperAndGsmOptions(true);
        calculateLiveEstimate();
        populateOrderSummary();
      });
    });

    // Sheet Size Selection
    document.querySelectorAll('.js-size-select').forEach(card => {
      card.addEventListener('click', function () {
        document.querySelectorAll('.js-size-select').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        state.sheetSize = this.dataset.size;

        const customInputs = document.getElementById('customSizeInputs');
        if (state.sheetSize === 'Custom Size') {
          if (customInputs) customInputs.style.display = 'flex';
        } else {
          if (customInputs) customInputs.style.display = 'none';
          const dim = SIZE_DIMENSIONS[state.sheetSize];
          if (dim) {
            state.customUnit = 'in';
            state.rawWidth = dim.w;
            state.rawHeight = dim.h;
            state.customWidth = dim.w;
            state.customHeight = dim.h;
            const unitSelect = document.getElementById('customUnitSelect');
            if (unitSelect) unitSelect.value = 'in';
            updateCustomSizeLabels();
          }
        }
        validateSheetSize();
        calculateLiveEstimate();
        populateOrderSummary();
      });
    });

    // Custom Size Inputs & Measurement Unit Selector
    const unitSelect = document.getElementById('customUnitSelect');
    const wInput = document.getElementById('customWidthInput');
    const hInput = document.getElementById('customHeightInput');

    if (unitSelect) {
      unitSelect.addEventListener('change', function () {
        const oldUnit = state.customUnit;
        const newUnit = this.value;
        state.customUnit = newUnit;

        // Convert current raw values to new unit
        const currentInchesW = convertToInches(state.rawWidth, oldUnit);
        const currentInchesH = convertToInches(state.rawHeight, oldUnit);

        state.rawWidth = convertFromInches(currentInchesW, newUnit);
        state.rawHeight = convertFromInches(currentInchesH, newUnit);

        if (wInput) wInput.value = state.rawWidth;
        if (hInput) hInput.value = state.rawHeight;

        updateCustomSizeLabels();
        updateCustomSizeFromInputs();
      });
    }

    if (wInput && hInput) {
      wInput.addEventListener('input', updateCustomSizeFromInputs);
      hInput.addEventListener('input', updateCustomSizeFromInputs);
    }

    // Paper Select
    const paperSelect = document.getElementById('paperTypeSelect');
    if (paperSelect) {
      paperSelect.addEventListener('change', function () {
        state.paperType = this.value;
        updatePaperGsmOptionsOnly(false);
        calculateLiveEstimate();
        populateOrderSummary();
      });
    }

    // GSM Select
    const gsmSelect = document.getElementById('gsmSelect');
    if (gsmSelect) {
      gsmSelect.addEventListener('change', function () {
        state.gsm = this.value;
        calculateLiveEstimate();
        populateOrderSummary();
      });
    }

    // Colors, Lamination & UV Selects
    const colorsSelect = document.getElementById('colorsSelect');
    if (colorsSelect) {
      colorsSelect.addEventListener('change', function () {
        state.colors = this.value;
        calculateLiveEstimate();
        populateOrderSummary();
      });
    }

    const laminationSelect = document.getElementById('laminationSelect');
    if (laminationSelect) {
      laminationSelect.addEventListener('change', function () {
        state.lamination = this.value;
        calculateLiveEstimate();
        populateOrderSummary();
      });
    }

    const uvSelect = document.getElementById('uvSelect');
    if (uvSelect) {
      uvSelect.addEventListener('change', function () {
        state.uv = this.value;
        calculateLiveEstimate();
        populateOrderSummary();
      });
    }

    // Quantity Selection
    document.querySelectorAll('.js-qty-select').forEach(card => {
      card.addEventListener('click', function () {
        document.querySelectorAll('.js-qty-select').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        state.quantity = this.dataset.qty;
        const customQtyInput = document.getElementById('customQtyInput');
        if (state.quantity === 'Custom Quantity') {
          if (customQtyInput) customQtyInput.style.display = 'block';
        } else {
          if (customQtyInput) customQtyInput.style.display = 'none';
        }
        calculateLiveEstimate();
        populateOrderSummary();
      });
    });

    const customQtyInput = document.getElementById('customQtyInput');
    if (customQtyInput) {
      customQtyInput.addEventListener('input', function () {
        state.customQuantity = parseInt(this.value) || 1000;
        calculateLiveEstimate();
        populateOrderSummary();
      });
    }

    // Print Side Selection (Single Side, Front & Back, Front + Back)
    document.querySelectorAll('.js-side-select').forEach(card => {
      card.addEventListener('click', function () {
        document.querySelectorAll('.js-side-select').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        state.printSide = this.dataset.side;
        calculateLiveEstimate();
        populateOrderSummary();
      });
    });

    // File Upload
    const fileInput = document.getElementById('artworkFileInput');
    const dropzone = document.getElementById('fileDropzone');
    if (fileInput && dropzone) {
      dropzone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', function () {
        if (this.files.length) {
          handleFile(this.files[0]);
        }
      });
    }

    // Design Radio
    document.querySelectorAll('input[name="designStatus"]').forEach(radio => {
      radio.addEventListener('change', function () {
        state.designStatus = this.value;
        populateOrderSummary();
      });
    });

    // Customer Input Changes
    ['custNameInput', 'custPhoneInput', 'custEmailInput', 'custCompanyInput', 'deliveryMethodSelect', 'urgentJobCheckbox'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', populateOrderSummary);
        el.addEventListener('change', populateOrderSummary);
      }
    });

    // Order Action Buttons
    const submitBtn = document.getElementById('configSubmitBtn');
    const whatsappBtn = document.getElementById('configWhatsappBtn');

    if (submitBtn) submitBtn.addEventListener('click', handleOrderSubmission);
    if (whatsappBtn) whatsappBtn.addEventListener('click', handleWhatsAppOrder);
  }

  // Update input labels & step based on measurement unit
  function updateCustomSizeLabels() {
    const wLabel = document.getElementById('customWidthLabel');
    const hLabel = document.getElementById('customHeightLabel');
    const wInput = document.getElementById('customWidthInput');
    const hInput = document.getElementById('customHeightInput');

    const unit = state.customUnit;
    if (wLabel) wLabel.textContent = `Width (${unit}):`;
    if (hLabel) hLabel.textContent = `Height (${unit}):`;

    if (wInput && hInput) {
      if (unit === 'mm') {
        wInput.step = '1';
        hInput.step = '1';
      } else if (unit === 'ft') {
        wInput.step = '0.01';
        hInput.step = '0.01';
      } else {
        wInput.step = '0.1';
        hInput.step = '0.1';
      }
    }
  }

  // Recalculate custom dimensions from inputs
  function updateCustomSizeFromInputs() {
    const wInput = document.getElementById('customWidthInput');
    const hInput = document.getElementById('customHeightInput');

    state.rawWidth = parseFloat(wInput?.value) || 0;
    state.rawHeight = parseFloat(hInput?.value) || 0;

    state.customWidth = convertToInches(state.rawWidth, state.customUnit);
    state.customHeight = convertToInches(state.rawHeight, state.customUnit);

    validateSheetSize();
    calculateLiveEstimate();
    populateOrderSummary();
  }

  // Format Size summary text nicely
  function formatSizeSummary() {
    if (state.sheetSize !== 'Custom Size') {
      return state.sheetSize;
    }
    const unit = state.customUnit;
    if (unit === 'in') {
      return `Custom (${state.rawWidth}" × ${state.rawHeight}")`;
    }
    return `Custom (${state.rawWidth} ${unit} × ${state.rawHeight} ${unit} / ${state.customWidth.toFixed(2)}" × ${state.customHeight.toFixed(2)}")`;
  }

  // Handle Uploaded File
  function handleFile(file) {
    state.uploadedFileName = file.name;
    state.uploadedFileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    const infoChip = document.getElementById('fileInfoChip');
    if (infoChip) {
      infoChip.innerHTML = `<i class="fas fa-file-alt" style="color: var(--accent-orange);"></i> <strong>${state.uploadedFileName}</strong>`;
      infoChip.style.display = 'inline-flex';
    }
    populateOrderSummary();
  }

  // Validate Machine Limits
  function validateSheetSize() {
    let w = state.customWidth;
    let h = state.customHeight;
    const alertBox = document.getElementById('machineLimitAlert');
    const submitBtn = document.getElementById('configSubmitBtn');
    const whatsappBtn = document.getElementById('configWhatsappBtn');

    const minDim = Math.min(w, h);
    const maxDim = Math.max(w, h);

    if (minDim > SIZE_LIMITS.maxWidth || maxDim > SIZE_LIMITS.maxHeight) {
      state.sizeValid = false;
      if (alertBox) {
        alertBox.style.display = 'flex';
        alertBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Exceeds maximum offset press limit (Max 20 × 28 Inches / 508 × 711 mm).`;
      }
      if (submitBtn) submitBtn.disabled = true;
      if (whatsappBtn) whatsappBtn.style.pointerEvents = 'none';
    } else {
      state.sizeValid = true;
      if (alertBox) alertBox.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
      if (whatsappBtn) whatsappBtn.style.pointerEvents = 'auto';
    }
  }

  // Calculate Live Price Estimate
  function calculateLiveEstimate() {
    const qty = (state.quantity === 'Custom Quantity') ? state.customQuantity : (parseInt(state.quantity) || 1000);
    const baseRate = BASE_RATES[state.product] || 2.5;

    let total = qty * baseRate;

    // Paper Stock Premium Factors
    if (state.paperType === 'PVC Sticker' || state.paperType === 'Avery / Every Sticker') total += qty * 0.5;
    else if (state.paperType === 'HM Sticker' || state.paperType === 'Vinyl Sticker') total += qty * 0.35;
    else if (state.paperType === 'Sunshine Sticker' || state.paperType === 'Mirror Coat Sticker') total += qty * 0.2;

    // Print Side Factor
    if (state.printSide === 'Front & Back') total += qty * 0.35;
    else if (state.printSide === 'Front + Back') total += qty * 0.5;

    if (state.lamination && state.lamination !== 'No Lamination') total += qty * 0.4;
    if (state.uv === '3D Spot UV') total += qty * 0.7;

    state.estimatedPrice = Math.round(total);

    const priceEl = document.getElementById('liveEstimatePrice');
    if (priceEl) {
      priceEl.textContent = `₹${state.estimatedPrice.toLocaleString('en-IN')}`;
    }
  }

  // Populate Order Summary
  function populateOrderSummary() {
    const summaryBox = document.getElementById('configOrderSummaryBox');
    if (!summaryBox) return;

    const finalQty = (state.quantity === 'Custom Quantity') ? (document.getElementById('customQtyInput')?.value || '1000') : state.quantity;
    const user = window.ShahjiAuth ? window.ShahjiAuth.getUser() : null;
    const name = user ? user.name : '';
    const formattedSize = formatSizeSummary();

    summaryBox.innerHTML = `
      <div class="summary-row"><span class="summary-label">Item:</span><span class="summary-value"><strong>${state.product}</strong></span></div>
      <div class="summary-row"><span class="summary-label">Size & Paper:</span><span class="summary-value">${formattedSize} | ${state.paperType} (${state.gsm} GSM)</span></div>
      <div class="summary-row"><span class="summary-label">Print Option:</span><span class="summary-value"><strong>${state.printSide}</strong></span></div>
      <div class="summary-row"><span class="summary-label">Finishes:</span><span class="summary-value">${state.colors} | ${state.lamination} | ${state.uv}</span></div>
      ${state.isPackaging ? `<div class="summary-row"><span class="summary-label">Box Specs:</span><span class="summary-value">${document.getElementById('boxLengthInput')?.value || 6}"L×${document.getElementById('boxWidthInput')?.value || 4}"W×${document.getElementById('boxHeightInput')?.value || 2}"H (${document.getElementById('boxStyleSelect')?.value || 'Straight Tuck'})</span></div>` : ''}
      <div class="summary-row"><span class="summary-label">Quantity:</span><span class="summary-value"><strong>${finalQty} Units</strong></span></div>
      <div class="summary-row"><span class="summary-label">Artwork:</span><span class="summary-value">${state.uploadedFileName ? state.uploadedFileName : (state.designStatus === 'need_design' ? 'Design Service Requested' : 'Ready Artwork')}</span></div>
      ${name ? `<div class="summary-row"><span class="summary-label">Account:</span><span class="summary-value">${name}</span></div>` : ''}
    `;
  }

  // Ensure User is Authenticated before placing order
  function ensureUserAuthenticated(onSuccess) {
    if (window.ShahjiAuth && window.ShahjiAuth.isLoggedIn()) {
      const user = window.ShahjiAuth.getUser();
      state.customerName = user.name;
      state.email = user.email;
      state.phone = user.phone;
      state.companyName = user.company || 'N/A';
      state.deliveryMethod = document.getElementById('deliveryMethodSelect')?.value || 'Courier Dispatch';
      state.isUrgent = document.getElementById('urgentJobCheckbox')?.checked ? 'Yes' : 'No';
      if (typeof onSuccess === 'function') onSuccess();
      return true;
    } else {
      if (window.ShahjiAuth) {
        window.ShahjiAuth.openModal(function (user) {
          state.customerName = user.name;
          state.email = user.email;
          state.phone = user.phone;
          state.companyName = user.company || 'N/A';
          state.deliveryMethod = document.getElementById('deliveryMethodSelect')?.value || 'Courier Dispatch';
          state.isUrgent = document.getElementById('urgentJobCheckbox')?.checked ? 'Yes' : 'No';
          if (typeof onSuccess === 'function') onSuccess();
        });
      }
      return false;
    }
  }

  // Instant WhatsApp Order Submission
  function handleWhatsAppOrder(e) {
    if (e) e.preventDefault();
    ensureUserAuthenticated(function () {
      executeWhatsAppOrder();
    });
  }

  function executeWhatsAppOrder() {
    const finalQty = (state.quantity === 'Custom Quantity') ? (document.getElementById('customQtyInput')?.value || '1000') : state.quantity;
    const formattedSize = formatSizeSummary();

    const msg = `*NEW PRINT ORDER - SHAHJI PRINTERS*%0A` +
      `------------------------------------%0A` +
      `👤 *Customer Account:* ${state.customerName}%0A` +
      `🏢 *Company:* ${state.companyName}%0A` +
      `📞 *Phone:* ${state.phone}%0A` +
      `✉️ *Email:* ${state.email}%0A` +
      `------------------------------------%0A` +
      `📦 *Product:* ${state.product}%0A` +
      `📏 *Size:* ${formattedSize}%0A` +
      `📄 *Paper:* ${state.paperType} (${state.gsm} GSM)%0A` +
      `📑 *Print Option:* ${state.printSide}%0A` +
      `🎨 *Colours/Finish:* ${state.colors} | ${state.lamination} | ${state.uv}%0A` +
      `🔢 *Quantity:* ${finalQty} Units%0A` +
      `💰 *Estimated Total:* ₹${state.estimatedPrice}%0A` +
      `------------------------------------%0A` +
      `Please confirm quote and delivery timeline.`;

    const waUrl = `https://wa.me/918140340410?text=${msg}`;
    window.open(waUrl, '_blank');
  }

  // Direct Order Submission Handler
  function handleOrderSubmission() {
    ensureUserAuthenticated(function () {
      executeDirectOrder();
    });
  }

  function executeDirectOrder() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderNum = `SJP-2026-${randomNum}`;
    state.orderNumber = orderNum;

    const finalQty = (state.quantity === 'Custom Quantity') ? (document.getElementById('customQtyInput')?.value || '1000') : state.quantity;
    const formattedSize = formatSizeSummary();

    const orderData = {
      orderNumber: orderNum,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'New',
      customerName: state.customerName,
      company: state.companyName,
      phone: state.phone,
      email: state.email,
      product: state.product,
      size: formattedSize,
      paper: state.paperType,
      gsm: state.gsm,
      printSide: state.printSide,
      colors: state.colors,
      lamination: state.lamination,
      uv: state.uv,
      quantity: finalQty,
      price: `₹${state.estimatedPrice}`,
      uploadedFile: state.uploadedFileName || 'None (Design Requested)',
      deliveryMethod: state.deliveryMethod,
      isUrgent: state.isUrgent
    };

    let existingOrders = JSON.parse(localStorage.getItem('shahji_orders_db') || '[]');
    existingOrders.unshift(orderData);
    localStorage.setItem('shahji_orders_db', JSON.stringify(existingOrders));

    const cardBody = document.getElementById('configuratorCardBody');
    if (cardBody) {
      cardBody.innerHTML = `
        <div style="text-align: center; padding: 24px 14px;">
          <div style="width: 56px; height: 56px; background: #dcfce7; color: #166534; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 10px auto;">
            <i class="fas fa-check"></i>
          </div>
          <h2 style="color: var(--primary-navy); font-size: 1.4rem; margin-bottom: 4px;">Order Placed Successfully!</h2>
          <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 16px;">Thank you, <strong>${state.customerName}</strong>. Your commercial order has been submitted.</p>
          
          <div style="background: #f8fafc; border: 2px dashed var(--accent-orange); border-radius: 8px; padding: 12px; max-width: 380px; margin: 0 auto 18px auto;">
            <span style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Order Reference Code</span>
            <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary-navy); letter-spacing: 1px; margin: 2px 0;">${orderNum}</div>
            <p style="font-size: 0.75rem; color: #64748b; margin: 0;">Estimated Total: <strong style="color: #166534;">₹${state.estimatedPrice.toLocaleString('en-IN')}</strong></p>
          </div>

          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <a href="https://wa.me/918140340410?text=Hi%20Shahji%20Printers,%20I%20placed%20Order%20${orderNum}" target="_blank" class="btn-whatsapp-order" style="padding: 6px 14px; font-size: 0.8rem; width: auto;"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>
            <a href="index.html" class="btn btn-orange" style="padding: 6px 14px; font-size: 0.8rem;"><i class="fas fa-home"></i> Return Home</a>
          </div>
        </div>
      `;
    }
  }

  // Initialize on Load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfigurator);
  } else {
    initConfigurator();
  }

})();
