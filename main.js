addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const BOT_TOKEN = 'TELEGRAM BOT TOKEN';
  const CHAT_ID = 'TELEGRAM CHAT ID';
  const DIGISELLER_PASSWORD = 'DIGISELLER PASSWORD';
  const SELLER_ID = 'DIGISELLER SELLER ID';

  const url = new URL(request.url);
  const path = url.pathname;

  let data = {};
  if (request.method === 'POST') {
    const contentType = request.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
    }
  }
  // For GET or fallback, parse query params
  const queryData = Object.fromEntries(url.searchParams);
  data = { ...queryData, ...data }; // Merge query with body data

  function createResponse(body, status = 200) {
    return new Response(body, {
      status: status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
    });
  }

  async function verifySha256(data) {
    const id_i = data.ID_I || data.id_i || data.inv || 'N/A';
    const id_d = data.ID_D || data.id_d || data.product_id || 'N/A';
    const signature = data.SHA256 || data.sha256 || data.sign || '';
    if (!signature) return true;
    const expected = Array.from(
      new Uint8Array(
        await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(`${DIGISELLER_PASSWORD.toLowerCase()};${id_i};${id_d}`)
        )
      )
    ).map(b => b.toString(16).padStart(2, '0')).join('');
    return expected === signature;
  }

  async function getProductInfo(productId) {
    if (!productId || productId === 'N/A') return { name: 'Unknown Product', remaining: 'N/A' };
    try {
      const response = await fetch(
        `https://api.digiseller.com/api/products/${productId}/data?currency=USD&lang=en-US`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (!response.ok) return { name: 'Unknown Product', remaining: 'N/A' };
      const product = await response.json();
      return {
        name: product.product?.name || 'Unknown Product',
        remaining: product.product?.num_in_stock || 'N/A'
      };
    } catch (e) {
      return { name: 'Unknown Product', remaining: 'N/A' };
    }
  }

  function getStoreName(referer, data) {
    // 1. Check referer field (from payload or headers)
    if (referer) {
      if (referer.includes('plati.market')) return 'plati.market';
      if (referer.includes('ggsel')) return 'ggsel';
      if (referer.includes('wmarketcentral')) return 'wmarketcentral';
    }
    // 2. Check AGENT field (common in Digiseller GET/POST)
    if (data.AGENT && typeof data.AGENT === 'string') {
      if (data.AGENT.includes('plati.market')) return 'plati.market';
      if (data.AGENT.includes('ggsel')) return 'ggsel';
      if (data.AGENT.includes('wmarketcentral')) return 'wmarketcentral';
    }
    // 3. Check THROUGH/base64 param for store hints
    if (data.THROUGH) {
      try {
        const decoded = atob(data.THROUGH);
        if (decoded.includes('plati')) return 'plati.market';
        if (decoded.includes('ggsel')) return 'ggsel';
        if (decoded.includes('wmarket')) return 'wmarketcentral';
      } catch (e) {}
    }
    // 4. Check for additional possible fields or patterns (enhanced detection)
    if (data.referer || data.REFERER) {
      const ref = (data.referer || data.REFERER).toLowerCase();
      if (ref.includes('plati.market')) return 'plati.market';
      if (ref.includes('ggsel')) return 'ggsel';
      if (ref.includes('wmarketcentral')) return 'wmarketcentral';
    }
    return 'Direct'; // Better default than 'Unknown Store'
  }

  async function sendTelegramMessage(text) {
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });
  }

  if (path === '/webhook/sale') {
    if (!(await verifySha256(data))) {
      return createResponse('Invalid signature', 403);
    }

    const orderId = data.ID_I || data.id_i || data.inv || 'Unknown';
    const productId = data.ID_D || data.id_d || data.product_id || 'Unknown';
    const amount = data.Amount || data.amount || data.sum || 'Unknown';
    const currency = data.Currency || data.curr || data.currency_pay || 'Unknown';
    const buyerEmail = data.Email || data.email || 'Unknown';
    const date = data.Date || data.date || data.date_pay || new Date().toISOString();
    const ip = data.IP || data.ip || request.headers.get('cf-connecting-ip') || 'Unknown';
    const referer = data.REFERER || data.referer || request.headers.get('referer') || '';

    const productInfo = await getProductInfo(productId);
    const storeName = getStoreName(referer, data);

    const message = `<b>💎 New Sale!</b>\n` +
      `<b>Order ID:</b> ${orderId}\n` +
      `<b>Product:</b> ${productInfo.name} (ID: ${productId})\n` +
      `<b>Amount:</b> ${amount} ${currency}\n` +
      `<b>Buyer:</b> ${buyerEmail}\n` +
      `<b>Store:</b> ${storeName}\n` +
      `<b>Remaining Stock:</b> ${productInfo.remaining}\n` +
      `<b>Date:</b> ${date}\n` +
      `<b>IP:</b> ${ip}`;

    await sendTelegramMessage(message);
    return createResponse('Sale processed');
  }

  if (path === '/webhook/message') {
    const debateId = data.DebateId || data.debateid || 'Unknown';
    const messageId = data.MessageId || data.messageid || 'Unknown';
    const messageText = data.Message || data.MessageText || data.Content || data.Text || data.message || data.content || '';
    
    // Always send notification regardless of message content
    const sender = (data.OwnerId === SELLER_ID) ? 'Seller' : 'Buyer';
    const messageDate = data.MessageDate || new Date().toISOString();
    const imagePath = data.ImagePath && data.ImagePath !== '' ? `<a href="${data.ImagePath}">View Image</a>` : '';
    
    // Show [Empty Message - Check webhook payload] if no content for debugging
    const displayMessage = messageText.trim() || '[Empty Message - Check webhook payload]';
    
    // Add sender email if available
    const senderEmail = data.Email || data.email || '';
    const fromText = `${sender}${senderEmail ? ` (${senderEmail})` : ''}`;
    
    const message = `<b>📩 New Message!</b>\n` +
      `<b>Dialog ID:</b> ${debateId}\n` +
      `<b>Message ID:</b> ${messageId}\n` +
      `<b>From:</b> ${fromText}\n` +
      `<b>Message:</b> ${displayMessage}\n` +
      (imagePath ? `<b>Image:</b> ${imagePath}\n` : '') +
      `<b>Date:</b> ${messageDate}`;
    
    await sendTelegramMessage(message);
    return createResponse('Message processed');
  }

  return createResponse('Digiseller Webhook Worker is running');
}
