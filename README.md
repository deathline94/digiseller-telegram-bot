# 🤖 Digiseller Telegram Bot

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Telegram Bot](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![Digiseller](https://img.shields.io/badge/Digiseller-00A8FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIyQzE3LjUyMjggMjIgMjIgMTcuNTIyOCAyMiAxMkMyMiA2LjQ3NzE1IDE3LjUyMjggMiAxMiAyQzYuNDc3MTUgMiAyIDYuNDc3MTUgMiAxMkMyIDE3LjUyMjggNi40NzcxNSAyMiAxMiAyMloiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K&logoColor=white)

**A powerful webhook-powered Telegram bot for Digiseller sellers to receive real-time notifications about sales and messages.**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🔧 Configuration](#-configuration) • [🌐 Deployment](#-deployment)

</div>

---

## ✨ Features

- 🔔 **Real-time Sale Notifications** - Get instant alerts when someone purchases your products
- 💬 **Message Notifications** - Receive notifications for new customer messages and support requests
- 🛡️ **Secure SHA256 Verification** - Validates webhook authenticity using Digiseller's signature system
- 🏪 **Multi-Store Support** - Automatically detects sales from different marketplaces (plati.market, ggsel, wmarketcentral)
- 📊 **Rich Information Display** - Shows product details, stock levels, buyer information, and more
- 🌍 **CORS Support** - Ready for cross-origin requests
- ⚡ **Serverless Ready** - Optimized for Cloudflare Workers and other serverless platforms
- 🎯 **Simple Configuration** - All settings in one file, no complex environment setup needed

## 🎯 What You'll Get

### 💎 Sale Notifications
```
💎 New Sale!
Order ID: 12345
Product: Premium Software License (ID: 67890)
Amount: 29.99 USD
Buyer: customer@example.com
Store: plati.market
Remaining Stock: 15
Date: 2024-01-15T10:30:00Z
IP: 192.168.1.1
```

### 📩 Message Notifications
```
📩 New Message!
Dialog ID: 98765
Message ID: 543210
From: Buyer (customer@example.com)
Message: Hi, I have a question about the product...
Date: 2024-01-15T10:35:00Z
```

## 🚀 Quick Start

### Prerequisites
- Telegram Bot Token (get from [@BotFather](https://t.me/botfather))
- Telegram Chat ID (your chat with the bot)
- Digiseller Seller Account with API access
- Cloudflare Workers account (free tier available)

### 1. Clone the Repository
```bash
git clone https://github.com/deathline94/digiseller-telegram-bot.git
cd digiseller-telegram-bot
```

### 2. Configure Your Credentials
Open `main.js` and update the configuration section (lines 17-20) with your actual values:

```javascript
// Configuration - Update these values with your actual credentials
const BOT_TOKEN = 'YOUR_ACTUAL_TELEGRAM_BOT_TOKEN';
const CHAT_ID = 'YOUR_ACTUAL_TELEGRAM_CHAT_ID';
const DIGISELLER_PASSWORD = 'YOUR_ACTUAL_DIGISELLER_PASSWORD';
const SELLER_ID = 'YOUR_ACTUAL_DIGISELLER_SELLER_ID';
```

**⚠️ Important:** Replace the placeholder values with your real credentials before deployment.

### 3. Deploy to Cloudflare Workers
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

## 🔧 Configuration

### Setting Up Your Credentials

You'll need to gather these four pieces of information:

| Credential | Where to Get It | Example Format |
|------------|-----------------|----------------|
| **BOT_TOKEN** | [@BotFather](https://t.me/botfather) → `/newbot` | `1234567890:ABCDEFghijklmnopQRSTUVwxyz` |
| **CHAT_ID** | Start chat with bot → `/getUpdates` API | `123456789` or `-123456789` |
| **DIGISELLER_PASSWORD** | Your Digiseller account password | `your_password` |
| **SELLER_ID** | Digiseller seller panel → Profile | `12345` |

### Getting Your Telegram Chat ID

1. **Start a chat with your bot**
2. **Send any message to the bot**
3. **Visit this URL in your browser:**
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
4. **Find your chat ID in the JSON response** (look for `"chat":{"id":123456789}`)

### Setting Up Webhooks in Digiseller

1. **Log into your Digiseller seller panel**
2. **Go to Settings → Webhooks**
3. **Add webhook URLs:**
   - **Sale notifications:** `https://your-worker.your-subdomain.workers.dev/webhook/sale`
   - **Message notifications:** `https://your-worker.your-subdomain.workers.dev/webhook/message`

### Telegram Bot Setup

1. **Create a bot:** Message [@BotFather](https://t.me/botfather) and use `/newbot`
2. **Get your token:** BotFather will provide your bot token
3. **Update main.js:** Replace `'TELEGRAM BOT TOKEN'` with your actual token

## 🌐 Deployment Options

### Cloudflare Workers (Recommended)
- ✅ **Free tier available** (100,000 requests/day)
- ✅ **Global edge network** for low latency
- ✅ **Easy deployment** with Wrangler CLI
- ✅ **No environment variable setup needed**

### Alternative Platforms

| Platform | Pros | Cons | Free Tier |
|----------|------|------|-----------|
| **Vercel** | Easy deployment, good DX | Cold starts | Yes (hobby) |
| **Netlify** | Simple setup, good docs | Function limits | Yes |
| **AWS Lambda** | Highly scalable, powerful | Complex setup | Yes (limited) |
| **Railway** | Simple deployment | Paid after trial | $5 credit |
| **Deno Deploy** | Modern runtime, TypeScript | Smaller ecosystem | Yes |

## 📁 File Structure

```
digiseller-telegram-bot/
├── main.js              # Main worker script (contains all config)
├── README.md           # This file
└── wrangler.toml       # Cloudflare Workers config
```

## 🛡️ Security Features

- **SHA256 Signature Verification** - Validates all incoming webhooks
- **Simple Configuration** - All credentials in one place for easy management
- **CORS Protection** - Configurable cross-origin policies
- **Request Validation** - Checks webhook authenticity

## 🔍 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook/sale` | POST | Receives sale notifications from Digiseller |
| `/webhook/message` | POST | Receives message notifications from Digiseller |
| `/` | GET | Health check endpoint |

## 📊 Supported Data Fields

### Sale Webhooks
- Order ID, Product ID, Amount, Currency
- Buyer email, Purchase date, IP address
- Product name and stock information
- Store/marketplace detection

### Message Webhooks
- Dialog ID, Message ID, Message content
- Sender identification (Buyer/Seller)
- Timestamp and image attachments
- Email addresses when available

## 🎨 Customization

### Modifying Configuration
Simply edit the values at the top of `main.js`:

```javascript
// Easy configuration - just update these four lines!
const BOT_TOKEN = 'your_bot_token_here';
const CHAT_ID = 'your_chat_id_here';
const DIGISELLER_PASSWORD = 'your_password_here';
const SELLER_ID = 'your_seller_id_here';
```

### Customizing Message Templates
Edit the message templates in `main.js`:

```javascript
// Sale notification template (around line ~149)
const message = `<b>💎 New Sale!</b>\n` +
  `<b>Order ID:</b> ${orderId}\n` +
  // ... customize as needed

// Message notification template (around line ~180)
const message = `<b>📩 New Message!</b>\n` +
  `<b>Dialog ID:</b> ${debateId}\n` +
  // ... customize as needed
```

### Adding New Marketplaces
Extend the `getStoreName()` function to detect additional marketplaces:

```javascript
function getStoreName(referer, data) {
  // Add your marketplace detection logic
  if (referer.includes('yourstore.com')) return 'Your Store';
  // ... existing logic
}
```

## 🚨 Troubleshooting

### Common Issues

**Webhook not receiving data:**
- Check webhook URLs in Digiseller panel
- Verify credentials in `main.js` are correct
- Check worker logs in Cloudflare dashboard

**Telegram messages not sending:**
- Verify bot token is correct (copy-paste from BotFather)
- Ensure chat ID is valid (start a conversation with your bot first)
- Check if bot has permission to send messages

**Signature verification failing:**
- Confirm Digiseller password is exact (case-sensitive)
- Check if webhook is coming from legitimate Digiseller servers

### Testing Your Setup

1. **Test bot connection:**
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe
   ```

2. **Test webhook endpoint:**
   ```bash
   curl -X GET https://your-worker.your-subdomain.workers.dev/
   ```

### Debug Mode
Add logging to troubleshoot issues:

```javascript
console.log('Received data:', JSON.stringify(data, null, 2));
```

## ⚡ Why This Simple Approach?

- **🎯 No Complex Setup** - No environment variables or external configuration
- **📝 Easy Editing** - All settings in one file, easy to modify
- **🚀 Quick Deployment** - Clone, edit, deploy - that's it!
- **🔍 Transparent** - You can see exactly what values are being used
- **💾 Version Control Friendly** - Configuration is part of your code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

- 📧 **Issues:** [GitHub Issues](https://github.com/deathline94/digiseller-telegram-bot/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/deathline94/digiseller-telegram-bot/discussions)

---

<div align="center">

**Made with ❤️ for Digiseller sellers**

⭐ **Star this repository if it helped you!** ⭐

</div>
