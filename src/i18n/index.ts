import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        rememberMe: 'Remember me',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        noAccount: "Don't have an account? Sign Up",
        haveAccount: 'Already have an account? Sign In'
      },
      common: {
        name: 'Name',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success'
      },
      errors: {
        required: 'This field is required',
        invalidEmail: 'Invalid email address',
        minimumLength: 'Must be at least {{length}} characters',
        passwordMismatch: 'Passwords do not match'
      }
    }
  },
  ko: {
    translation: {
      auth: {
        login: '로그인',
        register: '회원가입',
        email: '이메일',
        password: '비밀번호',
        confirmPassword: '비밀번호 확인',
        rememberMe: '로그인 상태 유지',
        signIn: '로그인',
        signUp: '회원가입',
        noAccount: '계정이 없으신가요? 회원가입',
        haveAccount: '이미 계정이 있으신가요? 로그인'
      },
      common: {
        name: '이름',
        loading: '로딩 중...',
        error: '오류',
        success: '성공'
      },
      errors: {
        required: '필수 입력 항목입니다',
        invalidEmail: '올바른 이메일 주소를 입력해주세요',
        minimumLength: '최소 {{length}}자 이상 입력해주세요',
        passwordMismatch: '비밀번호가 일치하지 않습니다'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
