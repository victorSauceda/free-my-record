import React, { createContext, useState, useContext, ReactNode } from 'react';

interface IUserContext {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
