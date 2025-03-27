// src/context/LoadingContext.tsx
import { createContext, useContext, ReactNode, useState } from 'react';

// 定义 Context 的类型
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// 创建 Context，默认值仅用于未提供 Provider 时的占位符
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider 组件
interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value: LoadingContextType = {
    isLoading,
    setIsLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

// 自定义 Hook
export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export default LoadingContext;