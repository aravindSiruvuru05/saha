interface MainLayoutProps {
  children: JSX.Element;
}
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {children}
    </div>
  );
};
