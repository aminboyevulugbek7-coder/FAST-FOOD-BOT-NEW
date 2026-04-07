export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string) => Promise<boolean>;
        MainButton: {
          text: string;
          color: string;
          text_color: string;
          isVisible: boolean;
          isActive: boolean;
          onClick: (callback: Function) => void;
          offClick: (callback: Function) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          setText: (text: string) => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: Function) => void;
          offClick: (callback: Function) => void;
          show: () => void;
          hide: () => void;
        };
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          link_color: string;
          button_color: string;
          button_text_color: string;
        };
      };
    };
  }
}
