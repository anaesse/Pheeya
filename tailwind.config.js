module.exports = {
  content: ['./views/**/*.ejs', './assets/js/**/*.{js,ts,vue}'],
  theme: {
    extend: {
       fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"']
      },
      colors: {
        coral: {
          DEFAULT: '#FF6B6B',
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF8A8A',
          500: '#FF6B6B',
          600: '#FF5757',
          700: '#FF4757',
          800: '#E63946',
          900: '#C92A2A'
        },
        sage: {
          DEFAULT: '#95D5B2',
          50: '#F0FAF6',
          100: '#D3F9E3',
          200: '#A7F3C7',
          300: '#74E39A',
          400: '#45D483',
          500: '#95D5B2',
          600: '#52C41A',
          700: '#389E0D',
          800: '#237804',
          900: '#135200'
        },
        cream: {
          DEFAULT: '#FFF8F3',
          50: '#FFFCFA',
          100: '#FFF8F3',
          200: '#FFF2E8',
          300: '#FFEAD3',
          400: '#FFE0BA',
          500: '#FFD6A0',
          600: '#FFCC87',
          700: '#FFC26E',
          800: '#FFB855',
          900: '#FFAE3C'
        },
        charcoal: {
          DEFAULT: '#2D3748',
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923'
        },
        brand: {
          DEFAULT: '#6C25C1',
          50: '#CCAEEF',
          100: '#C19DEC',
          200: '#AB7BE6',
          300: '#9659DF',
          400: '#8036D9',
          500: '#6C25C1',
          600: '#521C92',
          700: '#371363',
          800: '#1D0A34',
          900: '#030105',
          950: '#000000'
        },
        green: {
          DEFAULT: '#49D489',
          50: '#DEF7E9',
          100: '#CDF3DF',
          200: '#ACEBC9',
          300: '#8BE4B4',
          400: '#6ADC9E',
          500: '#49D489',
          600: '#2CB96D',
          700: '#218C52',
          800: '#165E37',
          900: '#0C311D',
          950: '#061A0F'
        },
        gray: {
          DEFAULT: '#878787',
          50: '#E3E3E3',
          100: '#D9D9D9',
          200: '#C4C4C4',
          300: '#B0B0B0',
          400: '#9B9B9B',
          500: '#878787',
          600: '#6B6B6B',
          700: '#4F4F4F',
          800: '#333333',
          900: '#171717',
          950: '#090909'
        },
        black: {
          DEFAULT: '#333333',
          50: '#8F8F8F',
          100: '#858585',
          200: '#707070',
          300: '#5C5C5C',
          400: '#474747',
          500: '#333333',
          600: '#171717',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000'
        }
      }
    }
  },
  plugins: []
}
