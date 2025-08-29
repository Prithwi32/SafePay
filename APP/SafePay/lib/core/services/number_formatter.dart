import 'package:intl/intl.dart';

class NumberFormatter {
  static final _numberFormat = NumberFormat('#,##,###.##');

  // English number to words
  static String _englishNumberToWords(num number) {
    if (number == 0) return 'zero';

    final units = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen'
    ];
    final tens = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety'
    ];

    String convertLessThanThousand(int n) {
      if (n == 0) return '';
      if (n < 20) return units[n];
      if (n < 100) {
        return '${tens[n ~/ 10]}${n % 10 > 0 ? ' ' + units[n % 10] : ''}';
      }
      return '${units[n ~/ 100]} hundred${n % 100 > 0 ? ' and ' + convertLessThanThousand(n % 100) : ''}';
    }

    String convert(num n) {
      if (n < 1000) return convertLessThanThousand(n.toInt());
      if (n < 100000) {
        return '${convertLessThanThousand((n ~/ 1000))} thousand${n % 1000 > 0 ? ' ' + convertLessThanThousand((n % 1000).toInt()) : ''}';
      }
      if (n < 10000000) {
        return '${convertLessThanThousand((n ~/ 100000))} lakh${n % 100000 > 0 ? ' ' + convert(n % 100000) : ''}';
      }
      return '${convertLessThanThousand((n ~/ 10000000))} crore${n % 10000000 > 0 ? ' ' + convert(n % 10000000) : ''}';
    }

    String result = convert(number);
    return result.trim();
  }

  // Hindi number to words
  static String _hindiNumberToWords(num number) {
    final units = [
      '',
      'एक',
      'दो',
      'तीन',
      'चार',
      'पाँच',
      'छह',
      'सात',
      'आठ',
      'नौ',
      'दस',
      'ग्यारह',
      'बारह',
      'तेरह',
      'चौदह',
      'पंद्रह',
      'सोलह',
      'सत्रह',
      'अठारह',
      'उन्नीस'
    ];
    final tens = [
      '',
      'दस',
      'बीस',
      'तीस',
      'चालीस',
      'पचास',
      'साठ',
      'सत्तर',
      'अस्सी',
      'नब्बे'
    ];

    String convertLessThanThousand(int n) {
      if (n == 0) return '';
      if (n < 20) return units[n];
      if (n < 100) {
        return '${tens[n ~/ 10]}${n % 10 > 0 ? ' ' + units[n % 10] : ''}';
      }
      return '${units[n ~/ 100]} सौ${n % 100 > 0 ? ' ' + convertLessThanThousand(n % 100) : ''}';
    }

    String convert(num n) {
      if (n == 0) return 'शून्य';
      if (n < 1000) return convertLessThanThousand(n.toInt());
      if (n < 100000) {
        return '${convertLessThanThousand((n ~/ 1000))} हज़ार${n % 1000 > 0 ? ' ' + convertLessThanThousand((n % 1000).toInt()) : ''}';
      }
      if (n < 10000000) {
        return '${convertLessThanThousand((n ~/ 100000))} लाख${n % 100000 > 0 ? ' ' + convert(n % 100000) : ''}';
      }
      return '${convertLessThanThousand((n ~/ 10000000))} करोड़${n % 10000000 > 0 ? ' ' + convert(n % 10000000) : ''}';
    }

    return convert(number);
  }

  // Kannada number to words
  static String _kannadaNumberToWords(num number) {
    final units = [
      '',
      'ಒಂದು',
      'ಎರಡು',
      'ಮೂರು',
      'ನಾಲ್ಕು',
      'ಐದು',
      'ಆರು',
      'ಏಳು',
      'ಎಂಟು',
      'ಒಂಬತ್ತು',
      'ಹತ್ತು',
      'ಹನ್ನೊಂದು',
      'ಹನ್ನೆರಡು',
      'ಹದಿಮೂರು',
      'ಹದಿನಾಲ್ಕು',
      'ಹದಿನೈದು',
      'ಹದಿನಾರು',
      'ಹದಿನೇಳು',
      'ಹದಿನೆಂಟು',
      'ಹತ್ತೊಂಬತ್ತು'
    ];

    String convert(num n) {
      if (n == 0) return 'ಸೊನ್ನೆ';
      if (n < 20) return units[n.toInt()];
      if (n < 100) {
        final tens = (n ~/ 10).toInt();
        final ones = (n % 10).toInt();
        if (ones == 0) {
          return [
            'ಹತ್ತು',
            'ಇಪ್ಪತ್ತು',
            'ಮೂವತ್ತು',
            'ನಲವತ್ತು',
            'ಐವತ್ತು',
            'ಅರವತ್ತು',
            'ಎಪ್ಪತ್ತು',
            'ಎಂಬತ್ತು',
            'ತೊಂಬತ್ತು'
          ][tens - 1];
        }
        return '${[
          'ಹದಿ',
          'ಇಪ್ಪತ್ತ',
          'ಮೂವತ್ತ',
          'ನಲವತ್ತ',
          'ಐವತ್ತ',
          'ಅರವತ್ತ',
          'ಎಪ್ಪತ್ತ',
          'ಎಂಬತ್ತ',
          'ತೊಂಬತ್ತ'
        ][tens - 1]}${units[ones]}';
      }
      if (n < 1000) {
        return '${units[n ~/ 100]} ನೂರು${n % 100 > 0 ? ' ' + convert(n % 100) : ''}';
      }
      if (n < 100000) {
        return '${convert(n ~/ 1000)} ಸಾವಿರ${n % 1000 > 0 ? ' ' + convert(n % 1000) : ''}';
      }
      if (n < 10000000) {
        return '${convert(n ~/ 100000)} ಲಕ್ಷ${n % 100000 > 0 ? ' ' + convert(n % 100000) : ''}';
      }
      return '${convert(n ~/ 10000000)} ಕೋಟಿ${n % 10000000 > 0 ? ' ' + convert(n % 10000000) : ''}';
    }

    return convert(number);
  }

  // Convert amount to words based on language code
  static String convertToWords(String amount, String languageCode) {
    try {
      final num value = num.parse(amount);
      final int rupees = value.truncate();
      final int paise = ((value - rupees) * 100).round();

      switch (languageCode) {
        case 'hi':
          String result = _hindiNumberToWords(rupees) + ' रुपये';
          if (paise > 0) {
            result += ' और ' + _hindiNumberToWords(paise) + ' पैसे';
          }
          return result;

        case 'kn':
          String result = _kannadaNumberToWords(rupees) + ' ರೂಪಾಯಿ';
          if (paise > 0) {
            result += ' ಮತ್ತು ' + _kannadaNumberToWords(paise) + ' ಪೈಸೆ';
          }
          return result;

        case 'bn':
          // Bengali implementation can be added here
          return _englishNumberToWords(rupees) +
              ' rupees' +
              (paise > 0
                  ? ' and ' + _englishNumberToWords(paise) + ' paise'
                  : '');

        case 'ta':
          // Tamil implementation can be added here
          return _englishNumberToWords(rupees) +
              ' rupees' +
              (paise > 0
                  ? ' and ' + _englishNumberToWords(paise) + ' paise'
                  : '');

        case 'te':
          // Telugu implementation can be added here
          return _englishNumberToWords(rupees) +
              ' rupees' +
              (paise > 0
                  ? ' and ' + _englishNumberToWords(paise) + ' paise'
                  : '');

        case 'mr':
          // Marathi implementation can be added here
          return _englishNumberToWords(rupees) +
              ' rupees' +
              (paise > 0
                  ? ' and ' + _englishNumberToWords(paise) + ' paise'
                  : '');

        default:
          String result = _englishNumberToWords(rupees) + ' rupees';
          if (paise > 0) {
            result += ' and ' + _englishNumberToWords(paise) + ' paise';
          }
          return result;
      }
    } catch (e) {
      return amount;
    }
  }
}
