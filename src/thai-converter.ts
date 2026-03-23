/**
 * Thai text converter with various conversion methods
 */

import {
  QWERTY_TO_THAI,
  THAI_TO_QWERTY,
  containsThai,
  isLikelyWrongLayout
} from './keyboard-maps.js';

export interface ConversionResult {
  originalText: string;
  convertedText: string;
  conversionType: 'qwerty-to-thai' | 'thai-to-qwerty' | 'thai-correction' | 'no-conversion' | 'mixed';
  confidence: string;
  suggestions?: string[];
}

export class ThaiConverter {
  /**
   * Convert QWERTY typed text to Thai
   */
  qwertyToThai(text: string): string {
    return text.split('').map(char => QWERTY_TO_THAI[char] || char).join('');
  }

  /**
   * Convert Thai text to QWERTY (reverse)
   */
  thaiToQwerty(text: string): string {
    return text.split('').map(char => THAI_TO_QWERTY[char] || char).join('');
  }

  /**
   * Apply Thai text corrections (tone mark positioning only)
   */
  correctThai(text: string): string {
    // Fix tone mark positioning issues
    return this.fixToneMarks(text);
  }

  /**
   * Fix tone mark positioning in Thai text
   */
  private fixToneMarks(text: string): string {
    // This is a simplified version - real implementation would be more complex
    // Fix tone marks that should be on different characters
    return text
      .replace(/([กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ])([\u0E48-\u0E4B])/g, '$1$2')
      .replace(/(\u0E32)([\u0E48-\u0E4B])/g, '$2$1') // Move tone marks before long vowel
      .replace(/(\u0E34|\u0E35|\u0E36|\u0E37|\u0E47|\u0E4D)([\u0E48-\u0E4B])/g, '$2$1'); // Move tone marks before upper vowels
  }

  /**
   * Smart conversion that detects the best conversion method
   */
  smartConvert(text: string): ConversionResult {
    const originalText = text.trim();
    
    if (!originalText) {
      return {
        originalText,
        convertedText: originalText,
        conversionType: 'no-conversion',
        confidence: '100%'
      };
    }

    let convertedText = originalText;
    let conversionType: ConversionResult['conversionType'] = 'no-conversion';
    let confidence = '0%';
    const suggestions: string[] = [];

    // Check if text is likely typed with wrong keyboard layout
    if (isLikelyWrongLayout(originalText) && !containsThai(originalText)) {
      const qwertyConverted = this.qwertyToThai(originalText);
      convertedText = qwertyConverted;
      conversionType = 'qwerty-to-thai';
      confidence = this.calculateQwertyConfidence(originalText, qwertyConverted);
      
      // Also add corrected version as suggestion
      const corrected = this.correctThai(qwertyConverted);
      if (corrected !== qwertyConverted) {
        suggestions.push(corrected);
      }
    }
    // If text contains Thai, try to correct it
    else if (containsThai(originalText)) {
      const corrected = this.correctThai(originalText);
      if (corrected !== originalText) {
        convertedText = corrected;
        conversionType = 'thai-correction';
        confidence = '80%';
      } else {
        confidence = '100%';
      }
      
      // Also provide QWERTY version as alternative
      suggestions.push(this.thaiToQwerty(originalText));
    }
    // Mixed content
    else if (containsThai(originalText) && isLikelyWrongLayout(originalText)) {
      // Handle mixed Thai and English/symbols
      convertedText = this.handleMixedContent(originalText);
      conversionType = 'mixed';
      confidence = '60%';
    }

    return {
      originalText,
      convertedText,
      conversionType,
      confidence,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  /**
   * Handle mixed Thai and English content
   */
  private handleMixedContent(text: string): string {
    // Split text into segments and convert non-Thai segments
    const segments = text.split(/([\u0E00-\u0E7F]+)/);
    
    return segments.map(segment => {
      if (containsThai(segment)) {
        return this.correctThai(segment);
      } else if (isLikelyWrongLayout(segment)) {
        return this.qwertyToThai(segment);
      }
      return segment;
    }).join('');
  }

  /**
   * Calculate confidence score for QWERTY to Thai conversion
   */
  private calculateQwertyConfidence(original: string, converted: string): string {
    // Simple heuristic based on Thai character frequency and patterns
    const thaiCharCount = (converted.match(/[\u0E00-\u0E7F]/g) || []).length;
    const totalChars = converted.length;
    
    if (totalChars === 0) return '0%';
    
    const thaiRatio = thaiCharCount / totalChars;
    
    // Check for common Thai patterns
    const hasCommonThaiPatterns = /[เแโใไ][ก-ฮ]|[ก-ฮ][ะาิีึืุู]|[ก-ฮ][่้๊๋]/.test(converted);
    
    let confidence = thaiRatio * 70;
    if (hasCommonThaiPatterns) confidence += 20;
    if (thaiRatio > 0.8) confidence += 10;
    
    return Math.min(Math.round(confidence), 100) + '%';
  }

  /**
   * Get multiple conversion suggestions
   */
  getAllSuggestions(text: string): string[] {
    const suggestions = new Set<string>();
    
    // Add QWERTY to Thai conversion
    if (isLikelyWrongLayout(text)) {
      suggestions.add(this.qwertyToThai(text));
    }
    
    // Add Thai correction
    if (containsThai(text)) {
      suggestions.add(this.correctThai(text));
    }
    
    // Add Thai to QWERTY (reverse conversion)
    if (containsThai(text)) {
      suggestions.add(this.thaiToQwerty(text));
    }
    
    return Array.from(suggestions).filter(s => s !== text);
  }
}