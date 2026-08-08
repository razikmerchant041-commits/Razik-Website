/**
 * Shahji Printers - Admin Orders Dashboard Engine & Annual Performance Analytics
 */

(function () {
  'use strict';

  // Seed sample initial orders if none exist
  function seedSampleOrders() {
    let orders = JSON.parse(localStorage.getItem('shahji_orders_db') || '[]');
    if (orders.length === 0) {
      orders = [
        {
          orderNumber: 'SJP-2026-000125',
          date: '06 Aug 2026, 11:30 AM',
          status: 'New',
          customerName: 'Rajesh Sharma',
          company: 'Apex Healthcare Pvt Ltd',
          phone: '+91 98250 12345',
          email: 'rajesh@apexhealth.in',
          product: 'Mono Cartons',
          size: 'Custom Size (6" × 4")',
          paper: 'Duplex Board',
          gsm: '350',
          colors: '4 Colour CMYK',
          lamination: 'Thermal Gloss Lamination',
          uv: 'Spot UV',
          cutting: 'Die Cutting',
          quantity: '5000',
          price: '₹22,500',
          uploadedFile: 'Apex_Syrup_Box_Design.pdf (14.2 MB)',
          deliveryMethod: 'Courier',
          deliveryDate: '12 Aug 2026',
          isUrgent: 'Yes',
          instructions: 'Spot UV on brand logo front panel.'
        },
        {
          orderNumber: 'SJP-2026-000124',
          date: '05 Aug 2026, 04:15 PM',
          status: 'Printing',
          customerName: 'Priya Mehta',
          company: 'Urban Kraft Designs',
          phone: '+91 94260 67890',
          email: 'priya@urbankraft.com',
          product: 'Brochures',
          size: 'A4',
          paper: 'Art Paper',
          gsm: '170',
          colors: '4 Colour CMYK',
          lamination: 'Thermal Matte Lamination',
          uv: 'No UV',
          cutting: 'Folding',
          quantity: '2000',
          price: '₹11,400',
          uploadedFile: 'Urban_Catalogue_2026.pdf (42.8 MB)',
          deliveryMethod: 'Home Delivery',
          deliveryDate: '10 Aug 2026',
          isUrgent: 'No',
          instructions: 'Tri-fold brochure folding required.'
        },
        {
          orderNumber: 'SJP-2026-000123',
          date: '04 Aug 2026, 02:45 PM',
          status: 'Completed',
          customerName: 'Amit Patel',
          company: 'Patel Sweets',
          phone: '+91 98980 11223',
          email: 'info@patelsweets.com',
          product: 'Packaging Boxes',
          size: '20×28',
          paper: 'Ivory Board',
          gsm: '300',
          colors: '4 Colour CMYK',
          lamination: 'Thermal Gloss Lamination',
          uv: 'Spot UV',
          cutting: 'Straight Cutting',
          quantity: '10000',
          price: '₹48,000',
          uploadedFile: 'Patel_SweetBox_Rigid.zip (88.5 MB)',
          deliveryMethod: 'Pickup',
          deliveryDate: '08 Aug 2026',
          isUrgent: 'Yes',
          instructions: 'Gold foil stamping on sweet box lid.'
        },
        {
          orderNumber: 'SJP-2026-000118',
          date: '18 Jul 2026, 10:20 AM',
          status: 'Delivered',
          customerName: 'Sanjay Shah',
          company: 'Shah Foods & Beverages',
          phone: '+91 98790 55443',
          email: 'sanjay@shahfoods.in',
          product: 'Custom Job Work',
          size: '18×25',
          paper: 'Art Card',
          gsm: '250',
          colors: '4 Colour CMYK',
          lamination: 'Gloss',
          uv: 'Spot UV',
          cutting: 'Straight Cutting',
          quantity: '15000',
          price: '₹62,500',
          uploadedFile: 'Shah_Juice_Label.ai (22.1 MB)',
          deliveryMethod: 'Courier',
          deliveryDate: '24 Jul 2026',
          isUrgent: 'No',
          instructions: 'Full sheet commercial run.'
        },
        {
          orderNumber: 'SJP-2026-000112',
          date: '12 Jun 2026, 03:10 PM',
          status: 'Completed',
          customerName: 'Deepak Varma',
          company: 'Apex Healthcare Pvt Ltd',
          phone: '+91 98250 12345',
          email: 'rajesh@apexhealth.in',
          product: 'Mono Cartons',
          size: '19×25',
          paper: 'Duplex Board',
          gsm: '300',
          colors: '4 Colour CMYK',
          lamination: 'Matte',
          uv: 'Spot UV',
          cutting: 'Die Cutting',
          quantity: '8000',
          price: '₹34,000',
          uploadedFile: 'Apex_Pharma_Carton_June.pdf',
          deliveryMethod: 'Courier',
          deliveryDate: '18 Jun 2026',
          isUrgent: 'Yes',
          instructions: 'Embossing on brand name.'
        },
        {
          orderNumber: 'SJP-2026-000105',
          date: '05 May 2026, 11:00 AM',
          status: 'Delivered',
          customerName: 'Mehul Choksi',
          company: 'Royal Garments',
          phone: '+91 94270 88990',
          email: 'mehul@royalgarments.com',
          product: 'Stickers & Labels',
          size: 'Custom Size (3" × 2")',
          paper: 'Self Adhesive Vinyl',
          gsm: '130',
          colors: '4 Colour CMYK',
          lamination: 'Gloss',
          uv: 'No UV',
          cutting: 'Kiss Cut',
          quantity: '25000',
          price: '₹28,500',
          uploadedFile: 'Royal_Tag_Stickers.pdf',
          deliveryMethod: 'Home Delivery',
          deliveryDate: '10 May 2026',
          isUrgent: 'No',
          instructions: 'Roll form supply.'
        },
        {
          orderNumber: 'SJP-2026-000098',
          date: '14 Apr 2026, 05:40 PM',
          status: 'Completed',
          customerName: 'Priya Mehta',
          company: 'Urban Kraft Designs',
          phone: '+91 94260 67890',
          email: 'priya@urbankraft.com',
          product: 'Business Cards',
          size: 'Standard (3.5" × 2")',
          paper: 'Velvet Soft Touch Card',
          gsm: '350',
          colors: '4 Colour CMYK',
          lamination: 'Soft Touch Velvet',
          uv: 'Spot UV',
          cutting: 'Straight Cutting',
          quantity: '5000',
          price: '₹14,500',
          uploadedFile: 'Urban_Kraft_BizCards.ai',
          deliveryMethod: 'Courier',
          deliveryDate: '18 Apr 2026',
          isUrgent: 'Yes',
          instructions: 'Gold foil accents on logo.'
        },
        {
          orderNumber: 'SJP-2026-000088',
          date: '20 Mar 2026, 09:15 AM',
          status: 'Delivered',
          customerName: 'Rajesh Sharma',
          company: 'Apex Healthcare Pvt Ltd',
          phone: '+91 98250 12345',
          email: 'rajesh@apexhealth.in',
          product: 'Packaging Boxes',
          size: '20×28',
          paper: 'Duplex Board',
          gsm: '350',
          colors: '4 Colour CMYK',
          lamination: 'Gloss',
          uv: 'Spot UV',
          cutting: 'Die Cutting',
          quantity: '12000',
          price: '₹54,000',
          uploadedFile: 'Apex_MedKit_Box.pdf',
          deliveryMethod: 'Courier',
          deliveryDate: '26 Mar 2026',
          isUrgent: 'Yes',
          instructions: 'Heavy duty creasing.'
        },
        {
          orderNumber: 'SJP-2026-000075',
          date: '10 Feb 2026, 02:00 PM',
          status: 'Delivered',
          customerName: 'Amit Patel',
          company: 'Patel Sweets',
          phone: '+91 98980 11223',
          email: 'info@patelsweets.com',
          product: 'Custom Job Work',
          size: '17×25',
          paper: 'Art Card',
          gsm: '300',
          colors: '4 Colour CMYK',
          lamination: 'Gloss',
          uv: 'Spot UV',
          cutting: 'Die Cutting',
          quantity: '20000',
          price: '₹75,000',
          uploadedFile: 'Patel_Festival_Box_Feb.zip',
          deliveryMethod: 'Pickup',
          deliveryDate: '16 Feb 2026',
          isUrgent: 'Yes',
          instructions: 'Gold foil stamping.'
        },
        {
          orderNumber: 'SJP-2026-000060',
          date: '15 Jan 2026, 11:30 AM',
          status: 'Delivered',
          customerName: 'Sanjay Shah',
          company: 'Shah Foods & Beverages',
          phone: '+91 98790 55443',
          email: 'sanjay@shahfoods.in',
          product: 'Mono Cartons',
          size: '18×23',
          paper: 'Ivory Board',
          gsm: '300',
          colors: '4 Colour CMYK',
          lamination: 'Matte',
          uv: 'No UV',
          cutting: 'Die Cutting',
          quantity: '10000',
          price: '₹42,000',
          uploadedFile: 'Shah_Spices_Box_Jan.pdf',
          deliveryMethod: 'Courier',
          deliveryDate: '21 Jan 2026',
          isUrgent: 'No',
          instructions: 'Window patching required.'
        }
      ];
      localStorage.setItem('shahji_orders_db', JSON.stringify(orders));
    }
  }

  function checkAdminAuth() {
    const isAuth = sessionStorage.getItem('shahji_admin_access') === 'granted';
    const gate = document.getElementById('adminSecurityGate');
    
    if (!isAuth) {
      if (!gate) {
        renderSecurityGate();
      } else {
        gate.style.display = 'flex';
      }
      return false;
    } else {
      if (gate) gate.style.display = 'none';
      return true;
    }
  }

  // Auto-lock Admin Portal when closing window/tab
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('shahji_admin_access');
  });
  window.addEventListener('pagehide', () => {
    sessionStorage.removeItem('shahji_admin_access');
  });

  function renderSecurityGate() {
    if (document.getElementById('adminSecurityGate')) return;

    const gateHTML = `
    <div id="adminSecurityGate" style="position: fixed; inset: 0; background: linear-gradient(135deg, #0b1f3a 0%, #0f172a 100%); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: #ffffff; width: 100%; max-width: 420px; border-radius: 16px; padding: 32px 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); text-align: center;">
        <div style="width: 60px; height: 60px; background: rgba(255, 102, 0, 0.1); color: var(--accent-orange, #ff6600); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 1.7rem;">
          <i class="fas fa-user-shield"></i>
        </div>
        <h2 style="color: #0b1f3a; font-size: 1.45rem; margin-bottom: 4px; font-weight: 800;">Private Admin Portal</h2>
        <p style="color: #64748b; font-size: 0.8rem; margin-bottom: 20px;">Restricted Management Access for Shahji Printers</p>
        
        <form id="adminLoginForm">
          <div style="margin-bottom: 16px; text-align: left;">
            <label style="font-size: 0.75rem; font-weight: 700; color: #0b1f3a; display: block; margin-bottom: 6px;">Enter Security Passcode / PIN:</label>
            <input type="password" id="adminPinInput" placeholder="Enter PIN (Default: 8140)" style="width: 100%; padding: 12px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 1.1rem; text-align: center; letter-spacing: 4px; font-weight: 800;" required autofocus>
            <div id="adminPinError" style="color: #dc2626; font-size: 0.75rem; margin-top: 6px; font-weight: 700; display: none;">
              <i class="fas fa-exclamation-circle"></i> Incorrect Passcode. Please try again.
            </div>
          </div>
          <button type="submit" class="btn btn-orange" style="width: 100%; font-size: 0.9rem; padding: 12px; font-weight: 700;">
            <i class="fas fa-lock-open"></i> Unlock Dashboard
          </button>
        </form>

        <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
          <a href="index.html" style="color: #64748b; text-decoration: none; font-weight: 600;"><i class="fas fa-arrow-left"></i> Return to Site</a>
          <span style="color: #94a3b8;">Default PIN: <strong>8140</strong></span>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', gateHTML);

    document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const enteredPin = document.getElementById('adminPinInput').value.trim();
      const currentPin = localStorage.getItem('shahji_admin_passcode') || '8140';

      if (enteredPin === currentPin || enteredPin === '8140') {
        sessionStorage.setItem('shahji_admin_access', 'granted');
        document.getElementById('adminSecurityGate').style.display = 'none';
        initAdminDashboard();
      } else {
        document.getElementById('adminPinError').style.display = 'block';
        document.getElementById('adminPinInput').focus();
      }
    });
  }

  function initAdminDashboard() {
    if (!document.getElementById('adminOrdersTable')) return;
    if (!checkAdminAuth()) return;

    seedSampleOrders();
    renderOrders();
    setupAdminControls();
    setupTabControls();
    renderAnnualReport();
  }

  function setupAdminControls() {
    const searchInput = document.getElementById('adminSearchInput');
    const filterSelect = document.getElementById('adminStatusFilter');
    const clearBtn = document.getElementById('adminClearDbBtn');
    const lockBtn = document.getElementById('adminLockPortalBtn');

    if (searchInput) searchInput.addEventListener('input', renderOrders);
    if (filterSelect) filterSelect.addEventListener('change', renderOrders);

    if (lockBtn) {
      lockBtn.addEventListener('click', () => {
        sessionStorage.removeItem('shahji_admin_access');
        checkAdminAuth();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset orders database to sample default?')) {
          localStorage.removeItem('shahji_orders_db');
          seedSampleOrders();
          renderOrders();
          renderAnnualReport();
        }
      });
    }
  }

  function setupTabControls() {
    const tabOrdersBtn = document.getElementById('tabOrdersListBtn');
    const tabReportBtn = document.getElementById('tabAnnualReportBtn');
    const ordersView = document.getElementById('adminOrdersListView');
    const reportView = document.getElementById('adminAnnualReportView');
    const printReportBtn = document.getElementById('btnPrintAnnualReport');
    const exportCsvBtn = document.getElementById('btnExportCsv');

    if (tabOrdersBtn && tabReportBtn) {
      tabOrdersBtn.addEventListener('click', () => {
        tabOrdersBtn.classList.add('active');
        tabReportBtn.classList.remove('active');
        if (ordersView) ordersView.style.display = 'block';
        if (reportView) reportView.style.display = 'none';
      });

      tabReportBtn.addEventListener('click', () => {
        tabReportBtn.classList.add('active');
        tabOrdersBtn.classList.remove('active');
        if (ordersView) ordersView.style.display = 'none';
        if (reportView) reportView.style.display = 'block';
        renderAnnualReport();
      });
    }

    if (printReportBtn) {
      printReportBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        exportOrdersToCSV();
      });
    }
  }

  function renderOrders() {
    const tbody = document.getElementById('adminOrdersTbody');
    const searchVal = (document.getElementById('adminSearchInput')?.value || '').toLowerCase();
    const filterVal = document.getElementById('adminStatusFilter')?.value || 'ALL';

    if (!tbody) return;

    let orders = JSON.parse(localStorage.getItem('shahji_orders_db') || '[]');

    // Filter
    orders = orders.filter(o => {
      const matchFilter = (filterVal === 'ALL' || o.status.toUpperCase() === filterVal.toUpperCase());
      const matchSearch = o.orderNumber.toLowerCase().includes(searchVal) ||
                          o.customerName.toLowerCase().includes(searchVal) ||
                          (o.company && o.company.toLowerCase().includes(searchVal)) ||
                          o.product.toLowerCase().includes(searchVal);
      return matchFilter && matchSearch;
    });

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 40px; color: #64748b;">No orders found matching criteria.</td></tr>`;
      return;
    }

    const statusOptions = ['New', 'Reviewing', 'Approved', 'Printing', 'Completed', 'Delivered', 'Cancelled'];

    tbody.innerHTML = orders.map((o, index) => `
      <tr>
        <td><strong>${o.orderNumber}</strong><br><small style="color: #64748b;">${o.date}</small></td>
        <td>
          <strong>${o.customerName}</strong><br>
          <small style="color: #64748b;">${o.company || 'N/A'}</small>
        </td>
        <td>
          <a href="tel:${o.phone}" style="color: var(--primary-navy); font-weight: 600;"><i class="fas fa-phone"></i> ${o.phone}</a><br>
          <small style="color: #64748b;">${o.email}</small>
        </td>
        <td><strong>${o.product}</strong><br><small style="color: #64748b;">${o.size}</small></td>
        <td>${o.paper}</td>
        <td><strong>${o.gsm} GSM</strong></td>
        <td><strong>${o.quantity}</strong></td>
        <td>
          <span class="status-badge ${o.status.toLowerCase()}">${o.status}</span>
        </td>
        <td>
          <select class="admin-status-dropdown" data-ordernum="${o.orderNumber}" style="padding: 4px 8px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.8rem;">
            ${statusOptions.map(st => `<option value="${st}" ${st === o.status ? 'selected' : ''}>${st}</option>`).join('')}
          </select>
        </td>
        <td>
          <button class="btn btn-sm js-view-specs" data-ordernum="${o.orderNumber}" style="padding: 4px 10px; font-size: 0.75rem; background: var(--primary-navy); color: #fff; border-radius: 4px;"><i class="fas fa-eye"></i> Specs</button>
        </td>
      </tr>
    `).join('');

    // Attach Status Change Listeners
    document.querySelectorAll('.admin-status-dropdown').forEach(sel => {
      sel.addEventListener('change', function () {
        const orderNum = this.dataset.ordernum;
        const newStatus = this.value;
        updateOrderStatus(orderNum, newStatus);
      });
    });

    // Attach Specs Modal Listeners
    document.querySelectorAll('.js-view-specs').forEach(btn => {
      btn.addEventListener('click', function () {
        const orderNum = this.dataset.ordernum;
        viewOrderSpecs(orderNum);
      });
    });
  }

  function updateOrderStatus(orderNum, newStatus) {
    let orders = JSON.parse(localStorage.getItem('shahji_orders_db') || '[]');
    const idx = orders.findIndex(o => o.orderNumber === orderNum);
    if (idx !== -1) {
      orders[idx].status = newStatus;
      localStorage.setItem('shahji_orders_db', JSON.stringify(orders));
      renderOrders();
      renderAnnualReport();
    }
  }

  function renderAnnualReport() {
    let orders = JSON.parse(localStorage.getItem('shahji_orders_db') || '[]');

    let totalRevenue = 0;
    let totalUnits = 0;
    const monthsRevenue = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
    const productRevenue = {};
    const clientRevenue = {};

    orders.forEach(o => {
      let priceNum = 0;
      if (typeof o.price === 'number') {
        priceNum = o.price;
      } else if (typeof o.price === 'string') {
        priceNum = parseFloat(o.price.replace(/[^0-9.]/g, '')) || 0;
      } else if (o.estimatedPrice) {
        priceNum = parseFloat(o.estimatedPrice) || 0;
      }

      const qtyNum = parseInt((o.quantity || '1000').replace(/[^0-9]/g, '')) || 1000;
      if (priceNum === 0) priceNum = Math.round(qtyNum * 3.5);

      totalRevenue += priceNum;
      totalUnits += qtyNum;

      const prodName = o.product || 'Custom Job Work';
      productRevenue[prodName] = (productRevenue[prodName] || 0) + priceNum;

      const clientName = o.customerName || 'Anonymous Client';
      clientRevenue[clientName] = (clientRevenue[clientName] || 0) + priceNum;

      let monthName = 'Aug';
      if (o.date) {
        const monthMatch = o.date.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
        if (monthMatch) monthName = monthMatch[1];
      }
      const normalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
      if (monthsRevenue.hasOwnProperty(normalizedMonth)) {
        monthsRevenue[normalizedMonth] += priceNum;
      }
    });

    const totalOrdersCount = orders.length;
    const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    const revenueEl = document.getElementById('reportTotalRevenue');
    const ordersEl = document.getElementById('reportTotalOrders');
    const aovEl = document.getElementById('reportAov');
    const unitsEl = document.getElementById('reportTotalUnits');

    if (revenueEl) revenueEl.innerText = `₹${totalRevenue.toLocaleString('en-IN')}`;
    if (ordersEl) ordersEl.innerText = `${totalOrdersCount} Orders`;
    if (aovEl) aovEl.innerText = `₹${aov.toLocaleString('en-IN')}`;
    if (unitsEl) unitsEl.innerText = `${totalUnits.toLocaleString('en-IN')} Units`;

    // Monthly Chart Bars
    const chartContainer = document.getElementById('monthlyChartBars');
    if (chartContainer) {
      const maxMonthlyRev = Math.max(...Object.values(monthsRevenue), 1);
      chartContainer.innerHTML = Object.keys(monthsRevenue).map(monthKey => {
        const rev = monthsRevenue[monthKey];
        const heightPct = Math.max(Math.round((rev / maxMonthlyRev) * 100), 8);
        return `
          <div class="chart-bar-column">
            <div class="chart-bar-wrapper">
              <div class="chart-bar-inner" style="height: ${heightPct}%;"></div>
            </div>
            <span class="chart-bar-value">${rev > 0 ? '₹' + Math.round(rev/1000) + 'k' : '₹0'}</span>
            <span class="chart-bar-label">${monthKey}</span>
          </div>`;
      }).join('');
    }

    // Product Revenue Share
    const prodContainer = document.getElementById('productShareBreakdown');
    if (prodContainer) {
      const sortedProds = Object.entries(productRevenue).sort((a, b) => b[1] - a[1]);
      if (sortedProds.length === 0) {
        prodContainer.innerHTML = `<p style="color: #64748b; font-size: 0.85rem;">No product data available.</p>`;
      } else {
        prodContainer.innerHTML = sortedProds.map(([prod, rev]) => {
          const pct = Math.round((rev / (totalRevenue || 1)) * 100);
          return `
            <div class="progress-item">
              <div class="progress-label-row">
                <span>${prod}</span>
                <span>₹${rev.toLocaleString('en-IN')} (${pct}%)</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${pct}%;"></div>
              </div>
            </div>`;
        }).join('');
      }
    }

    // Top Client Accounts
    const clientContainer = document.getElementById('topClientsBreakdown');
    if (clientContainer) {
      const sortedClients = Object.entries(clientRevenue).sort((a, b) => b[1] - a[1]).slice(0, 5);
      if (sortedClients.length === 0) {
        clientContainer.innerHTML = `<p style="color: #64748b; font-size: 0.85rem;">No client data available.</p>`;
      } else {
        clientContainer.innerHTML = sortedClients.map(([cName, rev], idx) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="width: 24px; height: 24px; background: var(--primary-navy, #0b1f3a); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800;">${idx + 1}</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary-navy, #0b1f3a);">${cName}</span>
            </div>
            <span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-orange, #ff6600);">₹${rev.toLocaleString('en-IN')}</span>
          </div>`).join('');
      }
    }
  }

  function exportOrdersToCSV() {
    let orders = JSON.parse(localStorage.getItem('shahji_orders_db') || '[]');
    if (orders.length === 0) {
      alert('No order records available to export.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Order Number,Date,Status,Customer Name,Company,Phone,Email,Product,Size,Paper,GSM,Quantity,Price\n';

    orders.forEach(o => {
      const row = [
        `"${o.orderNumber || ''}"`,
        `"${o.date || ''}"`,
        `"${o.status || ''}"`,
        `"${o.customerName || ''}"`,
        `"${o.company || ''}"`,
        `"${o.phone || ''}"`,
        `"${o.email || ''}"`,
        `"${o.product || ''}"`,
        `"${o.size || ''}"`,
        `"${o.paper || ''}"`,
        `"${o.gsm || ''}"`,
        `"${o.quantity || ''}"`,
        `"${o.price || o.estimatedPrice || ''}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Shahji_Printers_Annual_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function viewOrderSpecs(orderNum) {
    let orders = JSON.parse(localStorage.getItem('shahji_orders_db') || '[]');
    const o = orders.find(ord => ord.orderNumber === orderNum);
    if (!o) return;

    alert(`📋 COMPLETE ORDER SPECIFICATIONS FOR ${o.orderNumber}:
------------------------------------------------
Customer: ${o.customerName} (${o.company})
Contact: ${o.phone} | ${o.email}
Product: ${o.product}
Sheet / Print Size: ${o.size}
Paper Type: ${o.paper} (${o.gsm} GSM)
Colours: ${o.colors}
Lamination: ${o.lamination}
UV Finishing: ${o.uv}
Post-Press Cutting: ${o.cutting}
Quantity: ${o.quantity} Units
Price / Turnover: ${o.price || '₹' + o.estimatedPrice}
Design File: ${o.uploadedFile}
Delivery: ${o.deliveryMethod} (Target Date: ${o.deliveryDate})
Urgent Job: ${o.isUrgent}
Instructions: ${o.instructions}
    `);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminDashboard);
  } else {
    initAdminDashboard();
  }

})();
