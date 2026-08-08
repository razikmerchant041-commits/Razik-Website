/**
 * Shahji Printers - Ultra-Knowledgeable & Respectful AI Chatbot Widget
 * Powered by Google Gemini AI (gemini-2.5-flash) + Smart Offline Knowledge Engine
 */

(function () {
  'use strict';

  // Config
  const CONFIG = {
    apiKey: window.SHAHJI_GEMINI_API_KEY || '',
    models: ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    phone: '+91 81403 40410',
    whatsapp: '918140340410',
    email: 'printshahji@gmail.com',
    companyName: 'Shahji Printers',
    location: '123 Print Avenue, Industrial Estate, Ahmedabad, Gujarat 380015, India',
    configuratorUrl: 'configurator.html'
  };

  // Expanded System Prompt for Gemini 2.5 Flash
  const SYSTEM_INSTRUCTION = `
You are "Shahji AI", the official expert virtual printing & packaging consultant for Shahji Printers located in Ahmedabad, Gujarat, India.
Your top priority is to provide EXTREMELY RESPECTFUL, COURTEOUS, WARMLY POLITE, AND HIGHLY KNOWLEDGEABLE answers to any customer doubt regarding printing, packaging, paper GSM, finishes, machinery, turnaround time, pricing, or custom order inquiries.

Tone & Persona Rules:
- Always maintain an utmost respectful, humble, customer-first tone (e.g., "Namaste", "Respected Customer", "Dear Client", "It is our absolute privilege to assist you", "Ji / Sir / Ma'am").
- You can seamlessly understand and respond in English, Hindi, Hinglish (e.g., "Rate kya hai", "Box price", "Namaste", "Printing kaise hoti hai"), and Gujarati.
- Be clear, direct, and structured using bold text, emojis, bullet points, and numbered lists.
- Always offer helpful next steps, like recommending paper GSM, suggesting finish combinations (e.g., Matte Lamination + 3D Spot UV), or inviting them to get a custom quote via WhatsApp or phone.

Shahji Printers Core Knowledge Base:
- Company Tagline: Quality • Trust • Perfection
- Industry Experience: 25+ Years of Printing & Packaging Excellence
- Location: 123 Print Avenue, Industrial Estate, Ahmedabad, Gujarat 380015
- Working Hours: Monday to Saturday: 10:00 AM - 7:30 PM (Sunday closed)
- Contact: Phone/WhatsApp: +91 81403 40410 | Email: printshahji@gmail.com

Machinery Fleet & Tech Capabilities:
1. Japanese 5-Colour Offset Press: High-speed printing up to 15,000 sheets/hour. Supports CMYK, Pantone spot colors, and rich metallic inks with pin-point registration.
2. 4-Colour Offset Machine: High-speed CMYK press (13,000 sheets/hour) for commercial jobs, booklets, catalogues, flyers, and box packaging.
3. 3D Spot UV & Foil Stamping Machine: Creates 3D raised glossy varnish textures and metallic foil embellishments (Gold, Silver, Rose Gold, Metallic Copper).
4. Heavy-Duty Lamination Machine: Thermal & cold film lamination providing Matte, Gloss, and Velvet Soft-Touch protective finishes.
5. High-Speed Programmable Paper Cutter: Computerized digital hydraulic paper trimmer ensuring sub-millimeter precision.

Products & Job Works:
- Packaging Boxes: Rigid boxes, corrugated packaging, food-grade boxes, sweet boxes, cosmetic boxes, product sleeves.
- Mono Cartons: Premium FBB (Folding Box Board) and SBS board mono cartons for pharmaceuticals, cosmetics, and FMCG retail items.
- Stickers & Labels: Waterproof vinyl labels, transparent clear film labels for bottles, paper adhesive stickers, barcode labels.
- Commercial Printing: Brochures, catalogues, flyers, business cards, letterheads, envelopes, folders, paper bags, invitation cards, hang tags, posters, danglers.
- Custom Stickers & Labels: Sunshine High-Gloss Sticker, Waterproof Synthetic PVC Sticker, HM Poly Container Sticker, Avery / Every Premium Chrome Sticker, Paper & Vinyl Stickers.

Paper GSM & Stock Guide (Paper Weight & Selection):
- 80 - 100 GSM: Office letterheads, inner booklet pages, invoice books, Sunshine / Paper stickers.
- 130 - 170 GSM: Promotional flyers, folded brochures, inner catalogue pages, PVC & Avery stickers.
- 250 - 350 GSM: Premium business cards (250, 300, 350 GSM only), catalogue covers, greeting cards, heavy brochures.
- 250 - 400 GSM: Heavyweight duplex board, Ivory board & SBS board for packaging boxes & mono cartons.
- Custom Size Units: Supports Inches (in), Millimeters (mm), Centimeters (cm), and Feet (ft) with instant unit conversion.
- Smart Auto-Filtering: The Print Configurator automatically filters valid paper stocks and GSM options based on the chosen product.

Finishes & Embellishments:
- 3D Spot UV: High-gloss raised 3D liquid varnish on key logos/headings contrasting with matte background.
- Lamination: Matte (anti-glare elegance), Gloss (shiny reflection), Soft-Touch Velvet (luxurious suede texture).
- Foil Stamping: Metallic Gold, Silver, Rose Gold, Copper foil accents.
- Embossing / Debossing: Raised or recessed 3D tactile textures.

Pre-Press File Preparation:
- Color Space: Convert RGB to CMYK.
- Resolution: Minimum 300 DPI.
- Bleed Area: 3mm bleed margin around all artwork edges.
- Formats Accepted: PDF (Press Ready), AI, CDR, EPS, high-res TIFF.

Pricing & Live Estimates:
- Prices depend on dimensions, paper GSM, finish, and quantity (bulk discounts apply).
- Customers can also calculate live estimations on our website's Print Configurator page (configurator.html) or contact us on WhatsApp (+91 81403 40410).
`;

  let chatHistory = [];
  let isOpen = false;

  // Initialize Chatbot UI
  function initChatbotUI() {
    if (document.getElementById('shahji-chat-window')) return;

    // Inject HTML Markup
    const chatMarkup = `
      <!-- Launcher Button -->
      <button class="shahji-chatbot-toggle" id="shahjiChatToggle" aria-label="Open AI Assistant Chatbot">
        <i class="fas fa-robot" id="shahjiToggleIcon"></i>
        <span class="shahji-chatbot-badge">1</span>
      </button>

      <!-- Tooltip Banner -->
      <div class="shahji-chatbot-tooltip show-initially" id="shahjiTooltip">
        <i class="fas fa-sparkles" style="color: #ffb703;"></i> Ask Shahji AI Expert Consultant!
      </div>

      <!-- Main Chat Window -->
      <div class="shahji-chat-window" id="shahjiChatWindow">
        <!-- Header -->
        <div class="shahji-chat-header">
          <div class="shahji-chat-brand">
            <div class="shahji-avatar-box">
              <img src="images/logo/logo.png" alt="Shahji Logo" style="width: 26px; height: 26px; filter: brightness(0) invert(1);">
              <span class="shahji-online-dot"></span>
            </div>
            <div class="shahji-brand-info">
              <h4>Shahji AI Assistant <span class="shahji-respect-badge"><i class="fas fa-shield-alt"></i> Official</span></h4>
              <p><i class="fas fa-bolt" style="color: #ff6600;"></i> Powered by Gemini 2.5 Flash • Online</p>
            </div>
          </div>
          <div class="shahji-chat-controls">
            <button class="shahji-icon-btn" id="shahjiClearChat" title="Clear Conversation">
              <i class="fas fa-trash-alt"></i>
            </button>
            <button class="shahji-icon-btn" id="shahjiCloseChat" title="Close Window">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Chat Body -->
        <div class="shahji-chat-body" id="shahjiChatBody">
          <div class="shahji-welcome-card">
            🙏 <strong>Namaste & Welcome to Shahji Printers!</strong><br>
            I am <strong>Shahji AI</strong>, your dedicated printing & packaging virtual consultant. It is my pleasure to assist you with paper selection, packaging boxes, Spot UV, pricing, or artwork specs.
            
            <div class="shahji-welcome-subtitle">Popular customer inquiries:</div>
            <div class="shahji-quick-prompts">
              <button class="shahji-chip" data-prompt="What packaging boxes & mono cartons services do you offer?">📦 Packaging Boxes</button>
              <button class="shahji-chip" data-prompt="What is the difference between 3D Spot UV & Lamination?">🎨 Spot UV vs Lamination</button>
              <button class="shahji-chip" data-prompt="Which paper GSM is best for my project?">📄 Paper GSM Guide</button>
              <button class="shahji-chip" data-prompt="Tell me about your Japanese 5-Colour Offset Press machine.">⚙️ Machinery Fleet</button>
              <button class="shahji-chip" data-prompt="How can I request a quote or price estimate?">📞 Request Instant Quote</button>
              <button class="shahji-chip" data-prompt="Where is Shahji Printers located and what are your hours?">📍 Location & Hours</button>
            </div>
          </div>
        </div>

        <!-- Footer Input -->
        <div class="shahji-chat-footer">
          <form class="shahji-chat-input-box" id="shahjiChatForm">
            <input type="text" class="shahji-chat-input" id="shahjiChatInput" placeholder="Ask any printing or packaging doubt..." autocomplete="off" />
            <button type="submit" class="shahji-send-btn" id="shahjiSendBtn" aria-label="Send Message">
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
          <div class="shahji-chat-credit">
            Respectful & Instant Printing Assistance • <strong>Shahji AI</strong>
          </div>
        </div>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = chatMarkup;
    document.body.appendChild(container);

    // Event Listeners
    const toggleBtn = document.getElementById('shahjiChatToggle');
    const closeBtn = document.getElementById('shahjiCloseChat');
    const clearBtn = document.getElementById('shahjiClearChat');
    const form = document.getElementById('shahjiChatForm');
    const tooltip = document.getElementById('shahjiTooltip');
    const chatBody = document.getElementById('shahjiChatBody');

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    clearBtn.addEventListener('click', clearChatHistory);
    form.addEventListener('submit', handleFormSubmit);

    // Quick chips click delegate
    chatBody.addEventListener('click', (e) => {
      const chip = e.target.closest('.shahji-chip');
      if (chip) {
        const prompt = chip.dataset.prompt;
        if (prompt) {
          sendUserMessage(prompt);
        }
      }
    });

    // Hide initial tooltip after 8s or on click
    setTimeout(() => {
      if (tooltip) tooltip.classList.remove('show-initially');
    }, 8000);
  }

  // Toggle Chat window
  function toggleChat() {
    isOpen = !isOpen;
    const windowEl = document.getElementById('shahjiChatWindow');
    const iconEl = document.getElementById('shahjiToggleIcon');
    const badgeEl = document.querySelector('.shahji-chatbot-badge');

    if (isOpen) {
      windowEl.classList.add('active');
      iconEl.className = 'fas fa-chevron-down';
      if (badgeEl) badgeEl.style.display = 'none';
      document.getElementById('shahjiChatInput').focus();
    } else {
      windowEl.classList.remove('active');
      iconEl.className = 'fas fa-robot';
    }
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('shahjiChatWindow').classList.remove('active');
    document.getElementById('shahjiToggleIcon').className = 'fas fa-robot';
  }

  function clearChatHistory() {
    chatHistory = [];
    const chatBody = document.getElementById('shahjiChatBody');
    chatBody.innerHTML = `
      <div class="shahji-welcome-card">
        🙏 <strong>Welcome back to Shahji Printers!</strong><br>
        Conversation history cleared. How may I respectfully assist your printing or packaging project today?
        <div class="shahji-quick-prompts">
          <button class="shahji-chip" data-prompt="What packaging boxes & mono cartons services do you offer?">📦 Packaging Boxes</button>
          <button class="shahji-chip" data-prompt="What is the difference between 3D Spot UV & Lamination?">🎨 Spot UV vs Lamination</button>
          <button class="shahji-chip" data-prompt="Which paper GSM is best for my project?">📄 Paper GSM Guide</button>
          <button class="shahji-chip" data-prompt="How can I request a quote or price estimate?">📞 Request Instant Quote</button>
        </div>
      </div>
    `;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('shahjiChatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendUserMessage(text);
  }

  // Append user message & trigger Gemini API or smart printing consultant fallback
  async function sendUserMessage(text) {
    appendMessage(text, 'user');
    chatHistory.push({ role: 'user', parts: [{ text: text }] });

    // Show typing indicator
    showTypingIndicator();

    try {
      const botReply = await fetchGeminiResponse();
      removeTypingIndicator();
      appendMessage(botReply, 'bot');
      chatHistory.push({ role: 'model', parts: [{ text: botReply }] });
    } catch (err) {
      console.warn('Gemini API call used smart local printing expert fallback:', err);
      removeTypingIndicator();
      const botReply = getSmartPrintingResponse(text);
      appendMessage(botReply, 'bot', true);
      chatHistory.push({ role: 'model', parts: [{ text: botReply }] });
    }
  }

  // Call Gemini REST API prioritizing gemini-2.5-flash
  async function fetchGeminiResponse() {
    let lastError = null;

    for (const model of CONFIG.models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${CONFIG.apiKey}`;

        const requestBody = {
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: chatHistory.slice(-10),
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 750
          }
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn(`Model ${model} returned error ${res.status}:`, errData);
          lastError = errData.error?.message || `HTTP ${res.status}`;
          continue;
        }

        const data = await res.json();
        const candidate = data.candidates?.[0];
        const replyText = candidate?.content?.parts?.[0]?.text;

        if (replyText) {
          return replyText;
        }
      } catch (e) {
        console.warn(`Model ${model} fetch failed:`, e);
        lastError = e.message;
      }
    }

    throw new Error(lastError || 'All Gemini AI models unavailable');
  }

  // Smart Offline Printing Expert Knowledge Base & Intent Engine
  function getSmartPrintingResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. Greetings & Respectful Intent
    if (q.includes('hello') || q.includes('hi') || q.includes('namaste') || q.includes('hey') || q.includes('pranam') || q.includes('good morning') || q.includes('good afternoon') || q.includes('good evening') || q.includes('who are you') || q.includes('shahji ai')) {
      return `🙏 **Namaste & Warm Greetings! Welcome to Shahji Printers.**

I am **Shahji AI**, your official printing and packaging virtual consultant. It is our pleasure to serve you. 

I can assist you with:
- 📦 **Packaging Boxes & Mono Cartons** (Pharma, Cosmetics, Food certified, Rigid Boxes)
- 📄 **Paper GSM & Weight Selection** (80 GSM to 450 GSM Duplex & SBS Board)
- 🎨 **Finishes & Embellishments** (3D Spot UV, Gloss/Matte Lamination, Foil Stamping)
- ⚙️ **Machinery Fleet** (Japanese 5-Colour Offset Press - 15,000 sheets/hr)
- 📞 **Instant Quotes & Pricing** via WhatsApp (+91 81403 40410)

How may I respectfully assist your project today?`;
    }

    // 2. Packaging Boxes & Mono Cartons
    if (q.includes('box') || q.includes('packag') || q.includes('carton') || q.includes('mono') || q.includes('pharma') || q.includes('cosmetic') || q.includes('rigid') || q.includes('corrugated')) {
      return `📦 **Custom Packaging Boxes & Mono Cartons Solutions:**

Respected Client, Shahji Printers specializes in high-quality packaging manufacturing tailored to your exact brand specifications:

- **Mono Cartons:** Manufactured from premium **FBB (Folding Box Board)** & **SBS Board (250-400 GSM)**, ideal for pharmaceutical, cosmetic, and food packaging.
- **Rigid Packaging Boxes:** High-end sturdy gift & luxury product boxes.
- **Corrugated Boxes:** Durable multi-layer shipping & transit packaging.
- **Special Enhancements:** Food-grade moisture-resistant coating, 3D raised Spot UV, gold/silver foil accents, and window die-cutting.

💡 *Would you like to calculate an instant box estimate?* You can use our web [Print Configurator](configurator.html) or send box dimensions to our WhatsApp (**${CONFIG.phone}**)!`;
    }

    // 3. Paper GSM & Weight Guide
    if (q.includes('gsm') || q.includes('weight') || q.includes('paper quality') || q.includes('thickness') || q.includes('paper type') || q.includes('duplex') || q.includes('sbs') || q.includes('kraft') || q.includes('art paper')) {
      return `📄 **Shahji Printers Paper GSM Guide (Grams per Square Meter):**

Selecting the right paper GSM ensures structural durability and premium tactile feel:

- **80 - 100 GSM:** Lightweight paper used for company letterheads, inner booklet pages, and bill books.
- **130 - 170 GSM:** Medium art paper ideal for promotional flyers, folded brochures, and magazine pages.
- **250 - 300 GSM:** Heavyweight cardstock recommended for business cards, catalogue covers, and folders.
- **350 - 450 GSM:** Ultra-sturdy duplex board & SBS board designed for **packaging boxes & mono cartons**.

✨ *Not sure which GSM fits your design?* Feel free to ask or call our technical team at **${CONFIG.phone}**!`;
    }

    // 4. Finishes: Spot UV vs Lamination vs Foiling
    if (q.includes('spot uv') || q.includes('uv') || q.includes('lamination') || q.includes('finish') || q.includes('gloss') || q.includes('matte') || q.includes('velvet') || q.includes('soft touch') || q.includes('foil') || q.includes('emboss')) {
      return `🎨 **Premium Print Finishes & Embellishments:**

Enhance your product packaging with our state-of-the-art finishing technology:

- **3D Spot UV Varnish:** Applies a raised, ultra-glossy 3D liquid texture over specific logos or key graphics, creating stunning contrast over matte backgrounds.
- **Matte Lamination:** Anti-glare, non-reflective smooth finish offering sophisticated elegance.
- **Gloss Lamination:** Vibrant, high-reflection protective film that amplifies color intensity.
- **Soft-Touch / Velvet Lamination:** Luxurious suede-like tactile surface for ultra-premium branding.
- **Metallic Foil Stamping:** High-precision metallic foiling in Gold, Silver, Rose Gold, and Copper.

🌟 *Pro Tip:* Combining **Matte Lamination with 3D Spot UV** creates an award-winning luxury packaging look!`;
    }

    // 5. Machinery & Press Technology
    if (q.includes('machine') || q.includes('press') || q.includes('speed') || q.includes('equipment') || q.includes('japanese') || q.includes('offset') || q.includes('cutter')) {
      return `⚙️ **Shahji Printers Machinery Fleet & Technical Capabilities:**

We operate advanced Japanese offset printing machinery engineered for high accuracy and high volume:

1. **Japanese 5-Colour Offset Press:** High-speed printing up to **15,000 sheets/hour** (Max Sheet: **20 × 28 Inches**). Guarantees crisp CMYK, Pantone spot colors, and metallic ink accuracy.
2. **4-Colour Offset Machine:** High-speed CMYK press operating at **13,000 sheets/hour** (Max Sheet: **19 × 25 Inches**) for commercial jobs, booklets, flyers, and box packaging.
3. **3D Spot UV & Foil Stamping Unit:** Automated liquid gloss UV coating and multi-metallic foil application.
4. **Thermal & Cold Lamination Machine:** Heavy-duty matte, gloss, and soft-touch film bonding.
5. **Programmable Hydraulic Paper Cutter:** Computerized digital paper trimming with sub-millimeter squaring precision.`;
    }

    // 6. Pricing, Cost & Quotation
    if (q.includes('quote') || q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('daam') || q.includes('cheap') || q.includes('discount') || q.includes('estimate') || q.includes('charges')) {
      return `📞 **Requesting a Custom Price Quote:**

Respected Client, custom printing rates are calculated based on paper GSM, dimensions, finishing options, and batch quantity (bulk discounts available).

You can easily get a quote:
- 📱 **WhatsApp Instant Quote:** Send specs/artwork to **+91 81403 40410**
- 🧮 **Live Estimator:** Try our online [Print Configurator](configurator.html)
- 📞 **Direct Phone Call:** +91 81403 40410
- ✉️ **Email Inquiry:** printshahji@gmail.com

Our team will gladly prepare a competitive quote within minutes!`;
    }

    // 7. Hinglish / Hindi Friendly Queries
    if (q.includes('rate kya') || q.includes('price kitna') || q.includes('batao') || q.includes('kaise') || q.includes('chahiye') || q.includes('karwana') || q.includes('shuru') || q.includes('milega')) {
      return `🙏 **Shahji Printers me Aapka Swagat Hai!**

Aapki har tarah ki printing aur packaging requirement ke liye hum tayaar hain:

- 📦 **Packaging Boxes & Cartons:** Pharma, Cosmetics, Sweet & Food boxes custom size me.
- 📄 **Paper Quality:** 80 GSM se 450 GSM Duplex / SBS Board.
- 🎨 **Special Finishes:** 3D Spot UV, Matte/Gloss Lamination aur Gold/Silver Foil Stamping.
- 📞 **Instant Quotation:** Apne order ki details WhatsApp par send karein: **+91 81403 40410** ya call karein!

Aap hamare website par [Print Configurator](configurator.html) me bhi estimate check kar sakte hain.`;
    }

    // 8. Delivery, Turnaround & Fast-Track
    if (q.includes('delivery') || q.includes('time') || q.includes('turnaround') || q.includes('fast') || q.includes('urgent') || q.includes('days') || q.includes('dispatch') || q.includes('ship')) {
      return `🚚 **Production Turnaround & Delivery Details:**

- **Standard Lead Time:** 3 to 5 business days for standard offset job works & packaging runs.
- **Express Fast-Track Printing:** 24 to 48 hour rush production available for urgent commercial requirements!
- **Delivery Coverage:** Local doorstep delivery across Ahmedabad & Gujarat, and reliable courier/freight dispatch across All India.

Need an urgent delivery? Please contact us directly at **${CONFIG.phone}**!`;
    }

    // 9. Stickers & Product Labels
    if (q.includes('sticker') || q.includes('label') || q.includes('decal') || q.includes('vinyl') || q.includes('transparent') || q.includes('adhesive') || q.includes('barcode')) {
      return `🏷️ **Custom Stickers & Industrial Product Labels:**

We manufacture high-resolution, strong-adhesive stickers and labels:

- **Paper Stickers:** Cost-effective labels for retail boxes, jars, and bags.
- **Waterproof Vinyl Labels:** Scratch-resistant, weatherproof labels for beverage bottles and outdoor products.
- **Clear Transparent Labels:** Sleek see-through labels for glass jars & cosmetic containers.
- **Barcode & QR Labels:** High-density crisp scanning quality.`;
    }

    // 10. Commercial Printing (Cards, Brochures, Catalogues)
    if (q.includes('card') || q.includes('visiting card') || q.includes('brochure') || q.includes('flyer') || q.includes('pamphlet') || q.includes('catalogue') || q.includes('folder') || q.includes('letterhead') || q.includes('envelope')) {
      return `📑 **Commercial Printing & Corporate Stationery:**

Enhance your corporate identity with our high-precision offset printing:

- **Business Cards:** 350+ GSM premium cards with Velvet Lamination & Raised 3D Spot UV.
- **Brochures & Flyers:** Bi-fold, tri-fold, and custom die-cut marketing materials.
- **Product Catalogues:** Saddle-stitched and perfect-bound company catalogues.
- **Corporate Stationery:** Official letterheads, customized envelopes, and presentation folders.`;
    }

    // 11. Artwork & Pre-Press Preparation
    if (q.includes('cmyk') || q.includes('rgb') || q.includes('artwork') || q.includes('file') || q.includes('format') || q.includes('dpi') || q.includes('bleed') || q.includes('resolution')) {
      return `🎨 **Artwork & Pre-Press Design Guidelines:**

To achieve optimal color fidelity on our Japanese offset press:

- **Color Mode:** Always convert artwork from RGB to **CMYK**.
- **Resolution:** Minimum **300 DPI** for ultra-sharp detail.
- **Bleed Margin:** Include a **3mm bleed margin** around all edges.
- **File Formats:** High-resolution PDF (Press Ready), AI, CDR, EPS, or TIFF.

Our pre-press team reviews every artwork file free of charge before printing!`;
    }

    // 12. Location & Store Hours
    if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('ahmedabad') || q.includes('hours') || q.includes('open') || q.includes('map') || q.includes('contact')) {
      return `📍 **Shahji Printers Location & Working Hours:**

- **Address:** 123 Print Avenue, Industrial Estate, Ahmedabad, Gujarat 380015, India
- **Working Hours:** Monday to Saturday: 10:00 AM - 7:30 PM (Sunday Closed)
- **Phone / WhatsApp:** +91 81403 40410
- **Email:** printshahji@gmail.com

We welcome client visits to our press for print sample approvals and packaging consultations!`;
    }

    // 13. Thank You / Polite Exit
    if (q.includes('thank') || q.includes('thanks') || q.includes('shukriya') || q.includes('dhanyawad') || q.includes('great') || q.includes('good')) {
      return `🙏 **You are most welcome!**

It is our absolute privilege to assist you. If you have any further questions or require a custom quote, please feel free to reach us anytime on WhatsApp at **${CONFIG.phone}**. 

Have a wonderful day!`;
    }

    // Default friendly, respectful, and informative response
    return `🙏 **Welcome to Shahji Printers!**

Respected Client, we are Ahmedabad's premier multi-colour offset printing and packaging press. We specialize in:
- 📦 **Custom Packaging Boxes & Mono Cartons**
- 🎨 **3D Spot UV, Lamination & Gold Foiling**
- ⚙️ **Japanese 5-Colour Offset Job Works**
- 📑 **Brochures, Catalogues & Business Cards**

How may I respectfully resolve your query today? Feel free to ask any doubt or contact us directly at **${CONFIG.phone}**!`;
  }

  // Append Chat Bubble to DOM
  function appendMessage(text, sender, showContactActions = false) {
    const chatBody = document.getElementById('shahjiChatBody');
    const msgDiv = document.createElement('div');
    msgDiv.className = `shahji-msg ${sender}`;

    const formattedText = formatMarkdown(text);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let actionBtnsHtml = '';
    if (sender === 'bot') {
      const lower = text.toLowerCase();
      if (showContactActions || lower.includes('contact') || lower.includes('quote') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('price') || lower.includes('configurator')) {
        actionBtnsHtml = `
          <div class="shahji-bot-actions">
            <a href="tel:${CONFIG.phone.replace(/\s+/g, '')}" class="shahji-bot-btn call">
              <i class="fas fa-phone"></i> Call ${CONFIG.phone}
            </a>
            <a href="https://wa.me/${CONFIG.whatsapp}?text=Hi%20Shahji%20Printers,%20I%20have%20a%20printing%20query" target="_blank" class="shahji-bot-btn whatsapp">
              <i class="fab fa-whatsapp"></i> WhatsApp Quote
            </a>
            <a href="${CONFIG.configuratorUrl}" class="shahji-bot-btn configurator">
              <i class="fas fa-sliders-h"></i> Live Configurator
            </a>
          </div>
        `;
      }
    }

    msgDiv.innerHTML = `
      <div class="shahji-msg-content">
        ${formattedText}
        ${actionBtnsHtml}
      </div>
      <span class="shahji-msg-time">${timeStr}</span>
    `;

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Markdown Formatter supporting bold, italics, bullet lists, links
  function formatMarkdown(str) {
    if (!str) return '';
    let html = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Markdown Links [Text](URL)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="shahji-inline-link">$1</a>');

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert bullet point lists
    const lines = html.split('\n');
    let inList = false;
    let result = '';

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          result += '<ul class="shahji-chat-list">';
          inList = true;
        }
        result += `<li>${trimmed.substring(2)}</li>`;
      } else {
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        result += line + '<br>';
      }
    });

    if (inList) {
      result += '</ul>';
    }

    // Clean up trailing <br> after lists
    result = result.replace(/<\/ul><br>/g, '</ul>');
    return result;
  }

  // Typing Indicator Controls
  function showTypingIndicator() {
    const chatBody = document.getElementById('shahjiChatBody');
    if (document.getElementById('shahjiTyping')) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'shahji-msg bot';
    typingDiv.id = 'shahjiTyping';
    typingDiv.innerHTML = `
      <div class="shahji-typing-indicator">
        <span></span><span></span><span></span>
        <span class="shahji-typing-text">Shahji AI is thinking...</span>
      </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingDiv = document.getElementById('shahjiTyping');
    if (typingDiv) typingDiv.remove();
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotUI);
  } else {
    initChatbotUI();
  }

})();
