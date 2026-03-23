/**
 * MCP Server for Thai Text Conversion
 * Provides tools for converting Thai text and fixing keyboard layout issues
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { ThaiConverter, type ConversionResult } from './thai-converter.js'

// Create Hono app
const app = new Hono()
app.use(cors());

// Create converter instance (shared, stateless)
const converter = new ThaiConverter()

// Conversion mode schema (reused across tools)
const ConversionModeSchema = z
  .enum(['smart', 'qwerty-to-thai', 'thai-to-qwerty', 'correct-thai'])
  .default('smart')

// Helper: run conversion by mode
function convertByMode(text: string, mode: string): ConversionResult {
  switch (mode) {
    case 'smart':
      return converter.smartConvert(text)

    case 'qwerty-to-thai':
      return {
        originalText: text,
        convertedText: converter.qwertyToThai(text),
        conversionType: 'qwerty-to-thai',
        confidence: '80%',
      }

    case 'thai-to-qwerty':
      return {
        originalText: text,
        convertedText: converter.thaiToQwerty(text),
        conversionType: 'thai-to-qwerty',
        confidence: '80%',
      }

    case 'correct-thai': {
      const corrected = converter.correctThai(text)
      return {
        originalText: text,
        convertedText: corrected,
        conversionType: corrected !== text ? 'thai-correction' : 'no-conversion',
        confidence: corrected !== text ? '80%' : '100%',
      }
    }

    default:
      throw new Error(`Unknown conversion mode: ${mode}`)
  }
}

// Factory: create new MCP server instance with tools
function createMcpServer() {
  const server = new McpServer({
    name: 'mcp-text-thai',
    version: 'v1',
  })

  // Tool 1: convert_thai_text
  server.tool(
    'convert_thai_text',
    'Convert Thai text using smart detection (QWERTY to Thai, Thai corrections, etc.)',
    {
      text: z.string().describe(
        'Text to convert (QWERTY mixed with Thai, Thai text needing correction, etc.)'
      ),
      mode: ConversionModeSchema.describe(
        'Conversion mode: smart (auto-detect), qwerty-to-thai, thai-to-qwerty, or correct-thai'
      ),
    },
    async ({ text, mode }) => {
      const result = convertByMode(text, mode)
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      }
    }
  )

  // Tool 2: get_thai_suggestions
  server.tool(
    'get_thai_suggestions',
    'Get multiple conversion suggestions for Thai text',
    {
      text: z.string().describe('Text to get conversion suggestions for'),
    },
    async ({ text }) => {
      const suggestions = converter.getAllSuggestions(text)
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ originalText: text, suggestions }, null, 2),
          },
        ],
      }
    }
  )

  // Tool 3: batch_convert_thai
  server.tool(
    'batch_convert_thai',
    'Convert multiple Thai text pieces at once',
    {
      texts: z.array(z.string()).describe('Array of texts to convert'),
      mode: ConversionModeSchema.describe('Conversion mode applied to all texts'),
    },
    async ({ texts, mode }) => {
      const results = texts.map((text) => {
        try {
          return convertByMode(text, mode)
        } catch (error) {
          return {
            originalText: text,
            error: error instanceof Error ? error.message : String(error),
          }
        }
      })

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ mode, results }, null, 2),
          },
        ],
      }
    }
  )

  return server
}

// HTTP endpoint: create MCP server instance per request (stateless)
app.all('/mcp', async (c) => {
  const server = createMcpServer()
  const transport = new WebStandardStreamableHTTPServerTransport()
  await server.connect(transport)

  return transport.handleRequest(c.req.raw)
})

// Start HTTP server
const PORT = Number(process.env.PORT) || 3000

export default {
  port: PORT,
  fetch: app.fetch,
}

console.error(`MCP Server listening on port ${PORT}/mcp`)
