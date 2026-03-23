# MCP Text Thai

**MCP Text Thai** is MCP server for converting Thai text and fixing keyboard layout issues.

https://github.com/user-attachments/assets/e5ce2167-ef61-4472-86fa-d8e45c8181dc

## Features

- **QWERTY to Thai**: Fix text typed with wrong keyboard layout
- **Thai Correction**: Improve spelling, tone marks, and writing style
- **Smart Detection**: Auto-detect and convert based on context
- **Suggestions**: Get multiple conversion options
- **Batch Processing**: Convert multiple texts at once

## Benefits

- Convert Thai text typed with the wrong keyboard layout (TH → EN)
- No need to retype the text
- Copy and paste the corrected text instantly

## Requirements

- [Bun](https://bun.com/) runtime (Node.js-compatible JavaScript runtime)
- An active AI provider subscription that allows **custom MCP configuration** (e.g. [ChatGPT](https://chatgpt.com/), [Claude](https://claude.ai/), or others)
- An AI model that supports **reasoning (thinking)** and **MCP tool usage**

> **Alternatively**, an IDE or editor extension that supports MCP  
  (e.g. [Cline](https://cline.bot/), or any MCP-compatible extension in your IDE)

## Installation

```bash
bun install
bun run dev
```

## Usage

Add to your MCP config:

```json
{
  "mcpServers": {
    "mcp-text-thai": {
      "type": "http",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## MCP Endpoint

You can use the MCP Text Thai server for free via the public endpoint below:

- **URL:** http://mcp-text-thai.thefactlab.org/mcp
- **Type:** HTTP MCP Server
- **Cost:** Free (no subscription required)

### Example MCP Config

```json
{
  "mcpServers": {
    "mcp-text-thai": {
      "type": "http", // or "streamableHttp" for Cline extension
      "url": "http://mcp-text-thai.thefactlab.org/mcp"
    }
  }
}
```

> ⚠️ Note:
The free public endpoint is intended for testing and light usage.
For production or high-throughput workloads, it is recommended to run your own instance.

<br/>

## Available Tools

### 1. `convert_thai_text`
Convert Thai text with auto-detection.

**Parameters:**
- `text` (string): Text to convert
- `mode` (string, optional): Conversion mode
  - `smart` (default): Auto-detect
  - `qwerty-to-thai`: Convert QWERTY to Thai
  - `thai-to-qwerty`: Convert Thai to QWERTY
  - `correct-thai`: Correct Thai text

**Example:**
```json
{
  "text": "l;ylfu8iy[",
  "mode": "smart"
}
```

**Response:**
```json
{
  "originalText": "l;ylfu8iy[",
  "convertedText": "สวัสดีครับ",
  "conversionType": "qwerty-to-thai",
  "confidence": 80%,
  "suggestions": ["สวัสดีครับ"]
}
```

### 2. `get_thai_suggestions`
Get multiple conversion suggestions.

**Parameters:**
- `text` (string): Text to get suggestions for

**Example:**
```json
{
  "text": "=j;pg-upo ฟยร c[[ หรทยสำ fh;p4kKk เน .shsojvplb"
}
```

**Response:**
```json
{
  "originalText": "=j;pg-upo ฟยร c[[ หรทยสำ fh;p4kKk เน .shsojvplb",
  "suggestions": [
    "ช่วยเขียน ฟยร แบบ หรทยสำ ด้วยภาษา เน ให้หน่อยสิ",
    "=j;pg-upo api c[[ simple fh;p4kKk go \"shsojvplb"
  ]
}
```

### 3. `batch_convert_thai`
Convert multiple texts at once.

**Parameters:**
- `texts` (array): Array of texts to convert
- `mode` (string, optional): Conversion mode for all texts

**Example:**
```json
{
  "texts": ["l;ylfu8iy[", "-v[86I8iy[",
  "mode": "smart"
}
```

**Response:**
```json
{
  "mode": "smart",
  "results": [
    {
      "originalText": "l;ylfu -v[86I",
      "convertedText": "สวัสดี ขอบคุณ",
      "conversionType": "qwerty-to-thai",
      "confidence": "95%"
    }
  ]
}
```

<br/>

## Additionals

### Keyboard Layout Correction
Input: `l;ylfu8iy[` (intended "สวัสดีครับ" but typed in English mode) <br/>
Output: `สวัสดีครับ`

### Keyboard Mapping

Standard QWERTY to Thai layout mapping:

| QWERTY | Thai | QWERTY | Thai |
|--------|------|--------|------|
| q | ๆ | w | ไ |
| e | ำ | r | พ |
| t | ะ | y | ั |
| u | ี | i | ร |
| o | น | p | ย |
| [ | บ | ] | ล |
| / | ฌ | ... | ... |

### Limitations

- Thai correction is currently basic
- Advanced NLP features not yet implemented
- Confidence score uses simple calculation

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

---

Built with ❤️ for Thai users & developers who frequently mistype keyboard layouts!
