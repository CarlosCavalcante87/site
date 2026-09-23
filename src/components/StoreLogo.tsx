import React from 'react';
import { StoreType } from '../types';

interface StoreLogoProps {
  store: StoreType | 'Todas';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const StoreLogo: React.FC<StoreLogoProps> = ({
  store,
  size = 'md',
  showName = false,
  className = '',
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'xs':
        return { iconSize: 'w-3.5 h-3.5', height: 'h-4' };
      case 'sm':
        return { iconSize: 'w-4 h-4', height: 'h-5' };
      case 'lg':
        return { iconSize: 'w-7 h-7', height: 'h-8' };
      case 'md':
      default:
        return { iconSize: 'w-5 h-5', height: 'h-6' };
    }
  };

  const { iconSize } = getDimensions();

  const renderIcon = () => {
    switch (store) {
      case 'Shopee':
        return (
          <svg
            className={`${iconSize} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Shopee Orange Shopping Bag with Handle & S */}
            <path
              d="M19 8H5L4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20L19 8Z"
              fill="#EE4D2D"
            />
            <path
              d="M8.5 8V6C8.5 4.067 10.067 2.5 12 2.5C13.933 2.5 15.5 4.067 15.5 6V8"
              stroke="#EE4D2D"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* White 'S' inside */}
            <path
              d="M13.8 11.8C13.6 11.3 13.1 11.1 12.5 11.1C11.8 11.1 11.2 11.4 11.2 12C11.2 12.5 11.6 12.7 12.4 13C13.5 13.4 14.3 13.9 14.3 15C14.3 16.2 13.3 16.9 12 16.9C10.7 16.9 9.8 16.2 9.7 15.1H10.9C11 15.6 11.5 15.9 12.1 15.9C12.8 15.9 13.2 15.6 13.2 15C13.2 14.5 12.8 14.2 12 13.9C10.9 13.5 10.1 13 10.1 12C10.1 10.9 11.1 10.1 12.3 10.1C13.4 10.1 14.2 10.7 14.4 11.8H13.8Z"
              fill="white"
            />
          </svg>
        );

      case 'Amazon':
        return (
          <svg
            className={`${iconSize} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Amazon 'a' with the famous orange smile curve */}
            <circle cx="12" cy="12" r="10.5" fill="#232F3E" />
            <path
              d="M12.2 7.5C10.4 7.5 9.2 8.5 8.9 9.9L10.3 10.2C10.5 9.4 11.1 8.8 12.1 8.8C13.1 8.8 13.8 9.3 13.8 10.3V10.8C13.2 10.8 12.3 10.8 11.2 11C9.6 11.3 8.5 12.1 8.5 13.4C8.5 14.6 9.4 15.4 10.7 15.4C11.8 15.4 12.7 14.8 13.2 14.1V15.2H14.6V10.4C14.6 8.5 13.6 7.5 12.2 7.5ZM13.2 12.3C13.2 13.3 12.2 14.2 11.1 14.2C10.4 14.2 9.9 13.8 9.9 13.2C9.9 12.4 10.5 12 11.6 11.8C12.2 11.7 12.8 11.7 13.2 11.7V12.3Z"
              fill="#FFFFFF"
            />
            <path
              d="M7.5 17.2C10.5 19 14.2 18.7 16.8 16.5M16.8 16.5L15.6 15.6M16.8 16.5L16.6 18"
              stroke="#FF9900"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'Mercado Livre':
        return (
          <svg
            className={`${iconSize} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Mercado Livre Yellow Badge with Handshake Icon */}
            <circle cx="12" cy="12" r="10.5" fill="#FFE600" />
            <path
              d="M7 11.5L9.5 9L12.5 12L15 9.5L17.5 12"
              stroke="#2D3277"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 13.5L11 16L13.5 13.5L16 16"
              stroke="#2D3277"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'Shein':
        return (
          <div
            className={`${iconSize} shrink-0 bg-black rounded-full flex items-center justify-center text-white font-black text-[9px] tracking-tighter shadow-2xs`}
          >
            S
          </div>
        );

      case 'Magalu':
        return (
          <svg
            className={`${iconSize} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Magalu Vibrant Blue Circle with 'lu' / 'm' icon */}
            <circle cx="12" cy="12" r="10.5" fill="#0086FF" />
            <path
              d="M7 8V14C7 15.1 7.9 16 9 16C10.1 16 11 15.1 11 14V8"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M13 11V14C13 15.1 13.9 16 15 16C16.1 16 17 15.1 17 14V11"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'AliExpress':
        return (
          <svg
            className={`${iconSize} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* AliExpress Red Circle with Cart Mark */}
            <circle cx="12" cy="12" r="10.5" fill="#E62E04" />
            <path
              d="M7.5 9H16.5L15.5 16H8.5L7.5 9Z"
              fill="#FFFFFF"
            />
            <path
              d="M10 9V7.5C10 6.67 10.67 6 11.5 6H12.5C13.33 6 14 6.67 14 7.5V9"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M9.5 18C10.05 18 10.5 17.55 10.5 17C10.5 16.45 10.05 16 9.5 16C8.95 16 8.5 16.45 8.5 17C8.5 17.55 8.95 18 9.5 18Z"
              fill="#FFFFFF"
            />
            <path
              d="M14.5 18C15.05 18 15.5 17.55 15.5 17C15.5 16.45 15.05 16 14.5 16C13.95 16 13.5 16.45 13.5 17C13.5 17.55 13.95 18 14.5 18Z"
              fill="#FFFFFF"
            />
          </svg>
        );

      default:
        return (
          <div
            className={`${iconSize} shrink-0 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 font-bold text-[9px]`}
          >
            🛍️
          </div>
        );
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {renderIcon()}
      {showName && (
        <span className="font-bold text-xs truncate">{store}</span>
      )}
    </span>
  );
};
